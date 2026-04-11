const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Match = require('../models/Match');
const Message = require('../models/Message');

// Get match suggestions
router.get('/matches/:userId', async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // DEMO HACK: If the user specifically asks to refresh/reset
        if (req.query.reset === 'true') {
            user.connections = [];
            await user.save();
        }

        const allUsers = await User.find({ _id: { $ne: userId } });
        
        const candidates = [];
        for (const u of allUsers) {
            const visibility = u.privacy?.visibility || 'public';
            if (visibility === 'ghost') continue;
            
            if (visibility === 'event') {
                const sharedEvents = await Event.find({
                    attendees: { $all: [userId, u._id] }
                });
                if (sharedEvents.length === 0) continue;
            }
            candidates.push(u);
        }

        const matches = candidates.map(c => {
            // Calculate score
            let score = 0;
            const mutualInterests = (user.interests || []).filter(i => (c.interests || []).includes(i));
            const mutualGoals = (user.goals || []).filter(g => (c.goals || []).includes(g));

            if (mutualInterests.length > 0) score += 60 + (mutualInterests.length * 5);
            if (mutualGoals.length > 0) score += 20 + (mutualGoals.length * 5);
            
            score = Math.min(score, 99);

            let matchReason = `You both are interested in ${mutualInterests[0] || 'networking'}.`;
            if (mutualInterests.length > 1) matchReason = `Shared interests in ${mutualInterests.slice(0, 2).join(' & ')}.`;
            if (mutualGoals.length > 0) matchReason += ` Plus, you both aim for ${mutualGoals[0]}.`;

            const connection = (user.connections || []).find(conn => conn.userId.toString() === c._id.toString());

            return {
                id: c._id,
                name: c.name,
                profession: c.profession,
                avatar: c.avatar,
                interests: c.interests,
                goals: c.goals,
                score: score || 45,
                mutualInterests: mutualInterests.length > 0 ? mutualInterests : ["Networking"],
                matchReason: mutualInterests.length > 0 ? matchReason : "Our AI suggests you crossed paths in the professional ecosystem.",
                status: connection ? connection.status : 'new'
            };
        })
        .filter(m => m.status === 'new')
        .sort((a, b) => b.score - a.score);

        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Sync Profile
router.post('/profile', async (req, res) => {
    try {
        const { userId, profession, interests, goals, privacy } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profession,
            interests,
            goals,
            privacy
        }, { new: true });
        
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Connect / Skip / Save
router.post('/connect', async (req, res) => {
    try {
        const { userId, targetId, status } = req.body;
        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if (!user || !target) return res.status(404).json({ message: "User not found" });

        // Update connection
        const existing = user.connections.find(c => c.userId.toString() === targetId);
        if (existing) {
            existing.status = status;
        } else {
            user.connections.push({ userId: targetId, status });
        }
        await user.save();

        // Check if it's a match
        let isMatch = false;
        if (status === 'accepted') {
            const targetConn = target.connections.find(c => c.userId.toString() === userId);
            if (targetConn && targetConn.status === 'accepted') {
                isMatch = true;
                const existingMatch = await Match.findOne({ users: { $all: [userId, targetId] } });
                if (!existingMatch) {
                    await Match.create({ users: [userId, targetId] });
                }
            }
        }

        res.json({ success: true, isMatch });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get matches (chat list)
router.get('/chat-list/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userMatches = await Match.find({ users: userId }).populate('users');
        
        const chatList = await Promise.all(userMatches.map(async m => {
            const otherUser = m.users.find(u => u._id.toString() !== userId);
            const lastMsg = await Message.findOne({
                $or: [
                    { from: userId, to: otherUser._id },
                    { from: otherUser._id, to: userId }
                ]
            }).sort({ createdAt: -1 });

            return {
                matchId: m._id,
                otherUser: {
                    id: otherUser._id,
                    name: otherUser.name,
                    avatar: otherUser.avatar,
                    profession: otherUser.profession
                },
                lastMessage: lastMsg ? lastMsg.text : "Start a conversation!"
            };
        }));

        res.json(chatList);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
