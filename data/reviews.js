const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const gameUtil = require("./games");
const userUtil = require("./users");
const errorz = require("./errorChecker");

let createReview = async (
  gameId,
  spoiler,
  reviewTitle,
  reviewContent,
  rating,
  recommended,
  username
) => {
  errorz.stringChecker(gameId, "gameId");
  errorz.existenceChecker(spoiler);
  errorz.typeChecker(spoiler, "bool");
  errorz.existenceChecker(recommended);
  errorz.typeChecker(recommended, "bool");
  errorz.stringChecker(reviewTitle, "reviewTitle");
  errorz.stringChecker(reviewContent, "reviewContent");
  errorz.ratingChecker(rating);
  errorz.stringChecker(username, "username");

  if (didUserReviewGame(username, gameId))
    throw `Error: User already reviewed this game.`;

  let parsedId = ObjectID(gameId);
  const user = await userUtil.findByUsername(username);

  const newReview = {
    _id: ObjectID(),
    spoiler: spoiler,
    reviewTitle: reviewTitle,
    reviewContent: reviewContent,
    rating: rating,
    recommended: recommended,
    username: username,
    helpfulCount: 0,
    userId: user._id,
  };

  const game = await gameCollection.findOne({ _id: parsedId });
  const updatedInfo = await gameCollection.updateOne(
    { _id: game._id },
    { $addToSet: { reviews: newReview } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game with review.`;

  const newGame = await gameUtil.updateReviewStats(game._id.toString(), rating);
  return newGame;
};

let readAllReviews = async (id) => {
  errorz.stringChecker(id, "id");

  const parsedId = ObjectID(id);
  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });

  return game.reviews;
};

let readReview = async (id) => {
  errorz.stringChecker(id, "id");

  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ "reviews._id": parsedId });

  let review;
  game.reviews.forEach((element) => {
    if (element._id.toString() === parsedId.toString()) {
      review = element;
    }
  });

  return review;
};

let didUserReviewGame = async (username, gameId) => {

  errorz.stringChecker(username, "username");
  errorz.stringChecker(gameId, "gameId");
  
  const parsedId = ObjectID(gameId);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });
  if (!game) throw `Error: Game not found`;

  game.reviews.forEach((elem) => {
    if (elem.username === username) return true;
  });
  return false;
};

let updateReview = async (id, username, newData) => {
  errorz.stringChecker(id, "id");
  errorz.stringChecker(username, "username");
  errorz.existenceChecker(newData);
  errorz.typeChecker(newData, "object");
  let x = Object.keys;

  for(let i = 0; i < x.length; i++)
  {
    if(x[i] === "gameId")
    {
      errorz.stringChecker(newData.gameId, "gameId");
    }
    else if(x[i] === "spoiler")
    {
      errorz.existenceChecker(newData.spoiler);
      errorz.typeChecker(newData.spoiler, "bool");
    }
    else if(x[i] === "recommended")
    {
      errorz.existenceChecker(newData.recommended);
      errorz.typeChecker(newData.recommended, "bool");
    }
    else if(x[i] === "reviewTitle")
    {
      errorz.stringChecker(newData.reviewTitle, "reviewTitle");
    }
    else if(x[i] === "reviewContent")
    {
      errorz.stringChecker(newData.reviewContent, "reviewContent");
    }
    else if(x[i] === "rating")
    {
      errorz.ratingChecker(newData.rating);
    }
    else if(x[i] === "username")
    {
      errorz.stringChecker(newData.username, "username");
    }
    else
    {
      throw "Error: Key not valid";
    }
  }

  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const review = await read(id);

  if (username !== review.username) throw `Error: User cannot edit review.`;

  const updatedInfo = await gameCollection.updateOne(
    { "reviews._id": parsedId },
    { $set: { "reviews.$": newData } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update review information.`;

  return await read(id);
};

let removeReview = async (id) => {
  errorz.stringChecker(id, "id");

  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ "reviews._id": parsedId });

  const review = await read(id);

  let deletionInfo = await gameCollection.updateOne(
    { _id: game._id },
    { $pull: { reviews: review } }
  );
  if (deletionInfo.deletedCount === 0) throw `Could not delete review.`;

  return { reviewId: parsedId.toString(), deleted: true };
};

module.exports = {
  createReview,
  readAllReviews,
  readReview,
  updateReview,
  removeReview,
};