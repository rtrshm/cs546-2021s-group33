const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const errorz = require("./errorChecker");
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

  let parsedId = ObjectID(id);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await read(id);
};

let removeUser = async (id) => {
  errorz.stringChecker(id, "id");

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
  removeUser,
};
