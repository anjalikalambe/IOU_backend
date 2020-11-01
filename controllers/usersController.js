const User = require("../models/user.model");

module.exports = {
  //Finds all the users saved to the database
  findAll: function (req, res) {
    User.find()
      .then((users) => {
        res.json(
          users.map((user) => user.username)
        );
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: "Users not found",
          err: err,
        });
      });
  },
  //finds user by username which is unique for all users - this function is called in favours controller when new favour is created, checks to see if username exists.
  findByUsername: async function (username) {
    let obj = null;
    await User.findOne({ username: username })
      .then((user) => {
        obj = user;
        return obj;
      })
      .catch((err) => {
        obj = {
          success: false,
          message: "User not found",
          err: err,
        };
        return obj;
      });
    return obj;
  },
  // sorts users in descending order according to number of rewards earned
  sortUsers: function (req, res) {
    //filter users to find users who have rewards earned greater than 0.
    User.find({ numRewards: { $gt: 0 } })
      .sort({ numRewards: -1 }) // sorts in descending order
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: "Couldn't sort user according to rewards earned.",
          err: err,
        });
      });
  },
  //increments number of rewards earned by user.
  increaseNumRewards: function (owed_to) {
    User.findOne({ username: owed_to })
      .then((user) => {
        user.numRewards = user.numRewards + 1; // increments everytime a favour or reward is created or if rewards of a public request are resolved.
        user.save();
      })
      .catch((err) => {
        return {
          success: false,
          message:
            "Error in increasing reward on user being owed, this may affect leaderboard.",
          err: err,
        };
      });
  },
};
