import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export default function EventCard({ event, delay, onViewDetails }) {
  const isSoldOut = event.seats <= 0;

  return (
    <div 
      className="glass rounded-2xl overflow-hidden border border-white/5 shadow-lg animate-fade-in group cursor-pointer flex flex-col"
      style={{ animationDelay: `${delay}s` }}
      onClick={onViewDetails}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20 flex items-center gap-2">
          {event.category}
          <span className="text-sm">{event.mood}</span>
        </div>
        
        {isSoldOut && (
          <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
            Sold Out
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-slate-300 text-sm gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{event.date}</span>
            <Clock size={16} className="text-primary ml-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-slate-400 text-sm gap-2">
            <MapPin size={16} />
            <span className="truncate">{event.location || "Hybrid / Virtual"}</span>
          </div>
          <div className="flex items-center text-slate-400 text-sm gap-2 mt-1">
             <Users size={16} className={event.seats < 10 ? "text-amber-500" : ""} />
             <span className={event.seats < 10 ? "text-amber-500 font-semibold" : ""}>
               {event.seats > 0 ? `${event.seats} seats available` : "No seats left"}
             </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-xl font-black text-white">
            ${event.price}
          </div>
          <button 
            className="bg-primary hover:bg-opacity-80 px-6 py-2 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
