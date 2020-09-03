const Favour = require('../models/favour.model');

module.exports = {
    findAll: function (req, res) {
        Favour.find()
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findById: function (req, res) {
        let id = req.params.id;
        Favour.findById(id)
            .then(favour => { res.json(favour)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    findByStatusOpen: function (req, res) {
        Favour.find({ status_open: true })
            .then(favours => {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByStatusClose: function (req, res) {
        Favour.find({ status_open: false })
            .then(favours => {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    findByKeywords: function(req, res){
        const word = req.query.word;

        Favour.find({ name: word })
            .then(favours=> {res.json(favours)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    add: function (req, res) {
        const name = req.body.name;
        const description = req.body.description;
        const status_open = req.body.status_open;
        const reward = req.body.reward;

        const newFavour = new Favour({
            name,
            description,
            status_open,
            reward
        });

        newFavour.save()
            .then(()=>res.json(`Favour successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    updateById: function (req, res) {
        let id = req.body.id;

        Favour.find(id)
            .then(favour => {
                favour.name = req.body.name;
                favour.description = req.body.description;
                favour.status_open = req.body.status_open;
                favour.reward = req.body.reward;

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

