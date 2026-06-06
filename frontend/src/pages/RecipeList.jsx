import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Search, Filter } from 'lucide-react';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (cuisine) queryParams.append('cuisine', cuisine);
            if (difficulty) queryParams.append('difficulty', difficulty);

            const { data } = await api.get(`/recipes?${queryParams.toString()}`);
            setRecipes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [cuisine, difficulty]); // Only refetch automatically on filter change, search needs button/enter

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">All Recipes</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by recipe name, ingredient or tag..." 
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white text-slate-700"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                        >
                            <option value="">All Cuisines</option>
                            <option value="Italian">Italian</option>
                            <option value="Indian">Indian</option>
                            <option value="Mexican">Mexican</option>
                            <option value="American">American</option>
                            <option value="Asian">Asian</option>
                            <option value="Other">Other</option>
                        </select>
                        <select 
                            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white text-slate-700"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <button type="submit" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20 text-orange-500 font-bold">Loading recipes...</div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    No recipes match your filters. Try adjusting your search!
                </div>
            )}
        </div>
    );
};

export default RecipeList;
