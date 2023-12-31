const express = require('express');
const { signup, verifyOTP } = require('../controllers/user');

const router = express.Router();

// Signup route
router.post('/signup', signup);
router.post('/verifyOTP', verifyOTP);
// router.post('/signin', signin);

module.exports = router;
