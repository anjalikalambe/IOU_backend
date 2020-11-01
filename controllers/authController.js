const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    //function to verify token from client to then protect frontend routes. 
    verifyToken: function(req, res) {
        const authorization = req.headers.authorization;
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            // use jwt verify to check the token passsed through in position 1 of array made using split.
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, (err,decoded)=> {
                if(err){
                    res.json({
                        success: false,
                        message: "Unauthorized"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Authorized"
                    });
                }
            })
        } else { 
            res.json({
                success: false,
                message: "No token provided"
            });
        }
    },
    //adds user as user of application, saves to Mongodb users collection. Req.body from frontend sends required information.
    register: function (req, res) {

        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const numRewards = 0; // initally user wouldnt have any rewards earned.

        //do checks/validate for field requirements
        if (!username || !password || !req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        } else if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters"
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password must match"
            });

        } else {
            // check if user already exists
            User.findOne({ username: username })
                .then(user => {
                    if (user) {
                        return res.status(400).json({
                            success: false,
                            message: "Username already exists"
                        });

                    } else {
                        //if user with that username doesnt exist then create a new user
                        const newUser = new User({
                            username,
                            password,
                            numRewards
                        });
                        
                        //save user to collection
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
    //checks if user exists and authorises access to other protected routes by creating a JWT token.
    login: function (req, res) {

        const username = req.body.username;
        const password = req.body.password;
        
        //check to see if all fields are filled
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            
        } else {
            //check to see user exists
            User.findOne({ username : username })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "Your username and/or password do not match"
                        });
                    } else {
                        // if user exists, then compare given password to saved password
                        bcrypt.compare(password, user.password)
                            .then(isMatch => {
                                if (isMatch) {
                                    //if passwords match then create a payload for the JWT token
                                    const payload = {
                                        id: user.id,
                                        username: user.username
                                    }
                                    // return token created after payload is signed
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
                                    // if user passowrds dont match
                                    return res.status(404).json({
                                        success: false,
                                        message: "Your username and/or password do not match",
                                        err: 'error'
                                    });
                                }
                            });
                    }
                })
                .catch(e => {
                    return res.status(404).json({
                        success: false,
                        message: "Your username and/or password do not match",
                        err: 'error'
                    });
                })
        }
    }
}