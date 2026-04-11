import { useState, useEffect } from 'react';
import { Heart, X, Star, Bookmark, Briefcase, Zap, MessageCircle, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';

export default function Matchmaker({ user }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [lastMatch, setLastMatch] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async (reset = false) => {
    const uid = user?._id || user?.id;
    if (!uid) return;
    setIsRefreshing(true);
    try {
      const url = `/api/networking/matches/${uid}${reset ? '?reset=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      const updatedData = data.map((m, i) => ({
        ...m,
        isNew: matches.length > 0 && !matches.find(pm => (pm._id || pm.id) === (m._id || m.id))
      }));

      setMatches(updatedData);
      setPrevCount(data.length);
      if (reset) setCurrentIndex(0); // Reset for manual refresh
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAction = async (targetId, status) => {
    try {
      const res = await fetch('/api/networking/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || user.id, targetId, status })
      });
      const data = await res.json();
      
      if (data.isMatch) {
         setLastMatch(matches[currentIndex]);
         setShowMatchCelebration(true);
         setTimeout(() => setShowMatchCelebration(false), 5000);
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error("Action error", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (currentIndex >= matches.length) {
    return (
      <div className="text-center py-20 px-6 animate-fade-in">
        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">You've reached the end!</h3>
        <p className="text-slate-400 text-sm mb-10">Wait for more people to join or update your profile.</p>
        
        <button 
          onClick={() => fetchMatches(true)} 
          className="flex items-center gap-3 mx-auto bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 mb-6"
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          Find Your People
        </button>
        
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] animate-pulse">
          Find people who will match your interests
        </p>
      </div>
    );
  }

  const currentProfile = matches[currentIndex];
  const isHighMatch = currentProfile.score >= 80;

  return (
    <div className="max-w-md mx-auto relative perspective-[1000px]">
      
      {/* Dynamic Update Alert */}
      {currentIndex === 0 && matches.some(m => m.isNew) && (
        <div className="absolute -top-12 left-0 right-0 animate-bounce text-center">
           <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
             New Matches Found Based on Updates!
           </span>
        </div>
      )}

      {/* Match Celebration Overlay */}
      {showMatchCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in" onClick={() => setShowMatchCelebration(false)}></div>
           
           {/* Confetti Particles */}
           <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
           </div>

           <div className="relative bg-[#0f172a] p-10 rounded-[3rem] text-center shadow-[0_0_100px_rgba(168,85,247,0.4)] animate-scale-up border border-white/10 max-w-sm w-full z-10">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                 <CheckCircle2 size={80} className="mx-auto text-primary relative z-10" />
              </div>
              <h2 className="text-5xl font-black text-white mb-3 italic tracking-tighter uppercase leading-none">It's a<br/><span className="text-secondary">Match!</span></h2>
              <p className="text-slate-300 font-bold mb-10 text-sm">You and {lastMatch?.name} just crossed professional paths.</p>
              
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => setShowMatchCelebration(false)}
                   className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white font-black py-5 rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                 >
                   <MessageCircle size={20} /> Start Conversation
                 </button>
                 <button 
                   onClick={() => setShowMatchCelebration(false)}
                   className="w-full bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-3 rounded-2xl transition-all text-[10px] uppercase tracking-[0.2em]"
                 >
                   Keep Swiping
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Card */}
      <div className={`glass rounded-[2rem] overflow-hidden relative shadow-2xl transition-all duration-500 border border-white/5 animate-fade-in ${isHighMatch ? 'shadow-[0_0_30px_rgba(99,102,241,0.3)] ring-2 ring-primary/20' : ''}`}>
        <div className="h-[400px] relative">
          <img src={currentProfile.avatar} alt={currentProfile.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {currentProfile.isNew && (
              <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">New Match</span>
            )}
            {isHighMatch && (
              <span className="bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                <Star size={10} fill="currentColor" /> Top Match
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2 group cursor-pointer relative">
               <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded italic shadow-lg ${isHighMatch ? 'bg-primary text-white' : 'bg-white/20 text-white'}`}>
                 {currentProfile.score}% Compatibility 
               </span>
               <div className="absolute bottom-full left-0 mb-2 w-48 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-[8px] text-slate-300 font-medium">
                  Matches on: {currentProfile.mutualInterests.join(', ')}
               </div>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase leading-none">
              {currentProfile.name}
            </h2>
            <p className="text-slate-300 font-medium flex items-center gap-2 text-sm">
              <Briefcase size={14} className="text-primary" /> {currentProfile.profession}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/reason relative">
             <div className="text-[10px] uppercase font-black text-primary tracking-widest mb-2 italic flex items-center gap-2">
                <Zap size={12} fill="currentColor" /> Why you match
             </div>
             <p className="text-sm text-slate-300 italic">“{currentProfile.matchReason}”</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {currentProfile.mutualInterests.map(interest => (
              <span key={interest} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-tighter">
                #{interest}
              </span>
            ))}
          </div>

          <div className="flex justify-between gap-3 pt-6">
            <button 
              onClick={() => handleAction(currentProfile._id || currentProfile.id, 'skipped')}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-rose-500/20 hover:text-rose-500 transition-all active:scale-95 shadow-lg"
            >
              <X size={24} />
            </button>
            <button 
              onClick={() => handleAction(currentProfile._id || currentProfile.id, 'accepted')}
              className="flex-1 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all px-4 active:scale-95"
            >
              <UserCheck size={18} /> Connect Now
            </button>
            <button 
              onClick={() => handleAction(currentProfile._id || currentProfile.id, 'saved')}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all active:scale-95 shadow-lg"
            >
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Refresh Option */}
      <div className="mt-8 text-center">
         <button 
           onClick={fetchMatches}
           className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all flex items-center gap-2 mx-auto"
         >
           <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
           Refresh Global Matches
         </button>
      </div>
    </div>
  );
}
