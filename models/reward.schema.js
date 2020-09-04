const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rewardSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: {type: String}
});

// const Reward = mongoose.model('Reward', rewardSchema);

module.exports = rewardSchema;