const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const gameUtil = require("./games");
const userUtil = require("./users");

let createReview = async (
  gameId,
  spoiler,
  reviewTitle,
  reviewContent,
  rating,
  recommended,
  username
) => {
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

  const newGame = await gameUtil.readGame(book._id.toString());
  return newGame;
};

let readAllReviews = async (id) => {
  const parsedId = ObjectID(id);
  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });

  return game.reviews;
};

let readReview = async (id) => {
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

let updateReview = async (id, username, newData) => {
  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const review = await read(id);

  if (username !== review.username) throw `Error: User cannot edit review.`;

  const updatedInfo = await gameCollection.updateOne(
    { "reviews._id": parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update review information.`;

  return await read(id);
};

let removeReview = async (id) => {
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
