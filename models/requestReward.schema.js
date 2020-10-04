const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestReward = new Schema({
    item: { type: String, required: true, trim: true },
    owed_by: {type: String, required: true, trim: true }
});

module.exports = requestReward;