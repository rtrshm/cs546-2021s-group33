const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const errorz = require("./errorChecker");

//TODO: Handle errors in code.

let createGame = async (
  title,
  img,
  dateReleased,
  genres,
  developers,
  publishers,
  ageRating,
  platforms,
  purchaseLinks
) => {
  const gameCollection = await games();

  errorz.stringChecker(title, "title");
  errorz.stringChecker(img, "img");
  errorz.isValidDate(dateReleased);
  errorz.checkErrorArray(genres, "string");
  errorz.checkErrorArrayEmpty(developers, "string");
  errorz.checkErrorArrayEmpty(publishers, "string");
  errorz.stringChecker(ageRating, "ageRating");
  errorz.checkErrorArrayEmpty(platforms, "string");
  errorz.checkErrorArrayEmpty(purchaseLinks, "string");

  const newGame = {
    title: title,
    img: img,
    dateReleased: dateReleased,
    genres: genres,
    developers: developers,
    publishers: publishers,
    averageRating: 0.0,
    numberOfReviews: 0,
    reviews: [],
    ageRating: ageRating,
    platforms: platforms,
    purchaseLinks: purchaseLinks,
  };

  const checkTitle = new RegExp(`^${title}$`, "i");

  const check = await gameCollection.findOne({ title: checkTitle });
  if (check) throw `Error: Title already registered.`;

  const insertInfo = await gameCollection.insertOne(newGame);
  if (insertInfo.insertedCount === 0) throw `Could not create game.`;

  const newId = insertInfo.insertedId;

  const game = await readGame(newId.toString());
  return game;
};

let readGame = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw `Game not found.`;

  return game;
};

let getAllGames = async () => {
  const gameCollection = await games();
  const gameList = await gameCollection
    .find({}, { title: 1, genres: 1, averageRating: 1 })
    .toArray();
  if (gameList === null) throw `No games found.`;

  return gameList;
};

let getGameByTitle = async (title) => {
  errorz.stringChecker(title, "title");

  const gameCollection = await games();
  const game = await gameCollection.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
  });
  if (game === null) throw `Game not found.`;

  return game;
};

let getGamesByGenre = async (genre) => {
  errorz.stringChecker(genre, "genre");

  const gameCollection = await games();
  const gameList = await gameCollection
    .find({ genres: genre }, { title: 1, genres: 1, averageRating: 1 })
    .sort({ averageRating: 1 })
    .toArray();
  if (gameList === null) throw `No games with that genre found.`;

  return gameList;
};

let getGamesByGenreList = async (genres) => {
  errorz.checkErrorArray(genre, "string");

  const gameCollection = await games();
  const gameList = await gameCollection
    .find({ $or: { genres } }, { title: 1, genres: 1, averageRating: 1 })
    .sort({ averageRating: 1 })
    .toArray();
  if (gameList === null) throw `No games with any genres found.`;

  return gameList;
};

let getRecommendedGameByGame = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);

  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw `Game not found.`;

  let gameList = await getGamesByGenreList(game.genres);

  return gameList[0];
};

let updateGame = async (id, newData) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  errorz.existenceChecker(newData);
  errorz.typeChecker(newData, "object");
  let x = Object.keys(newData);
  if (x.length === 0) {
    throw "Error: newData is empty";
  }
  for (let i = 0; i < x.length; i++) {
    if (x[i] === "title") {
      errorz.stringChecker(newData.title, "title");
    } else if (x[i] === "img") {
      errorz.stringChecker(newData.img, "img");
    } else if (x[i] === "dateReleased") {
      errorz.isValidDate(newData.dateReleased);
    } else if (x[i] === "genres") {
      errorz.checkErrorArrayEmpty(newData.genres, "string");
    } else if (x[i] === "developers") {
      errorz.checkErrorArrayEmpty(newData.developers, "string");
    } else if (x[i] === "publishers") {
      errorz.checkErrorArrayEmpty(newData.publishers, "string");
    } else if (x[i] === "ageRating") {
      errorz.stringCheckerEmpty(newData.ageRating, "ageRating");
    } else if (x[i] === "platforms") {
      errorz.checkErrorArrayEmpty(newData.platforms, "string");
    } else if (x[i] === "purchaseLinks") {
      errorz.checkErrorArrayEmpty(newData.purchaseLinks, "string");
    } else {
      throw "Error: " + x[i] + " Key not valid";
    }
  }

  let parsedId = ObjectID(id);

  const gameCollection = await games();

  const updatedInfo = await gameCollection.updateOne(
    { _id: parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game information.`;

  return await readGame(id);
};

let updateReviewStats = async (id, rating) => {
  errorz.stringChecker(id, "id");
  errorz.ratingChecker(rating);
  errorz.idChecker(id);

  let parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });

  let newRating = (game.averageRating + rating) / (game.numberOfReviews + 1);

  const updatedInfo = await gameCollection.updateOne(
    { _id: parsedId },
    {
      $inc: { numberOfReviews: 1 },
      $set: { averageRating: newRating },
    }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game information.`;

  return await readGame(id);
};

let removeReview = async (id, rating) => {
  errorz.stringChecker(id, "id");
  errorz.ratingChecker(rating);
  errorz.idChecker(id);

  let parsedId = ObjectID(id);

  const gameCollection = await games();

  const game = await gameCollection.findOne({ _id: parsedId });

  const totalScore = game.averageRating * game.numberOfReviews;

  let newRating;
  if (game.numberOfReviews - 1 === 0) {
    newRating = 0;
  } else {
    newRating = (totalScore - rating) / (game.numberOfReviews - 1);
  }

  const updatedInfo = await gameCollection.updateOne(
    { _id: parsedId },
    {
      $inc: { numberOfReviews: -1 },
      $set: { averageRating: newRating },
    }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game information.`;

  return await readGame(id);
};

let removeGame = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);
  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const deletionInfo = await gameCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) throw `Could not delete game.`;

  return { gameId: parsedId.toString(), deleted: true };
};

module.exports = {
  createGame,
  readGame,
  getAllGames,
  getGameByTitle,
  getGamesByGenre,
  getGamesByGenreList,
  getRecommendedGameByGame,
  updateGame,
  updateReviewStats,
  removeReview,
  removeGame,
};
