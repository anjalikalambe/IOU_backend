const router = require('express').Router();
const usersController = require('../controllers/authController');

router
    .route('/register') // to create new account
    .post(usersController.register);
    
router
    .route('/login') // to login to existing account
    .post(usersController.login);

router 
    .route('/verifyToken') // to verify token from frontend - used to protect fronted routes.
    .get(usersController.verifyToken);

module.exports = router;
