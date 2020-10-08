const router = require('express').Router();
const publicRequestsController = require('../controllers/publicRequestsController');
const passport = require('passport');

router
    .route('/')
    .get(publicRequestsController.findAll);

router
    .route('/open')
    .get(publicRequestsController.findByStatusOpen);

router
    .route('/closed')
    .get(publicRequestsController.findByStatusClose);

router
    .route('/keywords/')
    .get(publicRequestsController.findByKeywords);

router
    .route('/findReward/')
    .get(publicRequestsController.findByReward);

router
    .route('/:id')
    .get(publicRequestsController.findById);

router
    .route('/add')
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.add);

router
    .route('/closeRequest/:id')
    .post(publicRequestsController.closeRequest);

router
    .route('/delete/:id')
    .delete(passport.authenticate('jwt', {session: false}), publicRequestsController.deleteById);

router
    .route('/rewards/:id')
    .get(publicRequestsController.getRewards);

router
    .route('/addReward/:id')
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.addReward);

router
    .route('/deleteReward/:id')
    .delete(passport.authenticate('jwt', {session: false}), publicRequestsController.deleteReward);

router
    .route('/totalRewards/:id')
    .get(publicRequestsController.numOfRewards);

module.exports = router;
