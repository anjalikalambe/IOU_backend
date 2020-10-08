const router = require('express').Router();
const favoursController = require('../controllers/favoursController');
const passport = require('passport');

router
    .route('/owed/')
    .get(passport.authenticate('jwt', {session: false}), favoursController.findFavoursOwed);

router
    .route('/earned/')
    .get(passport.authenticate('jwt', {session: false}), favoursController.findRewardsEarned);

router
    .route('/keywords')
    .get(passport.authenticate('jwt', {session: false}), favoursController.findByKeywords);

router
    .route('/add')
    .post(passport.authenticate('jwt', {session: false}), favoursController.add);

router
    .route('/delete/:id')
    .delete(passport.authenticate('jwt', {session: false}), favoursController.delete);

module.exports = router;
