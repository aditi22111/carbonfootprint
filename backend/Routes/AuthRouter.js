const { signup, login, updateUserDetails, getDashboard, calculateFootprintHandler } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const ensureAuthenticated = require('../Middlewares/Auth'); // Import authentication middleware

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/updateUserDetails', ensureAuthenticated, updateUserDetails); // Use ensureAuthenticated here
router.get('/dashboard', ensureAuthenticated, getDashboard);
router.post('/calculateFootprint', ensureAuthenticated, calculateFootprintHandler);


module.exports = router;
