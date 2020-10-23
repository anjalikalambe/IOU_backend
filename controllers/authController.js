const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    //function to verify token from client to then protect frontend routes. 
    verifyToken: function(req, res) {
        console.log('req.headers', req.headers);
        const authorization = req.headers.authorization;
        if (authorization && authorization.split(' ')[0] === 'Bearer'){
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
    //adds user to database
    register: function (req, res) {

        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const numRewards = 0;
        const illegalChars = /\W/;
        const illegalPassword = /[^\x21-\x7E]/;

        if (!username || !password || !req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        } else if (username.length > 15) {
            return res.status(400).json({
                success: false,
                message: "Username cant be more than 15 characters"
            });
        } else if (illegalChars.test(state.username)) {
            return res.status(400).json({
                success: false,
                message: "Username can only contain letters,numbers and underscore"
            });            
        } else if (password.length < 6 || password.length > 18) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 6 to 18 characters"
            });
        } else if (illegalPassword.test(state.password)) {
            return res.status(400).json({
                success: false,
                message: "Password contains illegal characters"
            });           
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password must match"
            });

        } else {

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

        const username = req.body.username;
        const password = req.body.password;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            
        } else {

            User.findOne({ username : username })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "Your username and/or password do not match"
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