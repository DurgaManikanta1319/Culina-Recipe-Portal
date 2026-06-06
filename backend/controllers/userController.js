const db = require('../config/db');

// @desc    Get user profile & stats
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const userRes = await db.query('SELECT id, name, email, bio FROM Users WHERE id = $1', [req.user.id]);
        if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = userRes.rows[0];

        // Preferences
        const prefRes = await db.query('SELECT dietary_preferences, cuisines FROM User_Preferences WHERE user_id = $1', [req.user.id]);
        if (prefRes.rows.length > 0) {
            user.preferences = prefRes.rows[0];
        }

        // Stats
        const savedRes = await db.query('SELECT COUNT(*) FROM Saved_Recipes WHERE user_id = $1', [req.user.id]);
        const likedRes = await db.query('SELECT COUNT(*) FROM Likes WHERE user_id = $1', [req.user.id]);
        const cookedRes = await db.query('SELECT COUNT(*) FROM Cooking_Experiences WHERE user_id = $1', [req.user.id]);
        
        user.stats = {
            saved: parseInt(savedRes.rows[0].count),
            liked: parseInt(likedRes.rows[0].count),
            cooked: parseInt(cookedRes.rows[0].count)
        };

        // My recipes
        const myRecipes = await db.query('SELECT * FROM Recipes WHERE user_id = $1', [req.user.id]);
        user.myRecipes = myRecipes.rows;

        // Saved recipes detailed
        const mySaved = await db.query(`
            SELECT r.* FROM Recipes r
            JOIN Saved_Recipes sr ON r.id = sr.recipe_id
            WHERE sr.user_id = $1
        `, [req.user.id]);
        user.savedRecipes = mySaved.rows;

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const { name, bio, dietary_preferences, cuisines } = req.body;
    try {
        await db.query('UPDATE Users SET name = $1, bio = $2 WHERE id = $3', [name, bio, req.user.id]);
        
        // Update preferences
        const prefCheck = await db.query('SELECT * FROM User_Preferences WHERE user_id = $1', [req.user.id]);
        if (prefCheck.rows.length > 0) {
            await db.query('UPDATE User_Preferences SET dietary_preferences = $1, cuisines = $2 WHERE user_id = $3', [dietary_preferences, cuisines, req.user.id]);
        } else {
            await db.query('INSERT INTO User_Preferences (user_id, dietary_preferences, cuisines) VALUES ($1, $2, $3)', [req.user.id, dietary_preferences, cuisines]);
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// @desc    Save/Unsave recipe
// @route   POST /api/users/save/:recipeId
// @access  Private
const toggleSaveRecipe = async (req, res) => {
    try {
        const check = await db.query('SELECT * FROM Saved_Recipes WHERE user_id = $1 AND recipe_id = $2', [req.user.id, req.params.recipeId]);
        if (check.rows.length > 0) {
            await db.query('DELETE FROM Saved_Recipes WHERE user_id = $1 AND recipe_id = $2', [req.user.id, req.params.recipeId]);
            res.json({ message: 'Recipe unsaved' });
        } else {
            await db.query('INSERT INTO Saved_Recipes (user_id, recipe_id) VALUES ($1, $2)', [req.user.id, req.params.recipeId]);
            res.json({ message: 'Recipe saved' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling save' });
    }
};

// @desc    Like/Unlike recipe
// @route   POST /api/users/like/:recipeId
// @access  Private
const toggleLikeRecipe = async (req, res) => {
    try {
        const check = await db.query('SELECT * FROM Likes WHERE user_id = $1 AND recipe_id = $2', [req.user.id, req.params.recipeId]);
        if (check.rows.length > 0) {
            await db.query('DELETE FROM Likes WHERE user_id = $1 AND recipe_id = $2', [req.user.id, req.params.recipeId]);
            res.json({ message: 'Recipe unliked' });
        } else {
            await db.query('INSERT INTO Likes (user_id, recipe_id) VALUES ($1, $2)', [req.user.id, req.params.recipeId]);
            res.json({ message: 'Recipe liked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling like' });
    }
};

module.exports = { getUserProfile, updateUserProfile, toggleSaveRecipe, toggleLikeRecipe };
