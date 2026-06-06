import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Clock, Users, Heart, Bookmark, CheckCircle, Star, Trash2, Printer, Edit3, MessageSquare, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchRecipeAndReviews = async () => {
            try {
                const { data: recipeData } = await api.get(`/recipes/${id}`);
                setRecipe(recipeData);
                const { data: reviewsData } = await api.get(`/recipes/${id}/reviews`);
                setReviews(reviewsData);
            } catch (error) {
                toast.error('Recipe not found');
                navigate('/recipes');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeAndReviews();
    }, [id, navigate]);

    const handleSave = async () => {
        try {
            const { data } = await api.post(`/users/save/${id}`);
            toast.success(data.message);
        } catch (error) {
            toast.error('Failed to save recipe');
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/users/like/${id}`);
            toast.success(data.message);
        } catch (error) {
            toast.error('Failed to like recipe');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await api.delete(`/recipes/${id}`);
                toast.success('Recipe deleted successfully');
                navigate('/recipes');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete recipe');
            }
        }
    };

    const toggleStep = (index) => {
        if (completedSteps.includes(index)) {
            setCompletedSteps(completedSteps.filter(i => i !== index));
        } else {
            setCompletedSteps([...completedSteps, index]);
        }
    };

    const toggleIngredient = (index) => {
        if (checkedIngredients.includes(index)) {
            setCheckedIngredients(checkedIngredients.filter(i => i !== index));
        } else {
            setCheckedIngredients([...checkedIngredients, index]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: recipe.title,
            text: `Check out this amazing recipe for ${recipe.title} on Mom's Kitchen Portal!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                // Some browsers throw AbortError if user cancels the native share sheet, we don't need to toast that.
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                toast.error('Failed to share');
            }
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post(`/recipes/${id}/reviews`, { recipe_id: id, rating, comment });
            setReviews([data, ...reviews]);
            setComment('');
            toast.success('Review submitted!');
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!recipe) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header section */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-10">
                <div className="h-80 w-full relative">
                    <img 
                        src={recipe.image_url || `https://loremflickr.com/1200/600/${encodeURIComponent(recipe.title)},food`} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="text-white">
                            <span className="bg-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">
                                {recipe.difficulty}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{recipe.title}</h1>
                            <p className="text-slate-200 text-lg opacity-90">{recipe.description}</p>
                        </div>
                        <div className="flex gap-3 print:hidden">
                            {user && user.id === recipe.user_id && (
                                <>
                                    <button onClick={() => navigate(`/edit-recipe/${id}`)} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition shadow-lg" title="Edit Recipe">
                                        <Edit3 className="text-white" size={20} />
                                    </button>
                                    <button onClick={handleDelete} className="bg-red-500/80 hover:bg-red-600 backdrop-blur-md p-3 rounded-full transition shadow-lg" title="Delete Recipe">
                                        <Trash2 className="text-white" size={20} />
                                    </button>
                                </>
                            )}
                            <button onClick={handleShare} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition" title="Share Recipe">
                                <Share2 className="text-white" />
                            </button>
                            <button onClick={handlePrint} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition" title="Print Recipe">
                                <Printer className="text-white" />
                            </button>
                            <button onClick={handleLike} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition" title="Like">
                                <Heart className="text-white" />
                            </button>
                            <button onClick={handleSave} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full transition" title="Save">
                                <Bookmark className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex border-t border-slate-100 bg-white">
                    <div className="flex-1 py-4 text-center border-r border-slate-100">
                        <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Prep Time</div>
                        <div className="text-xl font-bold text-slate-800">{recipe.prep_time} m</div>
                    </div>
                    <div className="flex-1 py-4 text-center border-r border-slate-100">
                        <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Cook Time</div>
                        <div className="text-xl font-bold text-slate-800">{recipe.cook_time} m</div>
                    </div>
                    <div className="flex-1 py-4 text-center border-r border-slate-100">
                        <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Servings</div>
                        <div className="text-xl font-bold text-slate-800">{recipe.servings}</div>
                    </div>
                    <div className="flex-1 py-4 text-center">
                        <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Cuisine</div>
                        <div className="text-xl font-bold text-slate-800">{recipe.cuisine}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Ingredients */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            Ingredients
                        </h3>
                        <ul className="space-y-4">
                            {recipe.ingredients?.map((ing, idx) => (
                                <li 
                                    key={idx} 
                                    className="flex items-start gap-3 cursor-pointer group"
                                    onClick={() => toggleIngredient(idx)}
                                >
                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checkedIngredients.includes(idx) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-400'}`}>
                                        {checkedIngredients.includes(idx) && <CheckCircle size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-slate-700 transition-all ${checkedIngredients.includes(idx) ? 'line-through opacity-50' : ''}`}>
                                        <span className="font-semibold">{ing.quantity}</span> {ing.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Steps */}
                <div className="w-full md:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Instructions</h3>
                    <div className="space-y-6">
                        {recipe.steps?.map((step, idx) => (
                            <div 
                                key={idx} 
                                className={`p-6 rounded-2xl border transition-all cursor-pointer ${completedSteps.includes(idx) ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-orange-300'}`}
                                onClick={() => toggleStep(idx)}
                            >
                                <div className="flex gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${completedSteps.includes(idx) ? 'bg-slate-200 text-slate-500' : 'bg-orange-100 text-orange-600'}`}>
                                        {step.step_number}
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-slate-700 text-lg leading-relaxed">{step.instruction}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center print:hidden">
                        <button className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 transition flex items-center gap-2 mx-auto">
                            <CheckCircle /> I Made This!
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 print:hidden">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <MessageSquare className="text-orange-500" /> Ratings & Reviews
                </h3>

                {/* Leave a review */}
                <form onSubmit={submitReview} className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-4">Leave a Review</h4>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button 
                                key={star} type="button" 
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star fill={rating >= star ? '#ff7a00' : 'none'} className={rating >= star ? 'text-orange-500' : 'text-slate-300'} size={28} />
                            </button>
                        ))}
                    </div>
                    <textarea 
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none mb-4"
                        placeholder="What did you think of this recipe?"
                        rows="3" required
                        value={comment} onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition shadow-md">
                        Submit Review
                    </button>
                </form>

                {/* Review List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map((rev, idx) => (
                        <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-slate-800">{rev.name || 'User'}</div>
                                <div className="flex items-center gap-1">
                                    <Star fill="#ff7a00" className="text-orange-500" size={14} />
                                    <span className="text-sm font-bold text-slate-600">{rev.rating}/5</span>
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                            <div className="text-xs text-slate-400 mt-2">
                                {new Date(rev.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    )) : (
                        <div className="text-slate-500 text-center py-4">No reviews yet. Be the first to review!</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
