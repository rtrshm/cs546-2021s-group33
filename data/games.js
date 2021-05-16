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
  errorz.genreArrayChecker(genres);
  errorz.checkErrorArrayEmpty(developers, "string");
  errorz.checkErrorArrayEmpty(publishers, "string");
  errorz.ageRatingChecker2(ageRating);
  errorz.platformArrayChecker(platforms);
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

let titleTaken = async (title) => {
  errorz.stringChecker(title, "title");

  const gameCollection = await games();
  const game = await gameCollection.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
  });
  if (game === null) return false;

  return true;
};

let getGamesByGenre = async (genre) => {
  errorz.stringChecker(genre, "genre");

  const gameCollection = await games();
  const gameList = await gameCollection
    .find({ genres: genre }, { title: 1, genres: 1, averageRating: 1 })
    .sort({ averageRating: -1 })
    .toArray();
  if (gameList === null) throw `No games with that genre found.`;

  return gameList;
};

let getGamesByParameters = async (params) => {
  errorz.genreArrayChecker(params.genres);
  errorz.platformArrayChecker(params.platforms);
  const gameCollection = await games();

  // ensure that at least one genre and platform is satisfied
  const gameList = await gameCollection
    .find(
      {
        $and: [
          { genres: { $in: params.genres } },
          { platforms: { $in: params.platforms } },
        ],
      },
      { title: 1, genres: 1, averageRating: 1 }
    )
    .sort({ averageRating: -1 })
    .toArray();

  // consider sorting by number of categories satisfied in later updates

  if (gameList === null) throw `No games with given parameters found.`;

  return gameList;
};

let getRecommendedGameByGame = async (id) => {
  errorz.stringChecker(id, "id");
  errorz.idChecker(id);

  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw `Game not found.`;

  let gameList = await getGamesByParameters({
    genres: game.genres,
    platforms: game.platforms,
  });

  let i = gameList.findIndex((elem) => {return elem.title === game.title});
  if (i != -1) {
    gameList.splice(i, 1);
  }
  
  if (gameList.length > 5) gameList = gameList.slice(0, 5);

  return gameList;
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
      errorz.genreArrayChecker(newData.genres);
    } else if (x[i] === "developers") {
      errorz.checkErrorArrayEmpty(newData.developers, "string");
    } else if (x[i] === "publishers") {
      errorz.checkErrorArrayEmpty(newData.publishers, "string");
    } else if (x[i] === "ageRating") {
      errorz.ageRatingChecker2(newData.ageRating);
    } else if (x[i] === "platforms") {
      errorz.platformArrayChecker(newData.platforms);
    } else if (x[i] === "purchaseLinks") {
      errorz.checkErrorArrayEmpty(newData.purchaseLinks, "string");
    } else if (x[i] === "sameName") {
    } else {
      throw "Error: " + x[i] + " Key not valid";
    }
  }
  if (!newData.sameName) {
    if (newData.title) {
      let taken;
      try {
        taken = await titleTaken(newData.title);
      } catch (e) {
        throw e;
      }
      if (taken) throw `Error: Title ${newData.title} already taken`;
    }
  }
  delete newData.sameName;

  let parsedId = ObjectID(id);

  const gameCollection = await games();

  const updatedInfo = await gameCollection.updateOne(
    { _id: parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `No data to change.`;

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
  getGamesByParameters,
  getRecommendedGameByGame,
  updateGame,
  updateReviewStats,
  removeReview,
  removeGame,
  titleTaken,
};
