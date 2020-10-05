const router = require('express').Router();
const usersController = require('../controllers/usersController');
router
    .route('/')
    .get(usersController.findAll);

router
    .route('/user/')
    .get(usersController.findByUsername);

router
    .route('/delete/')
    .delete(usersController.delete);

router
    .route('/update/')
    .post(usersController.update);

router
    .route('/leaderboard/')
    .get(usersController.sortUsers);

module.exports = router;