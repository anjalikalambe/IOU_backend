const User = require('../models/user.model');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
    //adds user to database
    register: function (req, res) {

        const { errors, isValid } = validateRegisterInput(req.body);

        if (!req.body.username || !req.body.password ||
            !isValid) {
            res.json({
                success: false,
                message: "Please enter username and password"
            });
            return res.status(400).json(errors);
            
        } else {

            const username = req.body.username;
            const password = req.body.password;
            const numRewards = 0;

            User.findOne({ username: username })
                .then(user => {
                    if (user) {
                        return res.status(400).json({
                            success: false,
                            message: "Username already exists"
                        });

                    } else {
                        const newUser = new User({
                            username,
                            password,
                            numRewards
                        });
                
                        newUser.save()
                            .then((user) => {
                                res.json({
                                    success: true,
                                    message: "User successfully created"
                                });
                            })
                            .catch(err => res.status(400).json({
                                success: false,
                                message: "User could not be created",
                                err: err
                            }));
                        
                    }
                })


            
        }
    },
    //checks if user exists and authorises access to other protected routes using JWT
    login: function (req, res) {
        const { errors, isValid } = validateLoginInput(req.body);
        
        if (!req.body.username || !req.body.password || !isValid) {
            res.json({
                success: false,
                message: "Please enter username and password"
            });
            return res.status(400).json(errors);
            
        } else { 

            const username = req.body.username;
            const password = req.body.password;

            User.findOne({ username })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "User with that username not found"
                        });
                    } else {
                        bcrypt.compare(password, user.password)
                            .then(isMatch => {
                                if (isMatch) {
                                    const payload = {
                                        id: user.id,
                                        username: user.username
                                    }
                                    jwt.sign(
                                        payload,
                                        process.env.SECRET,
                                        { expiresIn: 604800 },
                                        (err, token) => {
                                            res.json({
                                                success: true,
                                                token: "Bearer " + token
                                            });
                                        }
                                    );
                                } else {
                                    return res.status(404).json({
                                        success: false,
                                        message: "Password incorrect.",
                                        err: err
                                    });
                                }
                            });
                    }
                });  
        }
    },
}