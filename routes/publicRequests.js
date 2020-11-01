const router = require('express').Router();
const publicRequestsController = require('../controllers/publicRequestsController');
const passport = require('passport');

router
    .route('/') //returns all public requests 
    .get(publicRequestsController.findAll);

router
    .route('/keywords/') //filters public requests according to keywords
    .get(publicRequestsController.findByKeywords);

router
    .route('/findReward/') //filters public requests according to rewards
    .get(publicRequestsController.findByReward);

router
    .route('/add') //to create a new public request, route is protected thus must be authorised with genuine JWT token
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.add);

router
    .route('/delete/') //to delete a public request, route is protected
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.delete);

router
    .route('/addReward/') //adds a reward to the array of rewards on a public request
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.addReward);

router
    .route('/deleteReward/') //deletes a reward from the array of rewards on a public request
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.deleteReward);

module.exports = router;
