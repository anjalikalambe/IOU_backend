const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoursSchema = new Schema({
    name: {type: String, required : true, trim: true, minlength: 3},
    description: {type: String, required: true},
    status_open: {type: Boolean, required: true},
    reward: {type: String, trim: true}
}, {
    timestamps: true
});

const Favour = mongoose.model('Favour', favoursSchema);

module.exports = Favour;