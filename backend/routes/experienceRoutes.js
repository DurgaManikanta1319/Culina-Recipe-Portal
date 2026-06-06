const express = require('express');
const router = express.Router();
const { addExperience, getExperiences } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getExperiences)
    .post(protect, addExperience);

module.exports = router;
