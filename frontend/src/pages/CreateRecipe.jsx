import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Minus, CheckCircle, Image as ImageIcon } from 'lucide-react';

const CreateRecipe = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('Other');
    const [difficulty, setDifficulty] = useState('Medium');
    const [prepTime, setPrepTime] = useState(15);
    const [cookTime, setCookTime] = useState(30);
    const [servings, setServings] = useState(4);
    const [tags, setTags] = useState('');
    const [dietaryType, setDietaryType] = useState('None');
    
    // Ingredients
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
    // Steps
    const [steps, setSteps] = useState(['']);

    // Smart Image System
    const [suggestedImages, setSuggestedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [imageLoading, setImageLoading] = useState(false);

    // Fetch images when title changes (debounced)
    useEffect(() => {
        const fetchImages = async () => {
            if (title.length < 3) return;
            setImageLoading(true);
            try {
                const { data } = await api.get(`/recipes/images?q=${encodeURIComponent(title)}`);
                setSuggestedImages(data);
                if (data.length > 0 && !selectedImage) {
                    setSelectedImage(data[0]); // Auto-select best image
                }
            } catch (error) {
                console.error("Failed to fetch images", error);
            } finally {
                setImageLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchImages();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [title]);

    const handleIngredientChange = (index, field, value) => {
        const newIngs = [...ingredients];
        newIngs[index][field] = value;
        setIngredients(newIngs);
    };

    const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
    const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = () => setSteps([...steps, '']);
    const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            title, description, cuisine, difficulty, 
            prep_time: prepTime, cook_time: cookTime, 
            servings, tags, dietary_type: dietaryType,
            image_url: selectedImage,
            ingredients: ingredients.filter(i => i.name && i.quantity),
            steps: steps.filter(s => s.trim() !== '')
        };

        try {
            await api.post('/recipes', payload);
            toast.success('Recipe created successfully!');
            navigate('/recipes');
        } catch (error) {
            toast.error('Failed to create recipe');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">Create New Recipe</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                
                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-700 border-b pb-2">Basic Details</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipe Title</label>
                        <input 
                            type="text" required
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Spicy Chicken Curry"
                        />
                    </div>

                    {/* Smart Image System UI */}
                    {title.length >= 3 && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                                <ImageIcon size={20} className="text-orange-500"/> 
                                Smart Image Suggestions
                                {imageLoading && <span className="text-sm text-slate-400 font-normal ml-2">Finding images...</span>}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {suggestedImages.map((imgUrl, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${selectedImage === imgUrl ? 'border-orange-500 shadow-md' : 'border-transparent hover:border-orange-300'}`}
                                        onClick={() => setSelectedImage(imgUrl)}
                                    >
                                        <img src={imgUrl} alt="suggestion" className="w-full h-full object-cover" />
                                        {selectedImage === imgUrl && (
                                            <div className="absolute top-1 right-1 bg-white rounded-full text-orange-500">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            required rows="3"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            placeholder="A brief description of your recipe..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={cuisine} onChange={e => setCuisine(e.target.value)}>
                                <option>Italian</option><option>Indian</option><option>Mexican</option><option>American</option><option>Asian</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                <option>Easy</option><option>Medium</option><option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Dietary Type</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={dietaryType} onChange={e => setDietaryType(e.target.value)}>
                                <option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option><option>Keto</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (mins)</label>
                            <input type="number" required className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cook Time (mins)</label>
                            <input type="number" required className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none" value={cookTime} onChange={e => setCookTime(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
                            <input type="number" required className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none" value={servings} onChange={e => setServings(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-2xl font-bold text-slate-700 border-b pb-2">Ingredients</h2>
                    {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <input 
                                type="text" placeholder="Quantity (e.g. 2 cups)" required
                                className="w-1/3 px-4 py-2 border border-slate-300 rounded-lg outline-none"
                                value={ing.quantity} onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                            />
                            <input 
                                type="text" placeholder="Ingredient Name" required
                                className="w-2/3 px-4 py-2 border border-slate-300 rounded-lg outline-none"
                                value={ing.name} onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                            />
                            {ingredients.length > 1 && (
                                <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500 hover:text-red-700">
                                    <Minus size={24} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addIngredient} className="text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">
                        <Plus size={18} /> Add Ingredient
                    </button>
                </div>

                {/* Steps */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-2xl font-bold text-slate-700 border-b pb-2">Instructions</h2>
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className="bg-orange-100 text-orange-600 font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                {idx + 1}
                            </div>
                            <textarea 
                                placeholder={`Step ${idx + 1} description`} required rows="2"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
                                value={step} onChange={(e) => handleStepChange(idx, e.target.value)}
                            ></textarea>
                            {steps.length > 1 && (
                                <button type="button" onClick={() => removeStep(idx)} className="text-red-500 hover:text-red-700 mt-2">
                                    <Minus size={24} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addStep} className="text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">
                        <Plus size={18} /> Add Step
                    </button>
                </div>

                <div className="pt-8">
                    <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg">
                        Publish Recipe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
