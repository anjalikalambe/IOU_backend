const Favour = require('../models/favour.model');
const User = require('../models/user.model');
const { increaseNumRewards } = require('./usersController');

module.exports = {
    //returns all the favours that are owed by the user. 
    findFavoursOwed: function (req, res) {
        const username = req.query.username;

        Favour.find({owed_by: username})
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json({
                success: false,
                message: `Could not find favours owed by user: ${username}`,
                err: err
            })});
    },
    //returns all the rewards that the user is entitled to
    findRewardsEarned: function (req, res) {
        const username = req.query.username;

        Favour.find({owed_to: username})
            .then(favours => {res.json(favours)})
            .catch(err => { res.status(400).json({
                success: false,
                message: `Could not find favours earned by user: ${username}`,
                err: err
            })});
    },
    //filters all the favours/rewards using keywords
    findByKeywords: function (req, res) {
        const search = req.query.search;

        Favour.find({item: new RegExp(search, 'i')})
            .then(favours=> {res.json(favours)})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not find favours by keyword/s: ${search}`,
                err: err
            })});
    },
    //adds new rewards/favours to the database. (max 5 - do something!!)
    add: function (req, res) {
        const item = req.body.item;
        const created_by = req.body.created_by;
        const owed_by = req.body.owed_by;
        const owed_to = req.body.owed_to;
        // const picture = 

        const newFavour = new Favour({
            item,
            created_by,
            owed_by,
            owed_to
        });

        newFavour.save()
            .then(()=>res.json({
                success: true,
                message: `Successfully added new reward to favour!`
            }))
            .catch(err=>res.status(400).json({
                success: false,
                message: `Could not add new reward to the favour`,
                err: err
            }));
        
        increaseNumRewards(owed_to);
    
    },
    // deletes the favour/reward from the database
    delete: function (req, res) {
        let id = req.params.id;

        Favour.findByIdAndDelete(id)
            .then(() => { res.json({
                success: true,
                message: `Successfully deleted reward from favour!`
            })})
            .catch(err=>{res.status(400).json({
                success: false,
                message: `Could not delete the reward from favour`,
                err: err
            })});
    }
};

