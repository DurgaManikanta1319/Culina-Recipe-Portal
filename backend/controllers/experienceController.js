const db = require('../config/db');

// @desc    Add cooking experience
// @route   POST /api/experiences
// @access  Private
const addExperience = async (req, res) => {
    const { recipe_id, story, rating, difficulty, tips, would_cook_again } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Cooking_Experiences 
            (user_id, recipe_id, story, rating, difficulty, tips, would_cook_again) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [req.user.id, recipe_id, story, rating, difficulty, tips, would_cook_again]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding experience' });
    }
};

// @desc    Get all cooking experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
    try {
        const query = `
            SELECT e.*, u.name as user_name, r.title as recipe_title 
            FROM Cooking_Experiences e
            JOIN Users u ON e.user_id = u.id
            LEFT JOIN Recipes r ON e.recipe_id = r.id
            ORDER BY e.created_at DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching experiences' });
    }
};

module.exports = { addExperience, getExperiences };
