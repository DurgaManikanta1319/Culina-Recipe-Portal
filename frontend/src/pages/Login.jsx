import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils, Search, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };



    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#fffdfa]">
            {/* Left Side - Dark Panel */}
            <div className="w-full md:w-1/2 bg-[#3a1c0d] p-10 lg:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b11] to-[#4a2614] opacity-80 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay z-0"></div>
                
                <div className="relative z-10 max-w-lg mx-auto md:mx-0 w-full">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-[#ff7a00] p-2 rounded-xl">
                            <Utensils size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold font-serif tracking-wide">Mom's Kitchen</h2>
                    </div>

                    <p className="text-sm font-semibold tracking-widest text-[#a88d7f] uppercase mb-4">Recipe Portal</p>
                    <h1 className="text-5xl lg:text-6xl font-bold font-serif leading-tight mb-8">
                        Every Dish Has<br/>
                        <span className="text-[#ff7a00]">Many Faces</span>
                    </h1>
                    <p className="text-lg text-[#d1bab0] mb-12 max-w-md leading-relaxed">
                        Search any recipe and see multiple variations — crispy, creamy, spicy, home-style. Pick the one you love.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#4d2c1c]/60 border border-[#5d3b2a] p-5 rounded-2xl backdrop-blur-sm">
                            <Utensils size={20} className="text-[#ff7a00] mb-3" />
                            <div className="font-bold text-lg">2,400+ Recipes</div>
                            <div className="text-sm text-[#b8a296]">Curated from world cuisines</div>
                        </div>
                        <div className="bg-[#4d2c1c]/60 border border-[#5d3b2a] p-5 rounded-2xl backdrop-blur-sm">
                            <Search size={20} className="text-[#ff7a00] mb-3" />
                            <div className="font-bold text-lg">Smart Search</div>
                            <div className="text-sm text-[#b8a296]">See multiple styles per dish</div>
                        </div>
                        <div className="bg-[#4d2c1c]/60 border border-[#5d3b2a] p-5 rounded-2xl backdrop-blur-sm">
                            <Users size={20} className="text-[#ff7a00] mb-3" />
                            <div className="font-bold text-lg">85K+ Cooks</div>
                            <div className="text-sm text-[#b8a296]">Active community</div>
                        </div>
                        <div className="bg-[#4d2c1c]/60 border border-[#5d3b2a] p-5 rounded-2xl backdrop-blur-sm">
                            <Sparkles size={20} className="text-[#ff7a00] mb-3" />
                            <div className="font-bold text-lg">Personalized</div>
                            <div className="text-sm text-[#b8a296]">Tailored for your taste</div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-sm text-[#b8a296] border-t border-[#5d3b2a] pt-8">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-[#3a1c0d] flex items-center justify-center text-xs font-bold text-white">S</div>
                            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[#3a1c0d] flex items-center justify-center text-xs font-bold text-white">K</div>
                            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#3a1c0d] flex items-center justify-center text-xs font-bold text-white">P</div>
                            <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#3a1c0d] flex items-center justify-center text-xs font-bold text-white">C</div>
                        </div>
                        Join 85,000+ home cooks today
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <h2 className="text-4xl font-bold text-[#2d1b11] font-serif mb-2">Welcome Back</h2>
                    <p className="text-[#7d6b61] mb-10">Sign in to access recipes and cooking experiences</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-[#7d6b61] uppercase mb-2">Email</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full px-4 py-3 bg-white border border-[#e5dcd6] rounded-xl focus:ring-2 focus:ring-[#ff7a00] focus:border-[#ff7a00] outline-none transition text-[#2d1b11]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="chef@momskitchen.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-[#7d6b61] uppercase mb-2">Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full px-4 py-3 bg-white border border-[#e5dcd6] rounded-xl focus:ring-2 focus:ring-[#ff7a00] focus:border-[#ff7a00] outline-none transition text-[#2d1b11]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <div className="pt-2 flex flex-col gap-3">
                            <button type="submit" className="w-full bg-[#ff7a00] text-white py-3.5 rounded-xl font-bold hover:bg-[#e66e00] transition shadow-md shadow-orange-500/20 flex justify-center items-center gap-2">
                                Sign In <span className="text-lg leading-none">→</span>
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 text-center text-[#7d6b61] text-sm">
                        Don't have an account? <Link to="/signup" className="text-[#ff7a00] font-bold hover:underline">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
