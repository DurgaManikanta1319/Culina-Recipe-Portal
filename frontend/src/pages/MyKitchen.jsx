import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { User, Bookmark, Heart, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';

const MyKitchen = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('my_recipes');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setProfile(data);
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center py-20">Loading your kitchen...</div>;
    if (!profile) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 z-10 border-4 border-white shadow-lg">
                    <User size={64} />
                </div>
                <div className="z-10 text-center md:text-left flex-1">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">{profile.name}</h1>
                    <p className="text-slate-500 mb-6">{profile.email}</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                            <div className="text-2xl font-bold text-orange-500">{profile.stats.saved}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Saved</div>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                            <div className="text-2xl font-bold text-orange-500">{profile.stats.liked}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Liked</div>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                            <div className="text-2xl font-bold text-orange-500">{profile.stats.cooked}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cooked</div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative background shape */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-50 rounded-full z-0 opacity-50"></div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
                <button 
                    onClick={() => setActiveTab('my_recipes')}
                    className={`px-8 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'my_recipes' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><ChefHat size={18}/> My Recipes</div>
                </button>
                <button 
                    onClick={() => setActiveTab('saved_recipes')}
                    className={`px-8 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'saved_recipes' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><Bookmark size={18}/> Saved Recipes</div>
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'my_recipes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profile.myRecipes?.length > 0 ? profile.myRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        )) : (
                            <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                                You haven't created any recipes yet.
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'saved_recipes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profile.savedRecipes?.length > 0 ? profile.savedRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        )) : (
                            <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                                You haven't saved any recipes yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyKitchen;
