const router = require('express').Router();
const favoursController = require('../controllers/favoursController');

router
    .route('/')
    .get(favoursController.findAll);

router
    .route('/open')
    .get(favoursController.findByStatusOpen);

router
    .route('/closed')
    .get(favoursController.findByStatusClose);

router
    .route('/keywords')
    .get(favoursController.findByKeywords);

router
    .route('/findReward')
    .get(favoursController.findByReward);

router
    .route('/:id')
    .get(favoursController.findId);

router
    .route('/add')
    .post(favoursController.add);

router
    .route('/update/:id')
    .post(favoursController.updateById);

router
    .route('/delete/:id')
    .delete(favoursController.deleteById);

router
    .route('/rewards/:id')
    .get(favoursController.getRewards);

router
    .route('/addReward/:id')
    .post(favoursController.addReward);

router
    .route('/deleteReward/:id')
    .delete(favoursController.deleteReward);

router
    .route('/totalRewards/:id')
    .get(favoursController.numOfRewards);


module.exports = router;
