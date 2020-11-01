const Favour = require("../models/favour.model");
const { findByUsername, increaseNumRewards } = require("./usersController");
const jwt = require("jsonwebtoken");

//use token payload to get logged in user.
const getLoggedInUser = (req, res) => {
  let token = req.headers.authorization; // authorisation field in header contains the token
  token = token.split(" ")[1]; //split string in token where there is a space and make array, token is at position 1.
  let decodedToken = jwt.verify(token, process.env.SECRET); //verify token using secret and save the returned decoded token
  let username = decodedToken["username"]; // use key to get value of username.

  return username;
};

module.exports = {
  //returns all the favours that are owed by the user.
  findFavoursOwed: function (req, res) {
    // gets username of user using the JWT passed.
    let username = getLoggedInUser(req, res);
    // filters the favours in mongo collection according to owed_by = username.
    Favour.find({ owed_by: username })
      .then((favours) => {
        res.json(favours);
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `Could not find favours owed by user: ${username}`,
          err: err,
        });
      });
  },

  //returns all the rewards that the user is entitled to
  findRewardsEarned: function (req, res) {
    // gets username of user using the JWT passed.
    let username = getLoggedInUser(req, res);
    // filters the favours in mongo collection according to owed_to = username.
    Favour.find({ owed_to: username })
      .then((favours) => {
        res.json(favours);
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `Could not find favours earned by user: ${username}`,
          err: err,
        });
      });
  },
  //adds new reward/favour to the mongodb collection.
  add: async function (req, res) {
    let username = getLoggedInUser(req, res);
    const item = req.body.item;
    const created_by = username;
    const owed_by = req.body.owed_by;
    const owed_to = req.body.owed_to;
    const completed = false;

    //Check that favour is created with valid usernames - that all users exist
    if (
      (await findByUsername(created_by)) === null ||
      (await findByUsername(owed_by)) === null ||
      (await findByUsername(owed_to)) === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please make sure all users are existing users.",
      });
    }

    // Proof is mandatory to create a favour that is owed by another user, otherwise optional.
    if (created_by === owed_to && owed_by !== owed_to && !req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Image is required to create favour owed by another user. Please upload image.",
      });
    }

    // file path created if file sent by user creating favour/reward
    let openImgURL = "";
    req.file
      ? (openImgURL =
          req.protocol +
          "://" +
          req.hostname +
          ":5000/" +
          req.file.path.replace("\\", "/"))
      : " ";

    // file path of image is only saved if a file was sent, this prevents null value of image path being saved if no file is sent
    const newFavour = new Favour({
      item,
      created_by,
      owed_by,
      owed_to,
      ...((created_by === owed_to || req.file) && { openImgURL: openImgURL }),
      completed,
    });

    // save the new favour
    newFavour
      .save()
      .then(() =>
        res.json({
          success: true,
          message: `Successfully added a new favour!`,
          id: newFavour._id,
        })
      )
      .catch((err) =>
        res.status(400).json({
          success: false,
          message: `Could not add the favour`,
          err: err,
        })
      );

    // when a favour/reward is created the person owed_to has earnt a reward thus increment his rewards earned count.
    increaseNumRewards(owed_to);
  },
  //marks a favour/reward as resolved by finding the favour using the id passed
  done: function (req, res) {
    favourId = req.query.id;
    let loggedInUser = getLoggedInUser(req, res);

    // file path created if file sent by user resolving favour/reward
    let closeImgURL = "";
    req.file
      ? (closeImgURL =
          req.protocol +
          "://" +
          req.hostname +
          ":5000/" +
          req.file.path.replace("\\", "/"))
      : " ";
    
    //Filters through all favours in collection to get favour with given id.
    Favour.findById(favourId)
      .then((favour) => {
        const owed_by = favour.owed_by;

        // To close a favour that is owed by the user himself, proof is required thus file needed.
        if (
          loggedInUser === owed_by &&
          owed_by !== favour.owed_to &&
          !req.file
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Image is required if you want to close a favour that is owed by you. Please upload image.",
          });
        }

        closeImgURL ? (favour.closeImgURL = closeImgURL) : ""; //save the url for image uplaoded when resolving favour
        favour.completed = true;

        favour
          .save()
          .then(() => {
            res.json({
              success: true,
              message: `The favour is marked as completed!`,
            });
          })
          .catch((err) => {
            res.status(404).json({
              success: false,
              message: `Could not mark favour as completed.`,
              err: err,
            });
          });
      })
      .catch((err) => {
        res.status(404).json({
          success: false,
          message: `Could not find favour`,
          err: err,
        });
      });
  },
  // resolves the rewards of a public request to favours owed to the person who completed the public request.
  addResolvedRequestFavour: function (req, res) {
    let loggedInUser = getLoggedInUser(req, res); //person who completed public request as he was the one who pressed resolve
    const rewards = JSON.parse(req.body.rewards); //get all rewards in json-array form from the public request sent in req.body
    const id = req.body.id; // id of public request

    //for every reward in the rewards array, create a favour. 
    for (let i = 0; i < rewards.length; i++) {
      let item = rewards[i].item;
      let created_by = rewards[i].owed_by;
      let owed_by = rewards[i].owed_by;
      let owed_to = loggedInUser;
      let completed = false;

      //image is required to close a public request otherwise there is no proof that task was completed
      if (req.body.favourImage === "") {
        return res.status(400).json({
          success: false,
          message: "Image is required to close a public request.",
        });
      }

      //image provided becomes the image with which a favour is created(opened) with, thus image of all favours created would be the same
      let openImgURL = "";
      req.file
        ? (openImgURL =
            req.protocol +
            "://" +
            req.hostname +
            ":5000/" + req.file.path.replace("\\", "/"))
        : " ";

      //create and save the favour to collection
      const newFavour = new Favour({
        item,
        created_by,
        owed_by,
        owed_to,
        completed,
        openImgURL,
      });

      newFavour
        .save()
        .then(() => {
          console.log(`Created a favour for reward: ${item}`);
          res.json({
            success: true,
            message: `All rewards resolved successfully`,
          });
        })
        .catch((err) => console.log(err));
      
      //since favour was created need to increment the number of favours earned by user
      increaseNumRewards(owed_to);
    }
  },
  detectParty: function (req, res) {
    let id = req.query.id; //id of favour created.
    let favour;
    let people = []; //array will store all usernames in which favours with owed to and owed by loop

    Favour.findById(id)
      .then(async (currentFavour) => {
        favour = currentFavour;
        //add usernames involved
        people.push(currentFavour.owed_by);
        people.push(currentFavour.owed_to);

        while (favour) {
          //check if there is loop or if usernames are repeated, otherwise go to the next favour
          if (favour.owed_to === currentFavour.owed_by) {
            return res.json({
              success: true,
              message: `A party just formed! Party includes: `,
              people: people,
            });
          }
          //finds another favour where owed by equals current favour's owed to
          let returnedFavour = await Favour.findOne({
            owed_by: favour.owed_to
          });
          people.push(returnedFavour.owed_by);
          // update favour in while loop
          favour = returnedFavour;
      }
    });
  },
};
