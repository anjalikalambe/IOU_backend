const Favour = require('../models/favour.model');

module.exports = {
    findAll: function (req, res) {
        Favour.find()
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findId: function (req, res) {
        let id = req.params.id;
        Favour.findById(id)
            .then(favour => { res.json(favour)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    findByStatusOpen: function (req, res) {
        Favour.find({ status_open: {$eq: true} })
            .then(favours => {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByStatusClose: function (req, res) {
        Favour.find({ status_open: {$eq: false} })
            .then(favours => {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByKeywords: function (req, res) {
        const search = req.query.search;

        Favour.find({name: new RegExp(search)})
            .then(favours=> {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    getRewards: function (req, res) {
        const id = req.params.id;

        Favour.findById(id)
            .then(favour => {
                res.json(`Rewards: ${favour.rewards}`);
            })
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByReward: function (req, res) {//still doesnt work
        const search = req.query.search;

        Favour.find({"rewards.name": new RegExp(search)})
            .then(favours=> {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    addReward: function (req, res) {
        const id = req.params.id;
        let newReward = {
            name: req.body.name,
            description: req.body.description
        }
        
        Favour.updateOne({ _id: id }, {$push: { rewards: newReward }})
            .then(() => res.json(`Reward added to favour!`))
            .catch(err => res.status(400).json(`Error: ${err}`));
        
    },
    deleteReward: function (req, res) {
        const id = req.params.id;

        Favour.updateOne({ _id: id }, { $pop: {rewards: 1}})
            .then(() => res.json(`Reward removed!`))
            .catch(err => res.status(400).json(`Error: ${err}`));

    },
    numOfRewards: function (req, res) {
        const id = req.params.id;

        Favour.findById(id)
            .then(favour => {
                let length = favour.rewards.length;
                res.json(length);
            })
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    add: function (req, res) {
        const name = req.body.name;
        const description = req.body.description;
        const status_open = req.body.status_open;
        const rewards = [{
            name: req.body.rewards.name,
            description : req.body.rewards.description,
            
        }]

        const newFavour = new Favour({
            name,
            description,
            status_open,
            rewards
        });

        newFavour.save()
            .then(()=>res.json(`Favour successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    updateById: function (req, res) {
        let id = req.params.id;

        Favour.findById(id)
            .then(favour => {
                favour.name = req.body.name;
                favour.description = req.body.description;
                favour.status_open = req.body.status_open;

                favour.save()
                    .then(() => { res.json('Favour updated!')})
                    .catch(err=>res.status(404).json(`Error: ${err}`));
            })
            .catch(err => { res.status(400).json(`Error: ${err}`) });
        
        
    },
    deleteById: function (req, res) {
        let id = req.params.id;

        Favour.findByIdAndDelete(id)
            .then(() => { res.json(`Favour deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    }
};

