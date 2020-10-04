const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index : true // stops duplicates

    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    numRewards: {
        type: Number,
        required: true,
    },
}, {
        timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;