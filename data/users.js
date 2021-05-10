const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const games = mongoCollections.games;
const errorz = require("./errorChecker");
const reviewUtil = require("./reviews");
//TODO: Handle errors in code.

let createUser = async (perms = "user", username, hashPassword, email) => {
  const userCollection = await users();

  //error checking I'm gonna add in -Gavin check if its good later
  errorz.stringChecker(username, "username");
  errorz.stringChecker(hashPassword, "password");
  errorz.stringChecker(email, "email");
  errorz.ValidateEmail(email);

  const newUser = {
    perms: perms,
    username: username,
    dateJoined: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    password: hashPassword,
    usersFollowing: [],
    email: email,
    favoriteGames: [],
    reviewsLeft: [],
  };

  const userChecker = new RegExp(`^${username}$`, "i");
  const emailChecker = new RegExp(`^${email}$`, "i");

  const checkName = await userCollection.findOne({ username: userChecker });
  if (checkName) throw `Error: Username already registered.`;

  const checkEmail = await userCollection.findOne({ email: emailChecker });
  if (checkEmail) throw `Error: Email already registered.`;

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw `Could not create user.`;

  const newId = insertInfo.insertedId;

  const user = await readUser(newId.toString());
  return user;
};

let readUser = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  let parsedId = ObjectID(id);

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: parsedId });
  if (user === null) throw `User not found.`;

  return user;
};

let findByUsername = async (username) => {
  errorz.stringChecker(username, "username");

  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (user === null) throw `User not found.`;

  return user;
};

let updateUser = async (id, newData) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  errorz.existenceChecker(newData);
  errorz.typeChecker(newData, "object");
  let x = Object.keys(newData);
  if (x.length === 0) {
    throw "Error: newData is empty";
  }
  for (let i = 0; i < x.length; i++) {
    if (x[i] === "username") {
      errorz.stringChecker(newData.username, "username");
    } else if (x[i] === "hashPassword") {
      errorz.stringChecker(newData.hashPassword, "password");
    } else if (x[i] === "email") {
      errorz.stringChecker(newData.email, "email");
      errorz.ValidateEmail(newData.email);
    } else if (x[i] === "perms") {
      errorz.stringChecker(newData.perms, "perms");
      let y = newData.perms.toLowerCase();
      if (y !== "admin") {
        if (y !== "user") {
          throw "Error: perms update must be user or admin.";
        }
      }
    } else {
      throw "Error: " + x[i] + " Key not valid";
    }
  }
  let parsedId = ObjectID(id);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await readUser(id);
};

let followUser = async (followerId, followedId) => {
  errorz.stringChecker(followerId, "id");
  errorz.idChecker(followerId);
  errorz.stringChecker(followedId, "id");
  errorz.idChecker(followedId);

  const parsedFollowerID = ObjectID(followerId);
  const parsedFollowedID = ObjectID(followedId);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedFollowerID },
    { $addToSet: { usersFollowing: parsedFollowedID } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await readUser(followerId);
};

let favoriteGame = async (userId, gameId) => {
  errorz.stringChecker(userId, "id");
  errorz.idChecker(userId);
  errorz.stringChecker(gameId, "id");
  errorz.idChecker(gameId);

  const parsedUserID = ObjectID(userId);
  const parsedGameID = ObjectID(gameId);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedUserID },
    { $addToSet: { favoriteGames: parsedGameID } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await readUser(userId);
};

let updateUserReview = async (username, reviewId) => {
  errorz.stringChecker(username, "username");
  errorz.stringChecker(reviewId, "id");
  errorz.idChecker(reviewId);

  const parsedReviewID = ObjectID(reviewId);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { username: username },
    { $addToSet: { reviewsLeft: parsedReviewID } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await findByUsername(username);
};

let removeUser = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  let parsedId = ObjectID(id);

  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) throw `Could not delete user.`;

  return { userId: parsedId.toString(), deleted: true };
};

module.exports = {
  createUser,
  readUser,
  findByUsername,
  updateUser,
  followUser,
  favoriteGame,
  updateUserReview,
  removeUser,
};
