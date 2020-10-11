const mongoose = require('mongoose');
const rewardSchema = require('./requestReward.schema');

const Schema = mongoose.Schema;

const favoursSchema = new Schema({
    item: { type: String, required: true, trim: true, minlength: 3 },
    created_by: {type: String, required: true, trim: true},
    owed_by: {type: String, required: true, trim: true},
    owed_to: { type: String, required: true, trim: true },
    openImgURL: { type: String },
    closeImgURL: { type: String },
    completed: { type: Boolean, required: true }
}, {
    timestamps: true
});

const Favour = mongoose.model('Favour', favoursSchema);

module.exports = Favour;