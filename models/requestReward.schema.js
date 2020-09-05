const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestReward = new Schema({
    name: { type: String, required: true, trim: true },
    owed_by: {type: String}
});

module.exports = requestReward;