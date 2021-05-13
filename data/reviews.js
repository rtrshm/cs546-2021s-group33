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
  errorz.typeChecker(spoiler, "boolean");
  errorz.existenceChecker(recommended);
  errorz.typeChecker(recommended, "boolean");
  errorz.stringChecker(reviewTitle, "reviewTitle");
  errorz.stringChecker(reviewContent, "reviewContent");
  errorz.ratingChecker(rating);
  errorz.stringChecker(username, "username");

  if (await didUserReviewGame(username, gameId))
    throw `Error: User already reviewed this game.`;

  let parsedId = ObjectID(gameId);
  const user = await userUtil.findByUsername(username);

  const gameCollection = await games();

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
    timestamp: Date.now(),
  };

  const game = await gameCollection.findOne({ _id: parsedId });
  if (!game) throw `Error: Game does not exist.`;

  const updatedInfo = await gameCollection.updateOne(
    { _id: game._id },
    { $addToSet: { reviews: newReview } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game with review.`;

  await userUtil.updateUserReview(user.username, newReview._id.toString());

  await gameUtil.updateReviewStats(game._id.toString(), rating);
  return newReview;
};

let readAllReviews = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  const parsedId = ObjectID(id);
  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });

  return game.reviews;
};

let readReview = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ "reviews._id": parsedId });
  if (!game) throw `Error: Review ID does not correspond with game.`;

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
    if (elem.username === username) {
      console.log(elem.username);
      console.log(username);
      return true;
    }
  });
  return false;
};

let updateReview = async (id, username, newData) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  errorz.stringChecker(username, "username");
  errorz.existenceChecker(newData);
  errorz.typeChecker(newData, "object");
  let x = Object.keys(newData);
  if (x.length === 0) {
    throw "Error: newData is empty";
  }
  for (let i = 0; i < x.length; i++) {
    if (x[i] === "gameId") {
      errorz.stringChecker(newData.gameId, "gameId");
    } else if (x[i] === "spoiler") {
      errorz.existenceChecker(newData.spoiler);
      errorz.typeChecker(newData.spoiler, "boolean");
    } else if (x[i] === "recommended") {
      errorz.existenceChecker(newData.recommended);
      errorz.typeChecker(newData.recommended, "boolean");
    } else if (x[i] === "reviewTitle") {
      errorz.stringChecker(newData.reviewTitle, "reviewTitle");
    } else if (x[i] === "reviewContent") {
      errorz.stringChecker(newData.reviewContent, "reviewContent");
    } else if (x[i] === "rating") {
      errorz.ratingChecker(newData.rating);
    } else if (x[i] === "username") {
      errorz.stringChecker(newData.username, "username");
    } else {
      throw "Error: " + x[i] + " Key not valid";
    }
  }

  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const review = await readReview(id);

  if (username !== review.username) throw `Error: User cannot edit review.`;

  Object.keys(review).forEach((elem) => {
    if (Object.keys(newData).includes(elem)) {
      review[elem] = newData[elem];
    }
  });

  const updatedInfo = await gameCollection.updateOne(
    { "reviews._id": parsedId },
    { $set: { "reviews.$": review } }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update review information.`;

  return await readReview(id);
};

let removeReview = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  const parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ "reviews._id": parsedId });

  const review = await readReview(id);

  const user = await userUtil.findByUsername(review.username);

  let deletionInfo = await gameCollection.updateOne(
    { _id: game._id },
    { $pull: { reviews: review } }
  );
  if (deletionInfo.updatedCount === 0) throw `Could not delete review.`;

  await userUtil.removeReview(user.username, id);

  await gameUtil.removeReview(game._id.toString(), review.rating);

  return { reviewId: parsedId.toString(), deleted: true };
};

let getRecentReviews = async (username) =>
{
  errorz.stringChecker(username, "username");
  let user = await userUtil.findByUsername(username);
  let readThese = user.usersFollowing;
  let array = [];
  for(let i = 0; i < readThese.length; i++)
  {
    array.push(await userUtil.readUser(readThese[i].toString()));
  }
  let allReviews =[];
  for(let i = 0; i < array.length; i++)
  {
    if(array[i].reviewsLeft)
    {
      allReviews = allReviews.concat(array[i].reviewsLeft);
    }
  }
  if(allReviews.length > 10)
  {
    allReviews.slice(0,10);
  }
  let reviewObjs = [];
  for(let i =0; i < allReviews.length; i++)
  {
    reviewObjs.push(await readReview(allReviews[i].toString()));
  }
  reviewObjs.sort(function(a, b) {
    return b.timestamp - a.timestamp;
  });
  return reviewObjs;

}
module.exports = {
  createReview,
  readAllReviews,
  readReview,
  updateReview,
  removeReview,
  getRecentReviews
};
