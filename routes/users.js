const router = require('express').Router();
const usersController = require('../controllers/usersController');
const passport = require('passport');

//routes associated with users - routes are protected thus require JWT token to be authenticated before accessing.
router
    .route('/') //returns all users 
    .get(passport.authenticate('jwt', {session: false}), usersController.findAll);

router
    .route('/leaderboard/') //returns all users that are on the leaderboard - have earned atleast 1 reward.
    .get(usersController.sortUsers);

module.exports = router;