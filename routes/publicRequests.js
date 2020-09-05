const router = require('express').Router();
const publicRequestsController = require('../controllers/publicRequestsController');

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
    .post(publicRequestsController.add);

router
    .route('/closeRequest/:id')
    .post(publicRequestsController.closeRequest);

router
    .route('/delete/:id')
    .delete(publicRequestsController.deleteById);

router
    .route('/rewards/:id')
    .get(publicRequestsController.getRewards);

router
    .route('/addReward/:id')
    .post(publicRequestsController.addReward);

router
    .route('/deleteReward/:id')
    .delete(publicRequestsController.deleteReward);

router
    .route('/totalRewards/:id')
    .get(publicRequestsController.numOfRewards);

module.exports = router;
