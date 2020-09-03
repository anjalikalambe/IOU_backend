const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const favoursRouter = require('./routes/favours');
const rewardsRouter = require('./routes/rewards');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

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
})


app.use('/users',usersRouter);
app.use('/rewards',rewardsRouter);
app.use('/favours',favoursRouter);

app.listen(port, () => {
    console.log(`The express server is running on port: ${port}`);
});
