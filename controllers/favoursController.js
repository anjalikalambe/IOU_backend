const Favour = require('../models/favour.model');

module.exports = {
    findFavoursOwed: function (req, res) {
        let owedBy = req.query.username;
        Favour.find({owed_by: owedBy})
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findRewardsEarned: function (req, res) {
        let owedTo = req.query.username;
        Favour.find({owed_to: owedTo})
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findByKeywords: function (req, res) {
        const search = req.query.search;

        Favour.find({name: new RegExp(search, 'i')})
            .then(favours=> {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    add: function (req, res) {
        const name = req.body.name;
        const owed_by = req.body.owed_by;
        const owed_to = req.body.owed_to;

        const newFavour = new Favour({
            name,
            owed_by,
            owed_to
        });

        newFavour.save()
            .then(()=>res.json(`Favour successfully created! with ID : ${newFavour.id}`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    delete: function (req, res) {
        let id = req.params.id;

        Favour.findByIdAndDelete(id)
            .then(() => { res.json(`Favour deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    }
};

