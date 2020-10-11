const router = require('express').Router();
const favoursController = require('../controllers/favoursController');
const passport = require('passport');
const multer = require('multer');

//config for multer - used to upload images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname.split(" ").join("_")}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error("Only upload jpg, jpeg or png files."), false);
    }
}

//insitalises multer and sets the destination where the uploaded images will be saved.
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter }); 


//routes
router
    .route('/owed')
    .get(passport.authenticate('jwt', {session: false}), favoursController.findFavoursOwed);

router
    .route('/earned')
    .get(passport.authenticate('jwt', {session: false}), favoursController.findRewardsEarned);

router
    .route('/completedFavours')
    .get(passport.authenticate('jwt', {session: false}), favoursController.completedFavoursOwed);

router
    .route('/receivedRewards')
    .get(passport.authenticate('jwt', {session: false}), favoursController.completedRewardsEarned);

router
    .route('/add')
    .post(passport.authenticate('jwt', { session: false }), upload.single('favourImage'), favoursController.add);

router
    .route('/repaid')
    .post(passport.authenticate('jwt', {session: false}), upload.single('favourImage'), favoursController.done);

router
    .route('/delete/')
    .delete(passport.authenticate('jwt', { session: false }), favoursController.delete);

router
    .route('/getOpenImgName/')
    .get(passport.authenticate('jwt', { session: false }), favoursController.getOpenImgName);

router
    .route('/getClosedImgName/')
    .get(passport.authenticate('jwt', { session: false }), favoursController.getClosedImgName);

module.exports = router;
