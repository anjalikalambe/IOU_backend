const router = require('express').Router();
const usersController = require('../controllers/usersController');
const passport = require('passport');

router
    .route('/')
    .get(passport.authenticate('jwt', {session: false}), usersController.findAll);

router
    .route('/delete/')
    .delete(passport.authenticate('jwt', {session: false}), usersController.delete);

router
    .route('/update/')
    .post(passport.authenticate('jwt', {session: false}), usersController.update);

router
    .route('/leaderboard/')
    .get(usersController.sortUsers);

module.exports = router;