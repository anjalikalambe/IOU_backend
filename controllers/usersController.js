const User = require('../models/user.model');

module.exports = {
    //Finds all the users saved to the database
    findAll: function (req, res) {
        User.find()
            .then(users => {res.json(users)})
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: "Users not found",
                    err: err

                })
            });
    },
    //finds user by username which is unique for all users
    findByUsername: function (req, res) {
        const username = req.query.username;

        User.findOne({ username : username })
            .then(user=>{res.json(user)})
            .catch(err => {res.status(400).json({
                success: false,
                message: "User not found",
                err: err
            })});
    },
    //deletes user from database
    delete: function (req, res) {
        const username = req.query.username;

        User.findOneAndDelete({ username : username })
            .then(() => { res.json({
                success: true,
                message: `User deleted!`,
                err: err
            })})
            .catch(err=>{res.status(400).json({
                success: false,
                message: "User could not be deleted",
                err: err

            })});
    },
    //updates user details in database
    update: function (req,res) {
        const username = req.query.username;

        User.findOne({ username : username })
            .then(user => { 
                user.username = req.body.username;
                user.password = req.body.password;

                user.save()
                .then(()=>res.json({
                    success: false,
                    message: `User successfullly updated!`,
                    err: err
                }))
                .catch(err=>res.status(400).json({
                    success: false,
                    message: "User could not be updated",
                    err: err
                }));
            })
            .catch(err => { res.status(400).json({
                success: false,
                message: "User could not be found",
                err: err
            }) });
        
    },
    // sorts users in descending order according to number of rewards earned
    sortUsers: function (req, res) {
        User.find({ numRewards: { $gt: 0 } }).sort({numRewards: -1})
        .then(users => {res.json(users)})
        .catch(err => { res.status(400).json({
            success: false,
            message: "Couldn't sort user according to rewards earned.",
            err: err
        })});
    },
    //increments number of rewards earned by user.
    increaseNumRewards: function (owed_to) {
        User.findOne({ username : owed_to })
            .then(user => {
                user.numRewards = user.numRewards + 1;
                user.save();
            })
            .catch(err => {
                return {
                success: false,
                message: "Error in increasing reward on user being owed, this may affect leaderboard.",
                err: err
            }});
    }
};

