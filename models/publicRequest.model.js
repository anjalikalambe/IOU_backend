const mongoose = require('mongoose');
const requestReward = require('./requestReward.schema');

const Schema = mongoose.Schema;

const publicRequestsSchema = new Schema({
    opened_by: {type: String, required: true},
    description: {type: String, required: true},
    status_open: {type: String, required: true},
    rewards: [requestReward],
    completed_by: {type: String}
}, {
    timestamps: true
});

const PublicRequests = mongoose.model('PublicRequests', publicRequestsSchema);

module.exports = PublicRequests;