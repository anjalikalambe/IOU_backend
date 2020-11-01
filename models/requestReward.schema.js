const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creates a new schema for requestRewards, this schema will not be a model from which a collection can be made.This is because it has a one-to-many relationship with publiceRequests, hence a request reward can't exist without a parent public request.
const requestReward = new Schema({
    item: { type: String, required: true, trim: true },
    owed_by: {type: String, required: true, trim: true }
});

module.exports = requestReward;