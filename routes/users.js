const router = require('express').Router();
const usersController = require('../controllers/usersController');

router
    .route('/')
    .get(usersController.findAll);

router
    .route('/:id')
    .get(usersController.findById);

router
    .route('/add')
    .post(usersController.add);

router
    .route('/delete/:id')
    .delete(usersController.deleteById);


module.exports = router;