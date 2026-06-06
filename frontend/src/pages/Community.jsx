import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Star, MessageCircle, Heart, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Community = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const { data } = await api.get('/experiences');
                setExperiences(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    if (loading) return <div className="text-center py-20">Loading community experiences...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Cooking Experiences</h1>
                <p className="text-lg text-slate-500">Read stories, tips, and reviews from chefs around the world.</p>
            </div>

            <div className="space-y-8">
                {experiences.length > 0 ? experiences.map(exp => (
                    <div key={exp.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{exp.user_name}</div>
                                    <div className="text-xs text-slate-500">
                                        {new Date(exp.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 text-orange-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < exp.rating ? 'currentColor' : 'none'} />
                                ))}
                            </div>
                        </div>

                        {exp.recipe_title && (
                            <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                Cooked: {exp.recipe_title}
                            </div>
                        )}

                        <p className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                            "{exp.story}"
                        </p>

                        {exp.tips && (
                            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                                <div className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                                    💡 Chef's Tip
                                </div>
                                <p className="text-sm text-slate-600">{exp.tips}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-sm font-semibold pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-1 text-slate-500">
                                <span className="text-slate-400">Difficulty:</span> <span className="text-slate-700">{exp.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                                <span className="text-slate-400">Would cook again:</span> <span className={exp.would_cook_again ? 'text-green-600' : 'text-red-500'}>{exp.would_cook_again ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                        No experiences shared yet. Be the first to share!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
