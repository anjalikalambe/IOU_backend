const router = require('express').Router();
const favoursController = require('../controllers/favoursController');

router
    .route('/owed/')
    .get(favoursController.findFavoursOwed);

router
    .route('/earned/')
    .get(favoursController.findRewardsEarned);

router
    .route('/keywords')
    .get(favoursController.findByKeywords);

router
    .route('/add')
    .post(favoursController.add);

router
    .route('/delete/:id')
    .delete(favoursController.delete);

module.exports = router;
