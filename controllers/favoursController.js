const Favour = require('../models/favour.model');
const { findByUsername, increaseNumRewards } = require('./usersController');
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
    //returns all the favours that are owed by the user. 
    findFavoursOwed: function (req, res) {
        let username = getLoggedInUser(req, res);

        Favour.find({ owed_by: username })
            .then(favours => { res.json(favours) })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: `Could not find favours owed by user: ${username}`,
                    err: err
                })
            });
    },
    //returns all the rewards that the user is entitled to
    findRewardsEarned: function (req, res) {

        let username = getLoggedInUser(req, res);

        Favour.find({ owed_to: username })
            .then(favours => { res.json(favours) })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: `Could not find favours earned by user: ${username}`,
                    err: err
                })
            });
    },
    // returns all the favours that the user has owed in the past(for favours completed)
    completedFavoursOwed: function (req, res) {

        let username = getLoggedInUser(req, res);

        Favour.find({ owed_by: username, completed: true })
            .then(favours => { res.json(favours) })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: `Could not find previous favours owed by user: ${username}`,
                    err: err
                })
            });
    },
    //returns all the rewards that the user has earned in the past(for favours completed)
    completedRewardsEarned: function (req, res) {

        let username = getLoggedInUser(req, res);

        Favour.find({ owed_to: username, completed: true })
            .then(favours => { res.json(favours) })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: `Could not find previous rewards earned by user: ${username}`,
                    err: err
                })
            });
    },
    //adds new rewards/favours to the database. 
    add: async function (req, res) {
        let username = getLoggedInUser(req, res);
        const item = req.body.item;
        const created_by = username;
        const owed_by = req.body.owed_by;
        const owed_to = req.body.owed_to;
        const completed = false;

        //Check that favour is created with valid usernames
        if (await findByUsername(created_by) === null || await findByUsername(owed_by) === null || await findByUsername(owed_to) === null) {
            return res.status(400).json({
                success: false,
                message: "Please make sure all users are existing users."
            });
        }

        // Proof is mandatory to create a favour that is owed by another user, otherwise optional.
        if (created_by === owed_to && owed_by!==owed_to && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required to create favour owed by another user. Please upload image."
            });
        }

        // file path created if file sent by user
        let openImgURL = "";
        req.file ? openImgURL = req.protocol + "://" + req.hostname + ":5000/" + req.file.path.replace("\\", "/") : " ";

        const newFavour = new Favour({
            item,
            created_by,
            owed_by,
            owed_to,
            ...((created_by === owed_to || req.file) && { openImgURL: openImgURL }),
            completed
        });

        newFavour.save()
            .then(() => res.json({
                success: true,
                message: `Successfully added a new favour!`,
                id: newFavour._id
            }))
            .catch(err => res.status(400).json({
                success: false,
                message: `Could not add the favour`,
                err: err
            }));

        increaseNumRewards(owed_to);

    },
    done: function (req, res) {

        favourId = req.query.id;
        let loggedInUser = getLoggedInUser(req, res);

        let closeImgURL = "";
        req.file ? closeImgURL = req.protocol + "://" + req.hostname + ":5000/" + req.file.path.replace("\\", "/") : " ";

        Favour.findById(favourId)
            .then(favour => {
                const owed_by = favour.owed_by;

                // To close a favour that is owed by the user himself, proof is required.
                if (loggedInUser === owed_by && owed_by!==favour.owed_to && !req.file) {
                    return res.status(404).json({
                        success: false,
                        message: "Image is required if you want to close a favour that is owed by you. Please upload image."
                    });
                }

                closeImgURL ? favour.closeImgURL = closeImgURL : "";
                favour.completed = true;

                favour.save()
                    .then(() => {
                        res.json({
                            success: true,
                            message: `The favour is marked as completed!`
                        })
                    })
                    .catch(err => {
                        res.status(404).json({
                            success: false,
                            message: `Could not mark favour as completed.`,
                            err: err
                        })
                    });
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: `Could not find favour`,
                    err: err
                })
            });
    },
    // deletes the favour from the database
    delete: function (req, res) {
        let id = req.query.id;

        Favour.findByIdAndDelete(id)
            .then(() => {
                res.json({
                    success: true,
                    message: `Successfully deleted favour!`
                })
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: `Could not delete favour`,
                    err: err
                })
            });
    },
    getOpenImgName: function (req, res) {
        let id = req.query.id;

        Favour.findById(id)
            .then(favour => {
                let openImgURL = favour.openImgURL;
                let openImgName = openImgURL.replace("http://localhost/uploads/", "");
                res.json(openImgName);
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: `Could not get image`,
                    err: err
                })
            });
    },
    getClosedImgName: function (req, res) {
        let id = req.query.id;

        Favour.findById(id)
            .then(favour => {
                let closeImgURL = favour.closeImgURL;
                let closeImgName = closeImgURL.replace("http://localhost/uploads/", "");
                res.json(closeImgName);
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: `Could not get image`,
                    err: err
                })
            });
    },
    addResolvedRequestFavour: function (req, res) {

        let loggedInUser = getLoggedInUser(req, res);
        const rewards = JSON.parse(req.body.rewards);
        const id = req.body.id;

        for (let i = 0; i < rewards.length; i++){
            let item = rewards[i].item;
            let created_by = rewards[i].owed_by;
            let owed_by = rewards[i].owed_by;
            let owed_to = loggedInUser
            let completed = false;

            if (req.body.favourImage==="") {
                return res.status(400).json({
                    success: false,
                    message: "Image is required to close a public request."
                });
            }

            let openImgURL = "";
            req.file ? openImgURL = "http://localhost:5000/" + req.file.path.replace("\\", "/") : " ";

            const newFavour = new Favour({
                item,
                created_by,
                owed_by,
                owed_to,
                completed,
                openImgURL
            });

            newFavour.save()
                .then(() => console.log( `Created a favour for reward: ${item}`))
                .catch(err => console.log(err));
        }
    },
    detectParty: function (req, res) {
        let id = req.query.id;
        let favour;
        let people = [];

        Favour.findById(id)
            .then(async (currentFavour) => {
                favour = currentFavour;
                people.push(currentFavour.owed_by);
                people.push(currentFavour.owed_to);

                while (favour) {
                    if (favour.owed_to === currentFavour.owed_by) {
                        return res.json({
                            success: true,
                            message: `A party just formed! Party includes: `,
                            people: people
                        });
                    }

                    await Favour.findOne({ owed_by: favour.owed_to })
                        .then(returnedFavour => {
                            people.push(returnedFavour.owed_by);
                            favour = returnedFavour;
                        })
                }
            })
    }
};