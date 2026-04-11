import { useState } from 'react';
import { User, Briefcase, Target, Heart, Check, X } from 'lucide-react';

const INTERESTS_OPTIONS = ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"];
const GOALS_OPTIONS = ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"];

export default function NetworkingProfile({ user, onSave, onCancel }) {
  const [profession, setProfession] = useState(user?.profession || '');
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [selectedGoals, setSelectedGoals] = useState(user?.goals || []);
  const [visibility, setVisibility] = useState(user?.privacy?.visibility || 'public'); // 'public' | 'event' | 'ghost'
  const [isSaving, setIsSaving] = useState(false);

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = () => {
    setIsSaving(true);
    onSave({
      profession,
      interests: selectedInterests,
      goals: selectedGoals,
      privacy: { visibility }
    });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div className="text-center group">
        <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase group-hover:text-primary transition-colors">Refine Your Vibe</h2>
        <p className="text-slate-400 font-medium">Updating your goals will instantly find new connections for you.</p>
      </div>

      <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden ring-1 ring-white/10">
        <div className="space-y-8">
          {/* Profession */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <Briefcase size={12} fill="currentColor" /> Professional Title
             </label>
             <input 
               type="text" 
               value={profession}
               onChange={(e) => setProfession(e.target.value)}
               placeholder="e.g. Senior Visual Designer"
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none transition font-medium placeholder:text-slate-600"
             />
          </div>

          {/* Interests */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <Heart size={12} fill="currentColor" /> Interests & Expertise
             </label>
             <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleItem(interest, selectedInterests, setSelectedInterests)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                      selectedInterests.includes(interest)
                      ? 'bg-primary text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
             </div>
          </div>

          {/* Goals */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <Target size={12} fill="currentColor" /> Networking Goals
             </label>
             <div className="flex flex-wrap gap-2">
                {GOALS_OPTIONS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleItem(goal, selectedGoals, setSelectedGoals)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                      selectedGoals.includes(goal)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
             </div>
          </div>

          {/* Privacy Tiers */}
          <div className="pt-8 border-t border-white/5 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-white font-black italic uppercase tracking-tight text-lg">Visibility Control</h4>
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Decide who can find you in the pool</p>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'public', label: 'Public', desc: 'Seen by all' },
                  { id: 'event', label: 'Event Only', desc: 'Attendees' },
                  { id: 'ghost', label: 'Ghost', desc: 'Hidden' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setVisibility(tier.id)}
                    className={`p-4 rounded-2xl border transition-all text-left ${
                      visibility === tier.id 
                      ? 'bg-white/10 border-primary shadow-lg ring-1 ring-primary' 
                      : 'bg-white/5 border-white/5 text-slate-500 grayscale'
                    }`}
                  >
                    <div className={`text-xs font-black uppercase italic ${visibility === tier.id ? 'text-primary' : ''}`}>{tier.label}</div>
                    <div className="text-[9px] mt-1 font-bold opacity-60">{tier.desc}</div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="flex gap-4 mt-12 relative z-10">
           <button 
             onClick={onCancel}
             disabled={isSaving}
             className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest py-5 rounded-2xl transition-all border border-white/5 disabled:opacity-50"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit}
             disabled={isSaving}
             className="flex-1 bg-gradient-to-r from-primary via-indigo-500 to-secondary text-white text-xs font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-[1.02] transition-all relative overflow-hidden group disabled:grayscale disabled:scale-95"
           >
             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
             {isSaving ? 'Syncing...' : 'Save & Refresh'}
           </button>
        </div>
      </div>
    </div>
  );
}
