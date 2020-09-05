const mongoose = require('mongoose');
const rewardSchema = require('./requestReward.schema');

const Schema = mongoose.Schema;

const favoursSchema = new Schema({
    name: { type: String, required: true, trim: true, minlength: 3 },
    owed_by: {type: String, required: true, trim: true},
    owed_to: {type: String, required: true, trim: true}
}, {
    timestamps: true
});

const Favour = mongoose.model('Favour', favoursSchema);

module.exports = Favour;