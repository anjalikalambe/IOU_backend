const User = require('../models/user.model');

module.exports = {
    findAll: function (req, res) {
        User.find()
            .then(users => {res.json(users)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findById: function (req, res) {
        let id = req.params.id;
        User.findById(id)
            .then(favour => { res.json(user)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    add: function (req, res) {
        const username = req.body.name;

        const newUser = new User({
            username
        });

        User.save()
            .then(()=>res.json(`User successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    deleteById: function (req, res) {
        let id = req.params.id;

        User.findByIdAndDelete(id)
            .then(() => { res.json(`User deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    }
};

