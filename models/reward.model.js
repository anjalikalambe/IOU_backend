const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rewardSchema = new Schema({
    name: {type: String, required: true, trim: true, unique: true}
}, {
        timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;