import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: 'sanja@example.com', 
        password: 'password123',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // --- THE CHANGES ARE HERE! ---
        const baseUrl = 'https://your-new-render-url.onrender.com'; // REPLACE THIS LATER!
        const url = isLogin ? `${baseUrl}/api/auth/login` : `${baseUrl}/api/auth/register`;
        
        const body = isLogin 
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (res.ok && data.token) {
                window.alert(isLogin ? "Login successful 🎉" : "Signup successful 🎉");
                localStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 md:p-12 animate-fade-in">
                {/* ... The rest of your HTML form is exactly the same below! ... */}
