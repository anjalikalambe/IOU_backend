const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors'); // required for heroku deployment of separate repos.

const usersRouter = require('./routes/users');
const favoursRouter = require('./routes/favours');
const publicRequestsRouter = require('./routes/publicRequests');
const authRouter = require('./routes/auth');

require('dotenv').config(); // contains all sensitive information -isn't submitted to git.

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.WHITELIST,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use('/uploads', express.static('uploads')); // uses static folder for saving images
app.use(cors(corsOptions));

const indexHandler = (req, res) => {
    res.send(`<!DOCTYPE html><title>Hello, World!</title><h1>AIP</h1><p>Hello, World!</p>`);
}
app.get('/', indexHandler);


//connect to mongo cluster 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connection to Mongo Cluster established.");
});

// Passport middleware
app.use(passport.initialize());
//Passport config
require("./config/passport")(passport);

//API Routes
app.use('/users',usersRouter);
app.use('/favours',favoursRouter);
app.use('/public/requests', publicRequestsRouter);
app.use('/auth',authRouter);

// start server
app.listen(port, () => {
    console.log(`The express server is running on port: ${port}`);
});
