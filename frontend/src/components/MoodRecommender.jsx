import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

const MOODS = [
  { emoji: '🤓', label: 'Professional', color: 'from-blue-500 to-indigo-500' },
  { emoji: '🤩', label: 'Excited', color: 'from-pink-500 to-rose-500' },
  { emoji: '😌', label: 'Relaxed', color: 'from-emerald-400 to-teal-500' },
  { emoji: '😂', label: 'Fun', color: 'from-amber-400 to-orange-500' },
  { emoji: '😍', label: 'Social', color: 'from-purple-500 to-secondary' },
];

export default function MoodRecommender({ onEventClick }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async (moodEmoji) => {
    setLoading(true);
    setSelectedMood(moodEmoji);
    try {
      const res = await fetch('/api/mood/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodEmoji })
      });
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error("Mood fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2rem] border-primary/20 relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-xl text-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">How are you feeling today?</h2>
            <p className="text-slate-400 text-sm">Pick a mood and we'll find the perfect event for your vibe.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              onClick={() => getRecommendation(m.emoji)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border ${
                selectedMood === m.emoji 
                ? `bg-gradient-to-r ${m.color} text-white border-transparent shadow-lg shadow-white/5` 
                : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : recommendations.length > 0 && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-2">
               <div className="h-[1px] w-8 bg-primary/30"></div>
               Suggested for your mood
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(0, 2).map((event) => (
                <div 
                  key={event._id || event.id} 
                  onClick={() => onEventClick(event)}
                  className="bg-black/20 hover:bg-black/40 border border-white/5 hover:border-primary/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all group/card"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate">{event.title}</h4>
                    <p className="text-slate-400 text-xs mt-1 truncate">{event.date} • ${event.price}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover/card:bg-primary group-hover/card:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
