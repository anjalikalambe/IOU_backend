const router = require('express').Router();
const favoursController = require('../controllers/favoursController');

router
    .route('/')
    .get(favoursController.findAll);

router
    .route('/:id')
    .get(favoursController.findById);

router
    .route('/open')
    .get(favoursController.findByStatusOpen);

router
    .route('/closed')
    .get(favoursController.findByStatusClose);

router
    .route('/add')
    .post(favoursController.add);

router
    .route('/update/:id')
    .post(favoursController.updateById);

router
    .route('/keywords')
    .get(favoursController.findByKeywords);

router
    .route('/delete/:id')
    .delete(favoursController.deleteById);


module.exports = router;
