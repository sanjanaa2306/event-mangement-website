import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, LayoutDashboard, Compass, Sparkles, Binary } from 'lucide-react';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import PersonalDashboard from './components/PersonalDashboard';
import MoodRecommender from './components/MoodRecommender';
import Matchmaker from './components/Matchmaker';
import NetworkingProfile from './components/NetworkingProfile';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';
import CreateEvent from './components/CreateEvent';
import { MessageSquare, LogOut, PlusCircle } from 'lucide-react';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('explore'); // 'explore' | 'dashboard' | 'mood' | 'networking' | 'auth' | 'create-event'
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      // MIGRATION GUARD: If the ID is a number (legacy), clear it and force re-login
      if (typeof savedUser.id === 'number') {
        localStorage.removeItem('user');
        setUser(null);
        setView('auth');
      } else {
        setUser(savedUser);
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("API Error:", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch events", err);
        setLoading(false);
      });
  }, []);

  const handleProfileSave = (profileData) => {
    // 1. Instant Optimistic Update
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowProfileSetup(false);

    // 2. Background Sync
    fetch('/api/networking/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id || user.id, ...profileData })
    }).catch(err => {
      console.error("Background profile sync error", err);
      // Optional: Notify user if sync really failed after the fact
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('auth');
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user && view !== 'auth') {
    setView('auth');
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      {view !== 'auth' && (
        <nav className="glass-header sticky top-0 z-40 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setView('explore')} 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Smart Event Management
            </button>
            
            {user && (
              <div className="hidden md:flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setView('explore')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'explore' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <Compass size={18} /> Explore
                </button>
                <button 
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} /> My Dashboard
                </button>
                <button 
                  onClick={() => setView('mood')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'mood' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <Sparkles size={18} /> Mood
                </button>
                <button 
                  onClick={() => setView('networking')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'networking' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <Binary size={18} /> Matchmaker
                </button>
                <button 
                  onClick={() => setView('create-event')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'create-event' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                  <PlusCircle size={18} /> Host Event
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-48 md:w-64"
                />
              </div>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 bg-white/5 pl-2 pr-1 py-1 rounded-full border border-white/10 group cursor-pointer" onClick={() => setView('dashboard')}>
                  <span className="text-sm font-medium px-2 hidden lg:block group-hover:text-primary transition-colors">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/50">
                    <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="User" />
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={() => setView('auth')} className="bg-primary px-4 py-2 rounded-lg text-sm font-bold">Login</button>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="px-6 py-8 md:py-12 max-w-7xl mx-auto">
        {view === 'explore' && (
          <div className="animate-fade-in">
            <header className="mb-12 md:mb-16">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
                Discover <span className="text-gradient">Extraordinary</span>
                <br /> Experiences.
              </h1>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl">
                Book your tickets for the best events around the world. Tech conferences, music festivals, comedy nights, and more.
              </p>
            </header>

            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
              Trending Events
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-96 skeleton w-full"></div>
                ))}
              </div>
            ) : (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-400">No events found matching "{searchQuery}"</p>
                    <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold hover:underline">Clear Search</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.slice(0, 9).map((event, index) => (
                      <EventCard 
                        key={event._id || event.id} 
                        event={event} 
                        delay={index * 0.1}
                        onViewDetails={() => setSelectedEvent(event)} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'auth' && (
          <Auth onLoginSuccess={(userData) => {
            setUser(userData);
            setView('explore');
          }} />
        )}

        {view === 'dashboard' && (
          <PersonalDashboard 
            key={refreshKey} 
            user={user} 
            onEventClick={setSelectedEvent} 
          />
        )}

        {view === 'mood' && (
          <div className="animate-fade-in max-w-4xl mx-auto py-10">
            <MoodRecommender onEventClick={setSelectedEvent} />
          </div>
        )}

        {view === 'networking' && (
          <div className="animate-fade-in">
            {!user?.profession || showProfileSetup ? (
              <NetworkingProfile 
                user={user} 
                onSave={handleProfileSave} 
                onCancel={() => setShowProfileSetup(false)} 
              />
            ) : (
              <div className="space-y-10">
                <div className="flex justify-between items-end max-w-md mx-auto">
                   <div>
                     <h2 className="text-3xl font-black text-white italic tracking-tighter">FIND YOUR CLAN</h2>
                     <p className="text-slate-400 text-sm">Swipe right to connect with professionals.</p>
                   </div>
                   <button 
                     onClick={() => setShowProfileSetup(true)}
                     className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                   >
                     Edit Profile
                   </button>
                </div>
                <Matchmaker user={user} />
              </div>
            )}
          </div>
        )}

        {view === 'create-event' && (
          <CreateEvent 
            user={user} 
            onSuccess={() => {
              setView('explore');
              setRefreshKey(prev => prev + 1); // Refresh user bookings if needed, but here it's events
              // Note: We might want to trigger a refetch of events here
              fetch('/api/events')
                .then(res => res.json())
                .then(data => setEvents(data));
            }}
            onCancel={() => setView('explore')}
          />
        )}
      </div>

      {/* Modal overlays */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          user={user}
          onBookingSuccess={() => setRefreshKey(prev => prev + 1)}
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {/* Floating Chat System */}
      {user && (
        <>
          <button 
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-opacity-80 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 group pointer-events-auto"
          >
            <MessageSquare size={24} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
               Open Messages
            </span>
          </button>

          {showChat && (
            <ChatInterface user={user} onClose={() => setShowChat(false)} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
