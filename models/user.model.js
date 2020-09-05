const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    email: { type: String, required: true },
    password: {type: String, required: true, minlength: 4 }
}, {
        timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;