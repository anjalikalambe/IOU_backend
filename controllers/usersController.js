const User = require('../models/user.model');

module.exports = {
    findAll: function (req, res) {
        User.find()
            .then(users => {res.json(users)})
            .catch(err => { res.status(400).json(`Error: ${err}`)});
    },
    findByUsername: function (req, res) {
        let usernamePassed = req.query.username;

        User.findOne({ username: usernamePassed })
            .then(user=>{res.json(user)})
            .catch(err => {res.status(400).json(`Error: ${err}`)});
    },
    add: function (req, res) {
        const username = req.body.username;
        const name = {
            first: req.body.name.first,
            last: req.body.name.last,
        }
        const email = req.body.email;
        const password = req.body.password;

        const newUser = new User({
            username,
            name,
            email,
            password
        });

        newUser.save()
            .then(()=>res.json(`User successfully created!`))
            .catch(err=>res.status(400).json(`Error: ${err}`));
    },
    delete: function (req, res) {
        let usernamePassed = req.query.username;

        User.deleteOne({username : usernamePassed})
            .then(() => { res.json(`User deleted!`)})
            .catch(err=>{res.status(400).json(`Error: ${err}`)});
    },
    update: function (req,res) {
        const usernamePassed = req.query.username;

        User.findOne({ username: usernamePassed })
            .then(user => { 
                user.username = req.body.username;
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;

                user.save()
                .then(()=>res.json(`User successfully updated!`))
                .catch(err=>res.status(400).json(`Error: ${err}`));
            })
            .catch(err => { res.status(400).json(`Error: ${err}`) });
        
    }
};

