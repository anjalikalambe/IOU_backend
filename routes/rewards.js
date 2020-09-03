const router = require('express').Router();
const rewardsController = require('../controllers/rewardsController');

router
    .route('/')
    .get(rewardsController.findAll);

router
    .route('/:id')
    .get(rewardsController.findById);

router
    .route('/add')
    .post(rewardsController.add);

router
    .route('/keywords')
    .get(rewardsController.findByKeywords);

router
    .route('/delete/:id')
    .delete(rewardsController.deleteById);


module.exports = router;
