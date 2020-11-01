const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

//creates a new schema for users which will represent each document added to the collection
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

//pre hook used so that before any user document is added to collection, the following code will run.
userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        //only create new hash if password is new or modified otherwise will change password hash at every login and thus cause a bug
        if (this.isModified("password") || this.isNew) {
            const hash = await bcrypt.hash(this.password, 10); // this returns a hash after adding a salt with specificed salt rounds
            user.password = hash; //hashed version with salt saved as the password for that user document.
            next();
        } else {
            next();
        }
    }
);
const User = mongoose.model('User', userSchema); // create user model using the schema created

module.exports = User;