import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, Star, ChevronRight } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
    // Determine pill color based on difficulty
    const diffColor = recipe.difficulty === 'Easy' ? 'text-green-600' : 
                      recipe.difficulty === 'Medium' ? 'text-orange-500' : 'text-red-500';

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[#e5dcd6] group flex flex-col h-full">
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={recipe.image_url || `https://loremflickr.com/800/600/${encodeURIComponent(recipe.title)},food`} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Cuisine Pill - Top Left */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2d1b11] shadow-sm">
                    {recipe.cuisine || 'Other'}
                </div>

                {/* Difficulty Pill - Bottom Right */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <span className={diffColor}>{recipe.difficulty || 'Medium'}</span>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#2d1b11] font-serif mb-2 line-clamp-1">{recipe.title}</h3>
                <p className="text-sm text-[#7d6b61] mb-6 line-clamp-2 flex-grow">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-xs font-semibold text-[#a88d7f] mb-6">
                    <div className="flex items-center gap-1 text-[#ff7a00]">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <span className="text-[#2d1b11] ml-1">4.8</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame size={14} />
                            <span>{recipe.servings ? recipe.servings * 120 : 420}</span>
                        </div>
                    </div>
                </div>
                
                <Link to={`/recipes/${recipe.id}`} className="mt-auto inline-flex items-center font-bold text-[#ff7a00] hover:text-[#e66e00] transition-colors group/link">
                    View Recipe <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default RecipeCard;
