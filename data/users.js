const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const errorz = require("./errorChecker");
//TODO: Handle errors in code.

let createUser = async (perms, username, hashPassword, email) => {
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
    reviewsMarkedHelpful: [],
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

let userMarkReviewHelpful = async (userId, reviewId) => {
    errorz.stringChecker(userId, "userId");
    errorz.idChecker(userId, "userId");
    errorz.stringChecker(reviewId, "reviewId");
    errorz.idChecker(reviewId, "reviewId");

    const parsedUserId = ObjectID(userId);

    try {
        const updatedInfo = await UserCollection.updateOne(
            {_id: parsedUserId},
            {$addToSet: { reviewsMarkedHelpful: reviewId }}
        );
        if (updatedInfo.modifiedCount === 0) 
            throw `Review was already present.`
    } catch (e) {
        console.log(e);
        throw `Ran into error while trying to add review marked helpful.`
    }

    return await readUser(userId);
}

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

let followUserByName = async (followerName, followedName) => {
  errorz.stringChecker(followerName, "follower");
  errorz.stringChecker(followedName, "followed");
  let follower, followed;
  try {
    follower = await findByUsername(followerName);
    followed = await findByUsername(followedName);
  } catch (e) {
    throw "User not found.";
  }
  const userCollection = await users();
  const updatedInfo = await userCollection.updateOne(
    { _id: follower._id },
    { $addToSet: { usersFollowing: followed._id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await readUser(follower._id.toString());
};

let unfollowUser = async (followerId, followedId) => {
  errorz.stringChecker(followerId, "id");
  errorz.idChecker(followerId);
  errorz.stringChecker(followedId, "id");
  errorz.idChecker(followedId);

  const parsedFollowerID = ObjectID(followerId);
  const parsedFollowedID = ObjectID(followedId);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedFollowerID },
    { $pull: { usersFollowing: parsedFollowedID } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;
  return await readUser(followerId);
};

let unfollowUserByName = async (followerName, followedName) => {
  errorz.stringChecker(followerName, "follower");
  errorz.stringChecker(followedName, "followed");
  let follower, followed;
  try {
    follower = await findByUsername(followerName);
    followed = await findByUsername(followedName);
  } catch (e) {
    throw "User not found.";
  }
  const userCollection = await users();
  const updatedInfo = await userCollection.updateOne(
    { _id: follower._id },
    { $pull: { usersFollowing: followed._id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw `Could not update user information.`;

  return await readUser(follower._id.toString());
};

let isFollowing = async (followerUser, followedUser) => {
  errorz.stringChecker(followerUser, "follower");
  errorz.stringChecker(followedUser, "followed");

  let follower, followed;
  try {
    follower = await findByUsername(followerUser);
    followed = await findByUsername(followedUser);
  } catch (e) {
    throw "User not found.";
  }

  for (let user of follower.usersFollowing.map((x) => x.toString())) {
    if (followed._id.toString() == user) return true;
  }
  return false;
};

let getListFollowing = async (username) => {
  errorz.stringChecker(username, "username");

  let user;
  try {
    user = await findByUsername(username);
  } catch (e) {
    throw "User not found";
  }

  let result = [];

  for (let userId of user.usersFollowing) {
    let followed = await readUser(userId.toString());
    result.push(followed.username);
  }

  return result;
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

let unfavoriteGame = async (userId, gameId) => {
  errorz.stringChecker(userId, "id");
  errorz.idChecker(userId);
  errorz.stringChecker(gameId, "id");
  errorz.idChecker(gameId);

  const parsedUserID = ObjectID(userId);
  const parsedGameID = ObjectID(gameId);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: parsedUserID },
    { $pull: { favoriteGames: parsedGameID } }
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

let removeReview = async (username, reviewId) => {
  errorz.stringChecker(reviewId, "id");
  errorz.idChecker(reviewId);
  let parsedId = ObjectID(reviewId);

  const userCollection = await users();
  const deletionInfo = await userCollection.updateOne(
    { username: username },
    { $pull: { reviewsLeft: parsedId } }
  );
  if (deletionInfo.modifiedCount === 0) throw `Could not delete review.`;

  return { reviewId: parsedId.toString(), deleted: true };
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
  unfollowUser,
  isFollowing,
  userMarkReviewHelpful,
  followUserByName,
  unfollowUserByName,
  getListFollowing,
  favoriteGame,
  unfavoriteGame,
  updateUserReview,
  removeReview,
  removeUser,
};
