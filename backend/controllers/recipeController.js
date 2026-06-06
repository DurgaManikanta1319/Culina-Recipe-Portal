const db = require('../config/db');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
    try {
        const { search, cuisine, difficulty, dietary_type } = req.query;
        let query = 'SELECT * FROM Recipes WHERE 1=1';
        let params = [];
        let count = 1;

        if (search) {
            query += ` AND (title ILIKE $${count} OR tags ILIKE $${count})`;
            params.push(`%${search}%`);
            count++;
        }
        if (cuisine) {
            query += ` AND cuisine = $${count}`;
            params.push(cuisine);
            count++;
        }
        if (difficulty) {
            query += ` AND difficulty = $${count}`;
            params.push(difficulty);
            count++;
        }
        if (dietary_type) {
            query += ` AND dietary_type = $${count}`;
            params.push(dietary_type);
            count++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching recipes' });
    }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Recipes WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        const recipe = result.rows[0];

        // Get ingredients
        const ingResult = await db.query(
            `SELECT i.name, ri.quantity FROM Ingredients i 
             JOIN Recipe_Ingredients ri ON i.id = ri.ingredient_id 
             WHERE ri.recipe_id = $1`, [recipe.id]
        );
        recipe.ingredients = ingResult.rows;

        // Get steps
        const stepResult = await db.query('SELECT * FROM Steps WHERE recipe_id = $1 ORDER BY step_number', [recipe.id]);
        recipe.steps = stepResult.rows;

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
    const { title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url, tags, dietary_type, ingredients, steps } = req.body;
    
    try {
        await db.query('BEGIN');

        // Insert Recipe
        const recipeResult = await db.query(
            `INSERT INTO Recipes (user_id, title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url, tags, dietary_type) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [req.user.id, title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url, tags, dietary_type]
        );
        const recipeId = recipeResult.rows[0].id;

        // Insert Ingredients
        if (ingredients && ingredients.length > 0) {
            for (let ing of ingredients) {
                // Check if ingredient exists
                let ingRes = await db.query('SELECT id FROM Ingredients WHERE name = $1', [ing.name]);
                let ingId;
                if (ingRes.rows.length > 0) {
                    ingId = ingRes.rows[0].id;
                } else {
                    let newIng = await db.query('INSERT INTO Ingredients (name) VALUES ($1) RETURNING id', [ing.name]);
                    ingId = newIng.rows[0].id;
                }
                // Link
                await db.query('INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [recipeId, ingId, ing.quantity]);
            }
        }

        // Insert Steps
        if (steps && steps.length > 0) {
            for (let i = 0; i < steps.length; i++) {
                await db.query('INSERT INTO Steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)', [recipeId, i + 1, steps[i]]);
            }
        }

        await db.query('COMMIT');
        res.status(201).json(recipeResult.rows[0]);
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error creating recipe' });
    }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
    const { title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url, tags, dietary_type, ingredients, steps } = req.body;
    try {
        const recipeRes = await db.query('SELECT * FROM Recipes WHERE id = $1', [req.params.id]);
        if (recipeRes.rows.length === 0) return res.status(404).json({ message: 'Recipe not found' });
        
        if (recipeRes.rows[0].user_id !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await db.query('BEGIN');

        // Update main recipe
        const updated = await db.query(
            `UPDATE Recipes SET 
             title = $1, description = $2, cuisine = $3, difficulty = $4, 
             prep_time = $5, cook_time = $6, servings = $7, image_url = $8, 
             tags = $9, dietary_type = $10 
             WHERE id = $11 RETURNING *`, 
            [title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url, tags, dietary_type, req.params.id]
        );

        // Update Ingredients (Delete old, insert new)
        if (ingredients && ingredients.length > 0) {
            await db.query('DELETE FROM Recipe_Ingredients WHERE recipe_id = $1', [req.params.id]);
            for (let ing of ingredients) {
                let ingRes = await db.query('SELECT id FROM Ingredients WHERE name = $1', [ing.name]);
                let ingId;
                if (ingRes.rows.length > 0) {
                    ingId = ingRes.rows[0].id;
                } else {
                    let newIng = await db.query('INSERT INTO Ingredients (name) VALUES ($1) RETURNING id', [ing.name]);
                    ingId = newIng.rows[0].id;
                }
                await db.query('INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [req.params.id, ingId, ing.quantity]);
            }
        }

        // Update Steps (Delete old, insert new)
        if (steps && steps.length > 0) {
            await db.query('DELETE FROM Steps WHERE recipe_id = $1', [req.params.id]);
            for (let i = 0; i < steps.length; i++) {
                await db.query('INSERT INTO Steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)', [req.params.id, i + 1, steps[i].instruction || steps[i]]);
            }
        }

        await db.query('COMMIT');
        res.json(updated.rows[0]);
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Update error:", error);
        res.status(500).json({ message: 'Server error updating recipe' });
    }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
    try {
        const recipeRes = await db.query('SELECT * FROM Recipes WHERE id = $1', [req.params.id]);
        if (recipeRes.rows.length === 0) return res.status(404).json({ message: 'Recipe not found' });
        
        if (recipeRes.rows[0].user_id !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await db.query('DELETE FROM Recipes WHERE id = $1', [req.params.id]);
        res.json({ message: 'Recipe removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting recipe' });
    }
};

// @desc    Smart Image Suggestion
// @route   GET /api/recipes/images
// @access  Public
const getImages = (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    // Simulate image search with dynamic URLs using Unsplash Source/LoremFlickr
    // Providing top 6 relevant images based on query
    const images = [];
    for(let i=1; i<=6; i++) {
        images.push(`https://loremflickr.com/800/600/${encodeURIComponent(q)},food?random=${i}`);
    }
    res.json(images);
};

// Reviews
const addReview = async (req, res) => {
    const { recipe_id, rating, comment } = req.body;
    try {
        const newReview = await db.query(
            'INSERT INTO Reviews (recipe_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [recipe_id, req.user.id, rating, comment]
        );
        res.status(201).json(newReview.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error adding review' });
    }
};

const getReviews = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT r.*, u.name FROM Reviews r JOIN Users u ON r.user_id = u.id WHERE recipe_id = $1 ORDER BY created_at DESC', 
            [req.params.recipeId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, getImages, addReview, getReviews };
