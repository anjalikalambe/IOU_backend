const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creates a new schema for favours which represent each document added to the collection
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

const Favour = mongoose.model('Favour', favoursSchema); // create favour model using the schema created

module.exports = Favour;