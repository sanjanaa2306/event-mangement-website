import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({ event, user, onBookingSuccess, onBack, onClose }) {
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState(1);
  const [formData, setFormData] = useState({ name: 'User', email: 'sanja@example.com', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = event.price * tickets;

  const handleBook = async (e) => {
    e.preventDefault();
    setStep(2); // Move to payment simulation
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment delay
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || user?.id, 
          eventId: event.id || event._id,
          timeSlot: event.time,
          tickets: tickets,
          total: totalPrice
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      
      setLoading(false);
      setStep(3); // Success step
      
      // Notify parent to refresh data
      if (onBookingSuccess) onBookingSuccess();
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6d28d9', '#db2777', '#ffffff']
      });

    } catch (err) {
      setLoading(false);
      setError(err.message);
      setStep(1);
    }
  };

  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="bg-[#1e293b] rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in border border-white/10 text-center">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Booking Successful! 🎉</h2>
          <p className="text-slate-300 mb-6">Your tickets for <strong>{event.title}</strong> have been confirmed.</p>
          
          <div className="bg-black/20 rounded-xl p-4 mb-8 text-left border border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Tickets</span>
              <span className="font-bold text-white">{tickets}x</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Total Paid</span>
              <span className="font-bold text-white">${totalPrice}</span>
            </div>
            <div className="text-xs text-amber-400 mt-4 flex gap-2">
               <span>💡</span> Tip: Leave 30 mins early to avoid traffic at {event.location}!
            </div>
          </div>
          
          <button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 font-bold transition">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step === 2 && loading ? null : onBack}></div>
      
      <div className="bg-[#1e293b] rounded-3xl w-full max-w-md relative shadow-2xl animate-fade-in border border-white/10 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-black/20 p-4 flex items-center gap-4 border-b border-white/5">
          <button onClick={onBack} disabled={loading} className="text-slate-400 hover:text-white transition disabled:opacity-50">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">Complete Booking</h2>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 mx-4 mt-4 rounded-lg text-sm border border-red-500/20">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleBook} className="p-6 flex flex-col gap-6">
            
            {/* Ticket Counter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Number of Tickets</h3>
                <p className="text-slate-400 text-sm">${event.price} per ticket</p>
              </div>
              <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1">
                <button type="button" onClick={() => setTickets(Math.max(1, tickets - 1))} className="p-2 hover:bg-white/10 rounded-lg text-white transition">
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg text-white min-w-[20px] text-center">{tickets}</span>
                <button type="button" onClick={() => setTickets(Math.min(event.seats, tickets + 1))} className="p-2 hover:bg-white/10 rounded-lg text-white transition">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition" 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between">
               <div>
                  <div className="text-slate-400 text-sm">Total Amount</div>
                  <div className="text-3xl font-black text-white">${totalPrice}</div>
               </div>
               <button type="submit" className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:scale-105 transition-all">
                 Continue
               </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
             {loading ? (
               <div className="flex flex-col items-center gap-4">
                 <Loader2 size={48} className="text-primary animate-spin" />
                 <h3 className="text-xl font-bold text-white">Processing Payment</h3>
                 <p className="text-slate-400 text-sm text-center">Please do not close this window or click back.</p>
               </div>
             ) : (
               <div className="w-full animate-fade-in">
                 <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                   <CreditCard size={32} className="text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white text-center mb-6">Mock Payment Gateway</h3>
                 <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/5">
                    <div className="flex justify-between text-sm mb-2 text-slate-300">
                      <span>Total Amount:</span>
                      <span className="font-bold">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Merchant:</span>
                      <span className="font-bold">Smart Event Management Inc.</span>
                    </div>
                 </div>
                 <button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition">
                   Pay ${totalPrice} Now
                 </button>
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
