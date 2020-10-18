const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const usersRouter = require('./routes/users');
const favoursRouter = require('./routes/favours');
const publicRequestsRouter = require('./routes/publicRequests');
const authRouter = require('./routes/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const indexHandler = (req, res) => {
    res.send(`<!DOCTYPE html><title>Hello, World!</title><h1>Favours</h1><p>Hello, World!</p>`);
}
app.get('/', indexHandler);


//connect to mongo cluster 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

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

app.listen(port, () => {
    console.log(`The express server is running on port: ${port}`);
});
