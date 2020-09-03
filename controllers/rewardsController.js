const Reward = require('../models/reward.model');

module.exports = {
    findAll: function (req, res) {
        Reward.find()
            .then(rewards => {res.json(rewards)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findById: function (req, res) {
        let id = req.params.id;
        Reward.findById(id)
            .then(reward => { res.json(reward)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    findByKeywords: function(req, res){
        const word = req.query.word;

        Reward.find({ name: word })
            .then(reward=> {res.json(reward)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    add: function (req, res) {
        const name = req.body.name;

        const newReward = new Reward({
            name
        });

        newFavour.save()
            .then(()=>res.json(`Reward successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    deleteById: function (req, res) {
        let id = req.params.id;

        Reward.findByIdAndDelete(id)
            .then(() => { res.json(`Reward deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    }
};
