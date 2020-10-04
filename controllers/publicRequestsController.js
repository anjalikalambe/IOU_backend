const PublicRequest = require('../models/publicRequest.model');

module.exports = {
    findAll: function (req, res) {
        PublicRequest.find()
            .then(requests => {res.json(requests)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findById: function (req, res) {
        let id = req.params.id;
        PublicRequest.findById(id)
            .then(request => { res.json(request)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    findByStatusOpen: function (req, res) {
        PublicRequest.find({ status_open: {$eq: true} })
            .then(requests => {res.json(requests)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByStatusClose: function (req, res) {
        PublicRequest.find({ status_open: {$eq: false} })
            .then(requests => {res.json(requests)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByKeywords: function (req, res) {
        const search = req.query.search;

        PublicRequest.find({description: new RegExp(search, 'i')})
            .then(requests=> {res.json(requests)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    getRewards: function (req, res) {
        const id = req.params.id;

        PublicRequest.findById(id)
            .then(request => {
                res.json(`Rewards: ${request.rewards}`);
            })
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByReward: function (req, res) {
        const search = req.query.search;

        PublicRequest.find({"rewards.item": new RegExp(search, 'i')})
            .then(requests=> {res.json(requests)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    addReward: function (req, res) {
        const id = req.params.id;
        let newReward = {
            item: req.body.item,
            owed_by: req.body.owed_by
        }
        
        PublicRequest.updateOne({ _id: id }, {$push: { rewards: newReward }})
            .then(() => res.json(`Reward added to favour!`))
            .catch(err => res.status(400).json(`Error: ${err}`));
        
    },
    deleteReward: function (req, res) {
        const id = req.params.id;
        const item = req.params.item;
        const owed_by = req.params.owed_by;

        PublicRequest.updateOne({ _id: id }, { $pull: { 'rewards' : {'item' : item , 'owed_by' : owed_by}}})
            .then(() => res.json(`Reward removed!`))
            .catch(err => res.status(400).json(`Error: ${err}`));

    },
    numOfRewards: function (req, res) {
        const id = req.params.id;

        PublicRequest.findById(id)
            .then(request => {
                let length = request.rewards.length;
                res.json(length);
            })
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    add: function (req, res) {
        const opened_by = req.body.opened_by;
        const description = req.body.description;
        const status_open = req.body.status_open;
        const rewards = [{
            item: req.body.rewards.item,
            owed_by : req.body.opened_by
        }]

        const newRequest = new PublicRequest({
            opened_by,
            description,
            status_open,
            rewards
        });

        newRequest.save()
            .then(()=>res.json(`Request successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    closeRequest: function (req, res) {
        let id = req.params.id;

        PublicRequest.updateOne({ _id: id }, { $set: { "status_open": false, "completed_by": req.body.completed_by } })
            .then(() => { res.json('request updated!')})
            .catch(err => { res.status(400).json(`Error: ${err}`) });
        
        
    },
    deleteById: function (req, res) {
        let id = req.params.id;

        PublicRequest.findByIdAndDelete(id)
            .then(() => { res.json(`Favour deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    }
};

