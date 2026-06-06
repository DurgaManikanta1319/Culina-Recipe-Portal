import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white py-16 px-4 border-t-4 border-[#ff7a00]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                
                {/* Brand Column */}
                <div className="col-span-1 pr-4">
                    <Link to="/" className="flex items-center space-x-3 mb-6">
                        <div className="bg-[#ff7a00] p-1.5 rounded-lg shadow-sm">
                            <Utensils size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold font-serif tracking-wide">Mom's Kitchen Portal</span>
                    </Link>
                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                        A recipe portal where every dish has many faces. Search, cook, and share your food stories.
                    </p>
                </div>

                {/* Explore Column */}
                <div>
                    <h3 className="text-sm font-bold text-white mb-6">Explore</h3>
                    <ul className="space-y-3 text-sm text-[#9ca3af]">
                        <li><Link to="/recipes" className="hover:text-[#ff7a00] transition-colors">Popular Recipes</Link></li>
                        <li><Link to="/recipes" className="hover:text-[#ff7a00] transition-colors">Newest</Link></li>
                        <li><Link to="/recipes?difficulty=Easy" className="hover:text-[#ff7a00] transition-colors">Quick & Easy</Link></li>
                        <li><Link to="/kitchen" className="hover:text-[#ff7a00] transition-colors">Meal Planning</Link></li>
                    </ul>
                </div>

                {/* Cuisines Column */}
                <div>
                    <h3 className="text-sm font-bold text-white mb-6">Cuisines</h3>
                    <ul className="space-y-3 text-sm text-[#9ca3af]">
                        <li><Link to="/recipes?cuisine=Indian" className="hover:text-[#ff7a00] transition-colors">Indian</Link></li>
                        <li><Link to="/recipes?cuisine=Italian" className="hover:text-[#ff7a00] transition-colors">Italian</Link></li>
                        <li><Link to="/recipes?cuisine=Thai" className="hover:text-[#ff7a00] transition-colors">Thai</Link></li>
                        <li><Link to="/recipes?cuisine=Mexican" className="hover:text-[#ff7a00] transition-colors">Mexican</Link></li>
                        <li><Link to="/recipes?cuisine=Chinese" className="hover:text-[#ff7a00] transition-colors">Chinese</Link></li>
                    </ul>
                </div>

                {/* Community Column */}
                <div>
                    <h3 className="text-sm font-bold text-white mb-6">Community</h3>
                    <ul className="space-y-3 text-sm text-[#9ca3af]">
                        <li><Link to="/create-recipe" className="hover:text-[#ff7a00] transition-colors">Share Recipe</Link></li>
                        <li><Link to="/community" className="hover:text-[#ff7a00] transition-colors">Cooking Stories</Link></li>
                        <li><Link to="/community" className="hover:text-[#ff7a00] transition-colors">Forums</Link></li>
                    </ul>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
