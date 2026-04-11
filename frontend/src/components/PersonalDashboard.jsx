import { useState, useEffect } from 'react';
import { Ticket, Star, TrendingUp, Calendar, ChevronRight, Loader2, Users } from 'lucide-react';

export default function PersonalDashboard({ user, onEventClick, onBrowseEvents }) {
  const [bookings, setBookings] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, leaderboardRes] = await Promise.all([
          fetch(`/api/bookings/user/${user._id || user.id}`),
          fetch(`/api/gamification/leaderboard`)
        ]);

        const bookingsData = await bookingsRes.json();
        const leaderboardData = await leaderboardRes.json();

        setBookings(bookingsData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-slate-400">Loading your personal dashboard...</p>
      </div>
    );
  }

  const userStats = leaderboard.find(l => l.userId?.toString() === user.id?.toString()) || { points: bookings.length * 50 };

  return (
    <div className="animate-fade-in space-y-8">
      {/* "Older Version" Welcome Banner */}
      <section className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden mb-10">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
            Welcome back, <span className="text-gradient font-black italic">{user.name}</span>! 👋
          </h1>
          <p className="text-slate-400 text-base font-medium max-w-xl">
            Ready to discover your next unforgettable experience?
          </p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={onBrowseEvents}
              className="bg-primary hover:bg-opacity-90 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/30 text-sm uppercase tracking-widest"
            >
              Browse Events
            </button>
          </div>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Bookings */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-3">
              <Calendar className="text-primary" /> Your Upcoming Bookings
            </h2>
            
            {bookings.length === 0 ? (
              <div className="bg-white/5 border border-dashed border-white/10 p-12 rounded-[2rem] text-center">
                 <p className="text-slate-400 font-medium mb-4">No upcoming events found.</p>
                 <button className="text-primary font-bold hover:underline">Find one now!</button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => onEventClick(booking.eventId)}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                      <img src={booking.eventId?.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold truncate group-hover:text-primary transition-colors">{booking.eventId?.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{booking.timeSlot}</span>
                        <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                        <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">{booking.status}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Networking Match Highlights (Simplified) */}
          <div className="pt-6 border-t border-white/5">
             <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Networking Pulse</h2>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { name: "Alex Chen", role: "Developer", img: "https://i.pravatar.cc/150?u=2" },
                  { name: "Chloe Bennett", role: "Designer", img: "https://i.pravatar.cc/150?u=10" }
                ].map((m, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white/5 pl-2 pr-4 py-2 rounded-full border border-white/10 hover:border-primary/30 transition-all cursor-pointer">
                    <img src={m.img} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                    <div className="text-[10px] font-black text-white uppercase tracking-tight">{m.name}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Stats & Community */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bookings</p>
                  <div className="text-2xl font-black text-white">{bookings.length}</div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Points</p>
                  <div className="text-2xl font-black text-amber-500">{userStats.points}</div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Top Community</h2>
            <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
               {leaderboard.slice(0, 4).map((entry, idx) => (
                 <div key={entry.userId} className={`p-4 flex items-center gap-3 ${idx < 3 ? 'border-b border-white/5' : ''}`}>
                   <span className="text-[10px] font-black text-slate-600 w-4">{idx + 1}</span>
                   <img src={entry.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                   <div className="flex-1">
                      <div className="text-[11px] font-black text-white uppercase">{entry.name}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{entry.points} XP</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
