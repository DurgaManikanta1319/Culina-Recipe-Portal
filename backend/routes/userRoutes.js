const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, toggleSaveRecipe, toggleLikeRecipe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/save/:recipeId', protect, toggleSaveRecipe);
router.post('/like/:recipeId', protect, toggleLikeRecipe);

module.exports = router;
