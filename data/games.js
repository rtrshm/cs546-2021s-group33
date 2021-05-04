const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;

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

  const newGame = {
    title: title,
    img: img,
    dateReleased: dateReleased,
    genres: genres,
    developers: developers,
    publishers: publishers,
    averageRating: 0.0,
    numberOfReviews: 0,
    gameReviews: [],
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
  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw `Game not found.`;

  return game;
};

let updateGame = async (id, newData) => {
  let parsedId = ObjectID(id);

  const gameCollection = await games();

  const updatedInfo = await gameCollection.updateOne(
    { _id: parsedId },
    { $set: newData }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `Could not update game information.`;

  return await read(id);
};

let removeGame = async (id) => {
  let parsedId = ObjectID(id);

  const gameCollection = await games();
  const deletionInfo = await userCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) throw `Could not delete game.`;

  return { gameId: parsedId.toString(), deleted: true };
};

module.exports = {
  createGame,
  readGame,
  updateGame,
  removeGame,
};
