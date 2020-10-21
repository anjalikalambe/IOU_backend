const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const usersRouter = require('./routes/users');
const favoursRouter = require('./routes/favours');
const publicRequestsRouter = require('./routes/publicRequests');
const authRouter = require('./routes/auth');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static('client/build'));

//connect to mongo cluster 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connection to Mongo Cluster established.");
});

// Passport middleware
app.use(passport.initialize());
//Passport config
require("./config/passport")(passport);
//API Routes
app.use('/api/users',usersRouter);
app.use('/api/favours',favoursRouter);
app.use('/api/public/requests', publicRequestsRouter);
app.use('/api/auth',authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, () => {
    console.log(`The express server is running on port: ${port}`);
});
