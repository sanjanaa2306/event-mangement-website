// In-memory mock database
const db = {
  users: [
    { 
      id: 1, 
      name: "Sanja", 
      email: "sanja@example.com", 
      password: "password123", 
      badges: ["Silver Participant"],
      profession: "Product Designer",
      interests: ["AI", "UX Design", "Startups"],
      goals: ["Networking", "Learning"],
      avatar: "https://i.pravatar.cc/150?u=1",
      connections: [],
      privacy: { visibility: 'public' }
    },
    // MASSIVE POOL (25+ People) to ensure "Find Your People" always works
    { id: 2, name: "Alex Chen", profession: "Software Engineer", interests: ["AI", "React", "Open Source"], goals: ["Hiring", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=2", connections: [], privacy: { visibility: 'public' } },
    { id: 3, name: "Jordan Smith", profession: "Venture Capitalist", interests: ["Startups", "Fintech", "Business"], goals: ["Investing", "Networking"], avatar: "https://i.pravatar.cc/150?u=3", connections: [], privacy: { visibility: 'public' } },
    { id: 4, name: "Sarah Miller", profession: "Marketing Lead", interests: ["Startups", "Social Media", "AI"], goals: ["Networking", "Partnership"], avatar: "https://i.pravatar.cc/150?u=4", connections: [], privacy: { visibility: 'public' } },
    { id: 5, name: "Devon Knight", profession: "Product Manager", interests: ["UX Design", "Product", "Strategy"], goals: ["Mentoring", "Learning"], avatar: "https://i.pravatar.cc/150?u=5", connections: [], privacy: { visibility: 'public' } },
    { id: 6, name: "Elena Rossi", profession: "Senior UX Designer", interests: ["UX Design", "UI", "Animation"], goals: ["Networking", "Hiring"], avatar: "https://i.pravatar.cc/150?u=6", connections: [], privacy: { visibility: 'public' } },
    { id: 7, name: "Marcus Webb", profession: "Founder", interests: ["Startups", "AI", "SaaS"], goals: ["Hiring", "Investing"], avatar: "https://i.pravatar.cc/150?u=7", connections: [], privacy: { visibility: 'public' } },
    { id: 8, name: "Tanya Gupta", profession: "Full Stack dev", interests: ["React", "AI", "NodeJS"], goals: ["Networking", "Learning"], avatar: "https://i.pravatar.cc/150?u=8", connections: [], privacy: { visibility: 'public' } },
    { id: 9, name: "Vikram Singh", profession: "ML Engineer", interests: ["AI", "Data", "Cloud"], goals: ["Mentoring", "Hiring"], avatar: "https://i.pravatar.cc/150?u=9", connections: [], privacy: { visibility: 'public' } },
    { id: 10, name: "Chloe Bennett", profession: "Brand Designer", interests: ["UX Design", "Branding", "Startups"], goals: ["Partnership", "Networking"], avatar: "https://i.pravatar.cc/150?u=10", connections: [], privacy: { visibility: 'public' } },
    { id: 11, name: "Liam Wu", profession: "Data Scientist", interests: ["AI", "Python", "Business"], goals: ["Networking"], avatar: "https://i.pravatar.cc/150?u=11", connections: [], privacy: { visibility: 'public' } },
    { id: 12, name: "Sophia Lee", profession: "Frontend Architect", interests: ["React", "UX Design", "WASM"], goals: ["Learning"], avatar: "https://i.pravatar.cc/150?u=12", connections: [], privacy: { visibility: 'public' } },
    { id: 13, name: "Noah Brown", profession: "DevOps Lead", interests: ["Cloud", "Security", "SaaS"], goals: ["Hiring"], avatar: "https://i.pravatar.cc/150?u=13", connections: [], privacy: { visibility: 'public' } },
    { id: 14, name: "Olivia Davis", profession: "Content Strategist", interests: ["Startups", "Marketing", "Writing"], goals: ["Networking"], avatar: "https://i.pravatar.cc/150?u=14", connections: [], privacy: { visibility: 'public' } },
    { id: 15, name: "Ethan Jones", profession: "Mobile Dev", interests: ["Swift", "React Native", "AI"], goals: ["Learning"], avatar: "https://i.pravatar.cc/150?u=15", connections: [], privacy: { visibility: 'public' } },
    { id: 16, name: "Ava Garcia", profession: "UX Lead", interests: ["UX Design", "Research", "AI"], goals: ["Hiring"], avatar: "https://i.pravatar.cc/150?u=16", connections: [], privacy: { visibility: 'public' } },
    { id: 17, name: "James Wilson", profession: "Backend Engineer", interests: ["Go", "NodeJS", "Cloud"], goals: ["Networking"], avatar: "https://i.pravatar.cc/150?u=17", connections: [], privacy: { visibility: 'public' } },
    { id: 18, name: "Isabella Martinez", profession: "Product Lead", interests: ["Startups", "Fintech", "Agile"], goals: ["Mentoring"], avatar: "https://i.pravatar.cc/150?u=18", connections: [], privacy: { visibility: 'public' } },
    { id: 19, name: "William Taylor", profession: "Sales Director", interests: ["Business", "Startups", "Golf"], goals: ["Investing"], avatar: "https://i.pravatar.cc/150?u=19", connections: [], privacy: { visibility: 'public' } },
    { id: 20, name: "Mia Anderson", profession: "Freelancer", interests: ["Photography", "UX Design", "Travel"], goals: ["Networking"], avatar: "https://i.pravatar.cc/150?u=20", connections: [], privacy: { visibility: 'public' } },
    // "Super-Matches" - People interested in everything to ensure matches
    { id: 21, name: "Chris Evans", profession: "Creative Director", interests: ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"], goals: ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=21", connections: [], privacy: { visibility: 'public' } },
    { id: 22, name: "Jessica Alba", profession: "Entrepreneur", interests: ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"], goals: ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=22", connections: [], privacy: { visibility: 'public' } },
    { id: 23, name: "Tom Holland", profession: "Actor/Creator", interests: ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"], goals: ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=23", connections: [], privacy: { visibility: 'public' } },
    { id: 24, name: "Zendaya", profession: "Style Icon", interests: ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"], goals: ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=24", connections: [], privacy: { visibility: 'public' } },
    { id: 25, name: "Elon Husk", profession: "Rocket Scientist", interests: ["AI", "Blockchain", "UX Design", "Startups", "Business", "Music", "Photography", "Marketing", "Fitness", "Cloud Computing"], goals: ["Networking", "Hiring", "Learning", "Investing", "Partnership", "Mentoring"], avatar: "https://i.pravatar.cc/150?u=25", connections: [], privacy: { visibility: 'public' } }
  ],
  events: [
    { id: 1, title: "Tech Conference 2026", date: "2026-05-15", time: "10:00", price: 150, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", mood: "🤓", category: "Technology", location: "Hyderabad Convention Center", food: "Lunch + Snacks provided", seats: 100, attendees: [1, 2, 3, 5, 9] },
    { id: 2, title: "Summer Music Festival", date: "2026-06-20", time: "16:00", price: 80, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80", mood: "😍", category: "Music", location: "Central Park Arena", food: "Food trucks available", seats: 500, attendees: [1, 4, 7] },
    { id: 3, title: "Global Entrepreneurship Summit", date: "2026-04-18", time: "09:00", price: 200, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", mood: "🚀", category: "Business", location: "Innovation Hub", food: "Premium Catering", seats: 50, attendees: [12, 18, 21, 25] },
    { id: 4, title: "Creative Design Workshop", date: "2026-04-22", time: "14:00", price: 45, image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80", mood: "🎨", category: "Design", location: "Artistic Studio", food: "Coffee & Snacks", seats: 20, attendees: [6, 10, 16] },
    { id: 5, title: "Cinema Under the Stars", date: "2026-04-30", time: "19:30", price: 25, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80", mood: "🍿", category: "Entertainment", location: "Skyline Rooftop", food: "Gourmet Popcorn Included", seats: 30, attendees: [1, 2, 7] },
    { id: 6, title: "Premium Wellness Retreat", date: "2026-05-02", time: "08:00", price: 180, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", mood: "🧘", category: "Wellness", location: "Serenity Springs", food: "Organic Brunch", seats: 15, attendees: [4, 14, 20] },
    { id: 7, title: "Startup Pitch Battle", date: "2026-05-10", time: "18:00", price: 30, image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80", mood: "💡", category: "Business", location: "The Garage Incubator", food: "Pizza & Drinks", seats: 60, attendees: [3, 8, 21, 22] },
    { id: 8, title: "Art & Wine Evening", date: "2026-05-20", time: "19:00", price: 55, image: "https://images.unsplash.com/photo-1501700489910-fb317ca03b41?w=800&q=80", mood: "🍷", category: "Art", location: "Canvas & Cork Gallery", food: "Premium Wine & Appetizers", seats: 30, attendees: [] },
    { id: 9, title: "AI Strategy Workshop", date: "2026-04-25", time: "10:00", price: 120, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", mood: "🧠", category: "Technology", location: "Future Plaza", food: "Gourmet Lunch Box", seats: 40, attendees: [] },
    { id: 10, title: "Immersive VR Expo", date: "2026-06-05", time: "11:00", price: 40, image: "https://images.unsplash.com/photo-1622979135225-d2ba26971327?w=800&q=80", mood: "🕶️", category: "Technology", location: "Digital Arena", food: "Energy Bar + Soda", seats: 150, attendees: [] },
    { id: 11, title: "Late Night Comedy Special", date: "2026-04-15", time: "22:00", price: 35, image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80", mood: "😂", category: "Entertainment", location: "The Laugh Factory", food: "Drink coupon included", seats: 80, attendees: [] }
  ],
  bookings: [
    { id: 1, userId: 1, eventId: 2, status: "Confirmed", timeSlot: "16:00", total: 100 }
  ],
  leaderboard: [
    { userId: 1, points: 150, name: "Sanja", avatar: "https://i.pravatar.cc/150?u=1" },
    { userId: 2, points: 120, name: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=2" },
    { userId: 3, points: 90, name: "Jordan Smith", avatar: "https://i.pravatar.cc/150?u=3" }
  ],
  matches: [],
  messages: []
};

module.exports = db;
