const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        minlength: 6
    },
    numRewards: {
        type: Number,
        required: true,
    },
}, {
        timestamps: true
});

userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);
const User = mongoose.model('User', userSchema);

module.exports = User;