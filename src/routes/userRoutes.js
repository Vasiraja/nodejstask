const express = require('express');
const router = express.Router();
const userController = require('../controllers/Usercontroller');
const multer = require('multer');

 const upload = multer({ dest: 'uploads/' });

 router.post('/signup', upload.single('profileImage'), userController.signup);

 router.post('/login', userController.login);

module.exports = router;
