const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, getImages, addReview, getReviews } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getRecipes)
    .post(protect, createRecipe);

router.get('/images', getImages);

router.route('/:id')
    .get(getRecipeById)
    .put(protect, updateRecipe)
    .delete(protect, deleteRecipe);

router.route('/:recipeId/reviews')
    .get(getReviews)
    .post(protect, addReview);

module.exports = router;
