// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/Usercontroller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/verify/:token', userController.verifyEmail);

module.exports = router;
 