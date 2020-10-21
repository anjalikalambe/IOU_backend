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
    .route('/delete/')
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.delete);

router
    .route('/rewards/:id')
    .get(publicRequestsController.getRewards);

router
    .route('/addReward/')
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.addReward);

router
    .route('/deleteReward/')
    .post(passport.authenticate('jwt', {session: false}), publicRequestsController.deleteReward);

router
    .route('/totalRewards/:id')
    .get(publicRequestsController.numOfRewards);

module.exports = router;
