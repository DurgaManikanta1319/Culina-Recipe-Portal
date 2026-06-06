import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Search, Sparkles, Users, ChefHat } from 'lucide-react';

const CATEGORIES = [
    { name: 'Indian', count: 24, image: 'https://loremflickr.com/400/400/indian,food/all' },
    { name: 'Italian', count: 18, image: 'https://loremflickr.com/400/400/italian,food/all' },
    { name: 'American', count: 42, image: 'https://loremflickr.com/400/400/burger,food/all' },
    { name: 'Asian', count: 31, image: 'https://loremflickr.com/400/400/asian,food/all' },
    { name: 'Mexican', count: 10, image: 'https://loremflickr.com/400/400/mexican,food/all' },
    { name: 'Desserts', count: 20, image: 'https://loremflickr.com/400/400/dessert,food/all' },
];

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await api.get('/recipes');
                setRecipes(data.slice(0, 6)); // Top 6 for home
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const filters = ['All', 'Italian', 'Asian', 'Indian', 'American', 'Mexican', 'French'];

    const displayedRecipes = activeFilter === 'All' 
        ? recipes 
        : recipes.filter(r => r.cuisine === activeFilter);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (loading) return <div className="text-center py-20 text-[#ff7a00] font-bold">Loading...</div>;

    return (
        <div className="bg-[#fffdfa] min-h-screen">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
                
                {/* Left Side - Text & Search */}
                <div className="flex-1 w-full flex flex-col items-start pt-6 lg:pt-0">
                    <div className="inline-flex items-center gap-2 bg-[#ffeedb] text-[#ff7a00] font-bold px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <Sparkles size={16} /> Discover 2,400+ Recipes
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-bold font-serif text-[#2d1b11] leading-tight mb-6">
                        Cook Like <span className="text-[#ff7a00]">Mom</span>,<br/>
                        Eat Like <span className="text-[#ff7a00]">Royalty</span>
                    </h1>
                    
                    <p className="text-[#7d6b61] text-lg mb-10 max-w-lg leading-relaxed">
                        From crispy Masala Dosa to creamy Butter Chicken — search any dish and see multiple styles to choose from.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-xl mb-6 relative flex items-center">
                        <div className="flex-grow flex items-center bg-white border border-[#ff7a00]/30 rounded-2xl p-2 shadow-sm focus-within:border-[#ff7a00] focus-within:ring-2 focus-within:ring-[#ff7a00]/20 transition-all">
                            <Search className="text-[#ff7a00] ml-3" size={24} />
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 outline-none text-[#2d1b11] placeholder:text-[#b8a296] bg-transparent"
                                placeholder="Search recipes (e.g., Masala Dosa)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-[#ff7a00] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#e66e00] transition-colors shadow-md">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-[#b8a296] font-semibold mr-1">Try:</span>
                        {['Masala Dosa', 'Biryani', 'Butter Chicken', 'Idly', 'Pasta'].map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => navigate(`/recipes?search=${encodeURIComponent(tag)}`)}
                                className="bg-white border border-[#e5dcd6] text-[#7d6b61] px-4 py-1.5 rounded-full hover:border-[#ff7a00] hover:text-[#ff7a00] transition-colors font-medium shadow-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side - Image & Badges */}
                <div className="flex-1 w-full relative pl-0 lg:pl-10">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                        <img 
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80" 
                            alt="Cooking aesthetic" 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Top Right Badge */}
                    <div className="absolute top-8 right-[-10px] md:right-0 lg:-right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-10 animate-bounce-slow">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Users className="text-green-500" size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-[#2d1b11] leading-tight">85K+</div>
                            <div className="text-xs text-[#a88d7f] font-semibold">Home Cooks</div>
                        </div>
                    </div>

                    {/* Bottom Left Badge */}
                    <div className="absolute bottom-8 left-[-10px] md:left-4 lg:-left-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-10">
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <ChefHat className="text-[#ff7a00]" size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-[#2d1b11] leading-tight">2,400+</div>
                            <div className="text-xs text-[#a88d7f] font-semibold">Verified Recipes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Recipes Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <p className="text-[#ff7a00] text-sm font-bold tracking-widest uppercase mb-2">Curated Collection</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#2d1b11] font-serif">Featured Recipes</h1>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        {filters.map(filter => (
                            <button 
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition-all border ${activeFilter === filter ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-md shadow-orange-500/20' : 'bg-white text-[#2d1b11] border-[#e5dcd6] hover:border-[#ff7a00]'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {displayedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#e5dcd6] text-[#7d6b61]">
                        No recipes found for this category. Be the first to add one!
                    </div>
                )}
            </div>

            {/* Explore Categories Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 mb-16">
                <div className="text-center mb-12">
                    <p className="text-[#ff7a00] text-sm font-bold tracking-widest uppercase mb-2">Browse By Cuisine</p>
                    <h2 className="text-4xl font-bold text-[#2d1b11] font-serif">Explore Categories</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map(category => (
                        <Link to={`/recipes?cuisine=${category.name}`} key={category.name} className="relative h-40 md:h-48 rounded-3xl overflow-hidden group block">
                            <img 
                                src={category.image} 
                                alt={category.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                                <h3 className="text-lg font-bold font-serif mb-0.5">{category.name}</h3>
                                <p className="text-xs text-white/80">{category.count} recipes</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* About Section */}
            <div className="bg-gradient-to-r from-[#ff8c00] to-[#ff7a00] py-20 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold font-serif mb-6">About Mom's Kitchen</h2>
                    <p className="text-lg text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
                        Mom's Kitchen Portal is a community-driven recipe platform where home cooks share their family recipes, cooking experiences, and food stories. We believe every dish has many faces — find the style that speaks to you.
                    </p>
                    
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <div className="border border-white/30 rounded-2xl p-6 min-w-[200px] bg-white/5 hover:bg-white/10 transition-colors cursor-default shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold font-serif mb-1">2,400<span className="text-xl">+</span></div>
                            <div className="text-white/80 text-sm font-medium">Recipes</div>
                        </div>
                        <div className="border border-white/30 rounded-2xl p-6 min-w-[200px] bg-white/5 hover:bg-white/10 transition-colors cursor-default shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold font-serif mb-1">85K<span className="text-xl">+</span></div>
                            <div className="text-white/80 text-sm font-medium">Home Cooks</div>
                        </div>
                        <div className="border border-white/30 rounded-2xl p-6 min-w-[200px] bg-white/5 hover:bg-white/10 transition-colors cursor-default shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold font-serif mb-1">45<span className="text-xl">+</span></div>
                            <div className="text-white/80 text-sm font-medium">Cuisines</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
