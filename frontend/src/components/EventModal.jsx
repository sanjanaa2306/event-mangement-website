import { useState } from 'react';
import { Calendar, Clock, MapPin, Share2, Ticket, Users, Coffee, X, Star } from 'lucide-react';
import BookingModal from './BookingModal';

export default function EventModal({ event, user, onBookingSuccess, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const isSoldOut = event.seats <= 0;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const downloadICS = () => {
    // Generate basic ICS file
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00Z\nLOCATION:${event.location}\nDESCRIPTION:${event.description}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Added to Calendar!");
  };

  const shareEvent = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard!");
  };

  if (showBooking) {
    return (
      <BookingModal 
        event={event} 
        user={user}
        onBookingSuccess={onBookingSuccess}
        onBack={() => setShowBooking(false)} 
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-[#1e293b] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in border border-white/10 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-md transition-all"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image & Hero info */}
        <div className="w-full md:w-2/5 relative h-64 md:h-auto">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1e293b] via-[#1e293b]/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {event.category} {event.mood}
            </span>
            <h2 className="text-3xl font-bold text-white mt-4">{event.title}</h2>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative">
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <Calendar className="text-primary mt-1" size={20} />
              <div>
                <div className="text-xs text-slate-400">Date</div>
                <div className="font-semibold text-white">{event.date}</div>
                <div className="text-sm text-slate-300">{event.time}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <div className="text-xs text-slate-400">Location</div>
                <div className="font-semibold text-white">{event.location || "Hybrid"}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <Coffee className="text-amber-400 mt-1" size={20} />
              <div>
                <div className="text-xs text-slate-400">Food & Drinks</div>
                <div className="font-semibold text-white text-sm">{event.food || "Not included"}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <Users className={event.seats < 10 ? "text-amber-500 mt-1" : "text-emerald-400 mt-1"} size={20} />
              <div>
                <div className="text-xs text-slate-400">Availability</div>
                <div className="font-semibold text-white">{event.seats > 0 ? `${event.seats} Seats left` : "Sold Out"}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">About this Event</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {event.description}
            </p>
          </div>

          {/* Top Networkers Section */}
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">Featured Networkers</h4>
                <div className="flex -space-x-3">
                   {[1, 2, 3, 4].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-[#1e293b]" alt="Attendee" />
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                     +12
                   </div>
                </div>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {/* Simulated profiles based on event categories */}
                {[
                  { name: "Alex K.", role: "CEO @ TechFlow", img: "https://i.pravatar.cc/150?u=2", match: "High Match", score: 92 },
                  { name: "Jordan S.", role: "Lead Dev", img: "https://i.pravatar.cc/150?u=3", match: "90% Vibe", score: 88 }
                ].map((p, i) => (
                  <div key={i} className={`flex-shrink-0 bg-white/5 p-3 rounded-xl border border-white/5 w-40 transition-all cursor-pointer group hover:border-primary/50 ${p.score >= 80 ? 'ring-1 ring-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''}`}>
                     <div className="relative mb-2">
                        <img src={p.img} className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                        <span className={`absolute top-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${p.score >= 80 ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300'}`}>{p.match}</span>
                        {p.score >= 80 && (
                          <div className="absolute -bottom-1 -left-1 bg-amber-500 rounded-full p-1 shadow-lg ring-2 ring-[#1e293b]">
                             <Star size={8} className="text-white" fill="currentColor" />
                          </div>
                        )}
                     </div>
                     <div className="text-sm font-bold text-white truncate">{p.name}</div>
                     <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Action Row */}
          <div className="mt-auto flex flex-col gap-4">
             <div className="flex gap-2">
                <button 
                  onClick={downloadICS}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold transition"
                >
                  <Calendar size={18} /> Add to Calendar
                </button>
                <button 
                  onClick={shareEvent}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold transition"
                >
                  <Share2 size={18} /> Share Event
                </button>
             </div>
             
             {/* Networking Slots Bonus */}
             <div className="flex flex-col gap-2 mb-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Recommended Meeting Slots</div>
                <div className="flex gap-2">
                   {['11:30 AM - Networking Lounge', '2:00 PM - Coffee Stand'].map(slot => (
                     <div 
                       key={slot} 
                       onClick={() => showToast(`Meeting requested for ${slot.split(' - ')[0]}!`)}
                       className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 text-[10px] text-slate-300 font-bold hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer active:scale-95"
                     >
                        {slot}
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-black text-white">${event.price}</div>
                <button 
                  disabled={isSoldOut}
                  onClick={() => setShowBooking(true)}
                  className={`flex-1 flex justify-center items-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    isSoldOut 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-secondary hover:shadow-primary/40 hover:scale-[1.02] text-white'
                  }`}
                >
                  <Ticket size={24} />
                  {isSoldOut ? 'Sold Out' : 'Book Tickets Now'}
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-fade-in z-[60]">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
