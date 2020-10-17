const PublicRequest = require('../models/publicRequest.model');
const favoursController = require('../controllers/favoursController');
const jwt = require('jsonwebtoken');

//use token payload to get logged in user.
const getLoggedInUser = (req, res) => {
    let token = req.headers.authorization;
    token = token.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.SECRET);
    let username = decodedToken["username"];

    return username;
}

module.exports = {
    findAll: function (req, res) {
        PublicRequest.find()
            .then(requests => {res.json(requests)})
            .catch(err => { res.status(400).json({
                success: false,
                message: `Could not get all the public requests`,
                err: err
            })});
    },
    findById: function (req, res) {
        let id = req.params.id;
        PublicRequest.findById(id)
            .then(request => { res.json(request)})
            .catch(err => {res.status(400).json({
                success: false,
                message: `Could not find public request`,
                err: err
            })});
    },
    findByStatusOpen: function (req, res) {
        PublicRequest.find({ status_open: {$eq: true} })
            .then(requests => {res.json(requests)})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not find any open public requests`,
                err: err
            })});
    },
    findByStatusClose: function (req, res) {
        PublicRequest.find({ status_open: {$eq: false} })
            .then(requests => {res.json(requests)})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not find any closed public requests`,
                err: err
            })});
    },
    findByKeywords: function (req, res) {
        const search = req.query.search;

        PublicRequest.find({description: new RegExp(search, 'i')})
            .then(requests=> {res.json(requests)})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not find any public requests with those keywords`,
                err: err
            })});
    },
    getRewards: function (req, res) {
        const id = req.params.id;

        PublicRequest.findById(id)
            .then(request => {
                res.json(`Rewards: ${request.rewards}`);
            })
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not get all rewards of the public request`,
                err: err
            })});
    },
    findByReward: function (req, res) {
        const search = req.query.search;

        PublicRequest.find({"rewards.item": new RegExp(search, 'i')})
            .then(requests=> {res.json(requests)})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not find public requests with that reward`,
                err: err
            })});
    },
    addReward: function (req, res) {
        const id = req.query.id;
        let username = getLoggedInUser(req, res)
        let newReward = {
            item: req.body.item,
            owed_by: username
        }
        
        PublicRequest.findByIdAndUpdate({ _id: id }, { $push: { rewards: newReward } })
            .then((request) => {
                request.save();
                res.json({
                success: true,
                message: `Successfully added new reward to public request!`
            })})
            .catch(err => res.status(400).json({
                success: false,
                message: `Could not add new reward to the public request`,
                err: err
            }));
        
    },
    deleteReward: function (req, res) {
        const id = req.params.id;
        const item = req.params.item;
        const owed_by = req.params.owed_by;

        PublicRequest.updateOne({ _id: id }, { $pull: { 'rewards' : {'item' : item , 'owed_by' : owed_by}}})
            .then(() => res.json({
                success: true,
                message: `Successfully deleted reward from public request!`
            }))
            .catch(err => res.status(400).json({
                success: false,
                message: `Could not delete reward from the public request`,
                err: err
            }));

    },
    numOfRewards: function (req, res) {
        const id = req.params.id;

        PublicRequest.findById(id)
            .then(request => {
                let length = request.rewards.length;
                res.json(length);
            })
            .catch(err=>res.status(400).json({
                success: false,
                message: `Could not get number of rewards on the public request`,
                err: err
            }));
    },
    add: function (req, res) {
        let username = getLoggedInUser(req, res);
        
        const opened_by = username;
        const description = req.body.description;
        const status_open = true;
        const rewards = [{
            item: req.body.rewards.item,
            owed_by : username
        }]

        const newRequest = new PublicRequest({
            opened_by,
            description,
            status_open,
            rewards
        });

        newRequest.save()
            .then(()=>res.json({
                success: true,
                message: `Successfully created new public request!`
            }))
            .catch(err=>res.status(400).json({
                success: false,
                message: `Could not create the public request`,
                err: err
            }));
    },
    closeRequest: function (req, res) {
        let id = req.params.id;

        PublicRequest.updateOne({ _id: id }, { $set: { "status_open": false, "completed_by": req.body.completed_by } })
            .then(() => { res.json({
                success: true,
                message: `Successfully closed public request!`
            })})
            .catch(err => { res.status(400).json({
                success: false,
                message: `Could not close the public request`,
                err: err
            }) });
        
        
    },
    delete: async function (req, res) {
        let favour = req.query.favour;
        favour = JSON.parse(favour);
        const id = favour._id;
        const username = getLoggedInUser(req, res);

        const created_by = favour.opened_by;
        const owed_by = favour.opened_by;
        const owed_to = username;
        const rewards = favour.rewards;

        let data = {
            created_by,
            owed_by,
            owed_to,
            rewards
        }

        await favoursController.addResolvedRequestFavour(data);
        
        PublicRequest.findByIdAndDelete(id)
            .then(() => { res.json({
                success: true,
                message: `Successfully deleted public request!`
            })})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not delete the public request`,
                err: err
            })});
    }
};

