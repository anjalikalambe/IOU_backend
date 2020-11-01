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
        // date added to filename to give a unique name - otherwise files will overwrite each other.
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname.split(" ").join("_")}`);
    }
});
const fileFilter = (req, file, cb) => {
    // accept only images
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error("Only upload jpg, jpeg or png files."), false);
    }
}

//insitalises multer and sets the destination where the uploaded images will be saved.
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter }); 


//routes associated with favours - routes are protected, thus authentic jwt token required to access
router
    .route('/owed') //shows all favours owed by an user
    .get(passport.authenticate('jwt', {session: false}), favoursController.findFavoursOwed);

router
    .route('/earned') //shows all favours earned by an user
    .get(passport.authenticate('jwt', {session: false}), favoursController.findRewardsEarned);

router
    .route('/add') // adds a new favour or reward
    .post(passport.authenticate('jwt', { session: false }), upload.single('favourImage'), favoursController.add);

router
    .route('/resolve') // resolves existing favour or reward
    .post(passport.authenticate('jwt', {session: false}), upload.single('favourImage'), favoursController.done);

router 
    .route('/createRequestRewards') // adds favours to user when user completes a public request 
    .post(passport.authenticate('jwt', { session: false }), upload.single('favourImage'), favoursController.addResolvedRequestFavour)

router 
    .route('/detectParty') // detects any loops where people owe each other favours
    .get(favoursController.detectParty)

module.exports = router;
