const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

const imageFixMap = {
    "Tech Conference 2026":         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    "Summer Music Festival":        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    "Global Entrepreneurship Summit":"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    "Creative Design Workshop":      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
    "Cinema Under the Stars":        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    "Premium Wellness Retreat":      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    "Startup Pitch Battle":          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    "Art & Wine Evening":            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    "AI Strategy Workshop":          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    "Immersive VR Expo":             "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
    "Late Night Comedy Special":     "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    "Gourmet Food Tour":             "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "Deep House Rooftop":            "https://images.unsplash.com/photo-1571266752075-9e7abfb4b82d?w=800&q=80",
    "Yoga at Sunrise":               "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    "Hackathon 48h":                 "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    "Classic Jazz Night":            "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",
};

router.get('/', async (req, res) => {
    try {
        console.log('Fixing images API called...');
        let count = 0;
        for (const [title, image] of Object.entries(imageFixMap)) {
            const result = await Event.updateOne({ title }, { $set: { image } });
            if (result.modifiedCount > 0) count++;
        }
        res.json({ success: true, message: `Fixed ${count} missing images securely.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
