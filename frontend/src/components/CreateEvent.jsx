import { useState } from 'react';
import { Calendar, Clock, DollarSign, Image as ImageIcon, Sparkles, Tag, ArrowLeft, Send } from 'lucide-react';

const CreateEvent = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        price: '',
        mood: '🎟️',
        category: '',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const eventData = {
            ...formData,
            description: formData.description || "Amazing new event hosted by " + user.name
        };

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to create event');
            }
        } catch (err) {
            setError('Server error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto py-6">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={onCancel}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Host an Event</h1>
                    <p className="text-slate-400">Fill in the details below to publish your event.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="flex-[3]">
                    <div className="glass p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="E.g., Summer Music Festival"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Mood Emoji</label>
                                    <div className="relative">
                                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="mood"
                                            placeholder="E.g., 😍"
                                            maxLength="2"
                                            value={formData.mood}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="category"
                                            placeholder="E.g., Music"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="image"
                                            placeholder="https://images.unsplash.com/..."
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    placeholder="Tell people more about your event..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Publishing...' : (
                                    <>
                                        Publish Event
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex-[2]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        Live Preview <Sparkles className="text-primary" size={20} />
                    </h3>
                    <div className="glass overflow-hidden sticky top-24 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="relative h-56 overflow-hidden">
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
                            />
                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest">
                                {formData.category || 'Category'}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-white leading-tight">
                                    {formData.title || 'Your Event Title'}
                                </h3>
                                <div className="text-3xl">{formData.mood}</div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Calendar size={16} className="text-primary" />
                                    {formData.date || 'Date TBD'}
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Clock size={16} className="text-primary" />
                                    {formData.time || 'Time TBD'}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div className="text-3xl font-black text-white">
                                    ${formData.price || '0'}
                                </div>
                                <button disabled className="bg-primary/20 text-primary px-6 py-2 rounded-xl font-bold opacity-50 cursor-not-allowed">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
