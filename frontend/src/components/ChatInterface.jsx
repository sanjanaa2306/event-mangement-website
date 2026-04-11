import { useState, useEffect } from 'react';
import { MessageCircle, Send, X, User, ChevronLeft, Sparkles, Coffee, Calendar, Wand2, MapPin, Clock } from 'lucide-react';

export default function ChatInterface({ user, onClose }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { matchId, otherUser }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      // Initialize with mock messages
      setMessages([
        { id: 1, from: 'other', text: `Hey! Saw your profile at the Tech Conference. Would love to talk AI.`, time: '10:30 AM' },
        { id: 2, from: 'me', text: "Hey! Definitely, I saw you're into React and Open Source too.", time: '10:35 AM' }
      ]);
    }
  }, [activeChat]);

  const fetchChats = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/networking/chat-list/${user.id}`);
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.error("Chats fetch error", err);
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleProposeMeetup = () => {
    const inviteMsg = {
      id: Date.now(),
      from: 'me',
      type: 'invite',
      location: 'Networking Lounge (Hall 3)',
      timeSlot: '11:45 AM - Tomorrow',
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, inviteMsg]);
  };

  const generateSmartIcebreaker = () => {
    const interest = user.interests?.[0] || 'innovative tech';
    const prompts = [
      `Hey ${activeChat.otherUser.name}, I noticed we're both into ${interest}. Are you attending the keynote session on that today?`,
      "Would love to hear your thoughts on the latest trends in our industry. Grab a coffee?",
      `Quick question - noticed you mentioned ${user.goals?.[0] || 'networking'} as a goal. Any specific speakers you're excited about?`
    ];
    setNewMessage(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  if (loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
       
       {activeChat ? (
          <div className="w-80 md:w-96 h-[580px] bg-[#0f172a] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col pointer-events-auto animate-slide-up overflow-hidden ring-1 ring-white/10">
             {/* Chat Header */}
             <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/10 rounded-full transition">
                      <ChevronLeft size={20} className="text-slate-400" />
                   </button>
                   <div className="relative">
                     <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-lg">
                        <img src={activeChat.otherUser.avatar} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
                   </div>
                   <div>
                      <div className="text-sm font-black text-white italic tracking-tighter uppercase">{activeChat.otherUser.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{activeChat.otherUser.profession}</div>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition"><X size={20} /></button>
             </div>

             {/* Rapo Tools */}
             <div className="px-4 py-3 bg-primary/5 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2 text-[8px] font-black uppercase tracking-widest text-primary italic">
                   <Sparkles size={10} fill="currentColor" /> Rapo Icebreakers
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                   {[
                     `Ask about ${interest}`,
                     "Propose coffee",
                     "Magic Prompt"
                   ].map((pill, i) => (
                     <button 
                       key={i}
                       onClick={() => pill === 'Magic Prompt' ? generateSmartIcebreaker() : setNewMessage(pill === 'Propose coffee' ? "Hey! Would you like to meet for a quick coffee at the venue's Networking Lounge tomorrow at 11 AM?" : `Hey, noticed we both like ${interest}. Thoughts?`)}
                       className="flex-shrink-0 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-[9px] font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                     >
                       {pill === 'Magic Prompt' ? <div className="flex items-center gap-1"><Wand2 size={10} /> {pill}</div> : pill}
                     </button>
                   ))}
                </div>
             </div>

             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-black/20 to-transparent custom-scrollbar">
                {messages.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {msg.type === 'invite' ? (
                        <div className="w-full max-w-[90%] bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 rounded-3xl p-5 shadow-2xl animate-pulse-slow">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                 <Coffee size={20} />
                              </div>
                              <div>
                                 <div className="text-[10px] uppercase font-black tracking-widest text-primary italic">Meeting Proposal</div>
                                 <div className="text-sm font-bold text-white">Networking Coffee</div>
                              </div>
                           </div>
                           <div className="space-y-2 mb-5">
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                 <MapPin size={12} className="text-primary" /> {msg.location}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                 <Clock size={12} className="text-primary" /> {msg.timeSlot}
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border border-white/5 transition">Edit</button>
                              <button className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl shadow-lg transition opacity-50 cursor-not-allowed">Waiting</button>
                           </div>
                        </div>
                      ) : (
                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                           msg.from === 'me' 
                           ? 'bg-gradient-to-br from-primary to-indigo-600 text-white rounded-tr-none' 
                           : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
                        }`}>
                           {msg.text}
                           <div className={`text-[8px] mt-2 opacity-60 font-medium ${msg.from === 'me' ? 'text-right' : 'text-left'}`}>
                              {msg.time}
                           </div>
                        </div>
                      )}
                   </div>
                ))}
             </div>

             {/* Proposed Meetup Tool */}
             <div className="px-5 py-2">
                <button 
                  onClick={handleProposeMeetup}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl transition-all group"
                >
                   <Coffee size={14} className="group-hover:rotate-12 transition-transform" /> Propose Quick Meetup
                </button>
             </div>

             {/* Input Area */}
             <div className="p-5 bg-white/5 backdrop-blur-md">
                <div className="flex gap-3 items-center">
                   <button 
                     onClick={generateSmartIcebreaker}
                     className="text-slate-500 hover:text-white transition group relative"
                   >
                      <Wand2 size={20} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 bg-black/80 text-[8px] text-white p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">Magic Icebreaker</div>
                   </button>
                   <input 
                     type="text" 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                     placeholder="Type a message..."
                     className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:border-primary outline-none transition shadow-inner"
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={!newMessage.trim()}
                     className={`p-3 rounded-2xl transition shadow-lg ${newMessage.trim() ? 'bg-primary text-white scale-100 hover:scale-105 active:scale-95' : 'bg-white/5 text-slate-600 scale-90'}`}
                   >
                      <Send size={20} />
                   </button>
                </div>
             </div>
          </div>
       ) : (
          <div className="w-80 h-[450px] bg-[#0f172a] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col pointer-events-auto animate-slide-up ring-1 ring-white/10 overflow-hidden">
             <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                <h3 className="font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                   <MessageCircle size={20} className="text-primary" /> Messages
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition"><X size={20} /></button>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                         <MessageCircle size={32} />
                      </div>
                      <p className="text-sm font-black text-white italic uppercase tracking-widest">No connections yet</p>
                      <p className="text-xs text-slate-400 mt-2">Find your clan in the Matchmaker to start chatting!</p>
                   </div>
                ) : (
                   <div className="divide-y divide-white/5">
                      {chats.map(chat => (
                         <button 
                           key={chat.matchId}
                           onClick={() => setActiveChat(chat)}
                           className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition text-left group border-l-4 border-transparent hover:border-primary"
                         >
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
                               <img src={chat.otherUser.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="text-sm font-black text-white italic tracking-tighter uppercase truncate">{chat.otherUser.name}</div>
                               <div className="text-[10px] text-slate-400 truncate mt-1 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"></div> {chat.lastMessage}
                               </div>
                            </div>
                         </button>
                      ))}
                   </div>
                )}
             </div>
          </div>
       )}
    </div>
  );
}
