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
    //returns all public requests in collection
    findAll: function (req, res) {
        PublicRequest.find()
            .then(requests => {res.json(requests)})
            .catch(err => { res.status(400).json({
                success: false,
                message: `Could not get all the public requests`,
                err: err
            })});
    },
    //filters the public requests using the keword sent, function uses mongodb's regex filter to search 
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
    //filters the public requests using the reward sent, function uses regex not sensitive to character case
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
    // adds a reward to the array of rewards on a publci request
    addReward: function (req, res) {
        const id = req.query.id;
        let username = getLoggedInUser(req, res)
        let newReward = {
            item: req.body.item,
            owed_by: username
        }
        // mongodb's push allows instant update to nested array in document.
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
    // deletes a reward from the array of rewards on a public request
    deleteReward: async function (req, res) {
        const id = req.query.id;
        const item = req.body.item;
        const owed_by = getLoggedInUser(req, res);
        let numRewards;

        // mongodb's pull allows instant update to nested array in document after by removing the specified element.
        await PublicRequest.findOneAndUpdate({ _id: id }, { $pull: { 'rewards' : {'item' : item , 'owed_by' : owed_by}}})
            .then(() => res.json({
                success: true,
                message: `Successfully deleted reward from public request!`
            }))
            .catch(err => res.status(400).json({
                success: false,
                message: `Could not delete reward from the public request`,
                err: err
            }));
        
        await PublicRequest.findById(id)
            .then(request => {
                numRewards = request.rewards.length; // find how many rewards are left on the public request
            })
        
        //if num of rewards is zero then according to spec, public request needs to be deleted
        if (numRewards === 0) {
            PublicRequest.findByIdAndDelete(id)
                .then(console.log("deleted"))
        }

    },
    // create and save a new public request to the collection of public requests
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
    // deletes public request using id passed once it has been completed. 
    delete: async function (req, res) {        
        PublicRequest.findByIdAndDelete(req.body.id)
            .then(() => { res.json({
                success: true,
                message: `Successfully deleted public request and resolved rewards!`
            })})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not delete the public request`,
                err: err
            })
            });
        
    }
};

