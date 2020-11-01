const mongoose = require('mongoose');
const requestReward = require('./requestReward.schema');

const Schema = mongoose.Schema;

//creates a new schema for public requests which represent each document added to the collection, it also has an array of nested documents whose schema follows the requestReward schema/model.
const publicRequestsSchema = new Schema({
    opened_by: {type: String, required: true},
    description: {type: String, required: true},
    status_open: {type: String, required: true},
    rewards: [requestReward],
    completed_by: {type: String}
}, {
    timestamps: true
});

const PublicRequests = mongoose.model('PublicRequests', publicRequestsSchema); // create public request model using the schema created

module.exports = PublicRequests;