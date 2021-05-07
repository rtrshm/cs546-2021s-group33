const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const games = data.games;
const reviews = data.reviews;

// TODO: Extend seeding.

let main = async () => {
  // Initializing database.
  const db = await dbConnection();

  await db.dropDatabase();

  // Initialize a user.
  const randomname = users.createUser(
    "user",
    "randomname",
    "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
    "aszyluk@stevens.edu"
  );

  // Some functions for testing the functionality of user database functions.
  // This is not checking if errors are properly handled. This should be done separately.
  // TODO: Once we've confirmed that the functions work, remove these functions.
  try{
    const test1 = await users.readUser(randomname._id);
    console.log(`Test 1 (readUser): ${test1}`);
  }catch(e)
  {
    console.log(e);
  }

  try{
    const test2 = await users.findByUsername(randomname.username);
    console.log(`Test 2 (findByUsername): ${test2}`);
  }catch(e)
  {
    console.log(e);
  }

  try{
    const test3 = await users.updateUser(randomname._id, {
    username: "morerandomname",
  });
  console.log(`Test 3 (updateUser): ${test3}`);
  }catch(e)
  {
    console.log(e);
  }
  try{
  const test4 = await users.removeUser(randomname._id);
  console.log(`Test 4 (removeUser): ${test4}`);
}catch(e)
{
  console.log(e);
}

  // Initializing a user with the same information as the first user. Since the user was deleted, there's no issue.
  // If there's an issue, that means the user wasn't removed properly.
  const morerandomname = users.createUser(
    "user",
    "morerandomname",
    "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
    "aszyluk@stevens.edu"
  );

  // Initialize a game.
  const game = games.createGame(
    "Dark Souls",
    "https://assets2.ignimgs.com/2016/01/19/darksouls1cover-agame-coverjpg-c73c7a_765w.jpg",
    "9/22/2011",
    ["Action role-playing game", "Dungeon crawl"],
    [
      "FromSoftware, Inc.",
      "Bluepoint Games",
      "Japan Studio",
      "Virtuos",
      "Shirogumi",
      "QLOC",
    ],
    ["FromSoftware, Inc.", "BANDAI NAMCO", "MORE"],
    "M",
    [
      "Playstation 3",
      "Xbox 360",
      "Microsoft Windows",
      "Playstation 4",
      "Xbox One",
      "Nintendo Switch",
    ],
    [
      "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/",
      "https://www.amazon.com/Dark-Souls-Remastered-PlayStation-4/dp/B078Y4FR14",
    ]
  );

  // Some functions for testing the functionality of game database functions.
  // This is not checking if errors are properly handled. This should be done separately.
  // TODO: Once we've confirmed that the functions work, remove these functions.
  const test5 = await games.readGame(game._id);
  console.log(`Test 5 (readGame): ${test5}`);

  const test6 = await games.getAllGames();
  console.log(`Test 6 (getAllGames): ${test6}`);

  const test7 = await games.getGameByTitle(game.title);
  console.log(`Test 7 (getGameByTitle): ${test7}`);

  const elems = [];
  let i = 0;
  game.genres.forEach((elem) => {
    elems[i] = elem;
    i++;
  });

  const test8a = await games.getGamesByGenre(elem[0]);
  console.log(`Test 8a (getGamesByGenre): ${test8a}`);

  const test8b = await games.getGamesByGenre(elem[1]);
  console.log(`Test 8b (getGamesByGenre): ${test8b}`);

  const test9 = await games.updateGame(game._id, {
    title: "Dark Souls Remastered",
  });
  console.log(`Test 9 (updateGame): ${test9}`);

  const test10 = await games.removeGame(game._id);
  console.log(`Test 10 (removeGame): ${test10}`);

  // Initializing a game with the same information as the first game. Since the game was deleted, there's no issue.
  // If there's an issue, that means the game wasn't removed properly.
  const dsr = games.createGame(
    "Dark Souls Remastered",
    "https://assets2.ignimgs.com/2016/01/19/darksouls1cover-agame-coverjpg-c73c7a_765w.jpg",
    "9/22/2011",
    ["Action role-playing game", "Dungeon crawl"],
    [
      "FromSoftware, Inc.",
      "Bluepoint Games",
      "Japan Studio",
      "Virtuos",
      "Shirogumi",
      "QLOC",
    ],
    ["FromSoftware, Inc.", "BANDAI NAMCO", "MORE"],
    "M",
    [
      "Playstation 3",
      "Xbox 360",
      "Microsoft Windows",
      "Playstation 4",
      "Xbox One",
      "Nintendo Switch",
    ],
    [
      "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/",
      "https://www.amazon.com/Dark-Souls-Remastered-PlayStation-4/dp/B078Y4FR14",
    ]
  );

  // Initialize a review.
  const review = await reviews.createReview(
    dsr._id,
    "false",
    "Good Game",
    "This a good game",
    10,
    true,
    morerandomname.username
  );

  const test11 = await reviews.readAllReviews(dsr._id);
  console.log(`Test 11 (readAllReviews): ${test11}`);

  const test12 = await reviews.readReview(review._id);
  console.log(`Test 12 (readReview): ${test12}`);

  const test13 = await reviews.updateReview(
    reviews._id,
    morerandomname.username,
    {
      reviewTitle: "Really Good Game",
    }
  );
  console.log(`Test 13 (updateReview): ${test13}`);

  const test14 = await reviews.removeReview(review._id);
  console.log(`Test 14 (removeReview): ${test14}`);

  // Initializing a review with the same information as the first review. Since the review was deleted, there's no issue.
  // If there's an issue, that means the review wasn't removed properly.
  await reviews.createReview(
    dsr._id,
    "false",
    "Good Game",
    "This a good game",
    10,
    true,
    morerandomname.username
  );

  // Testing complete with some basic information seeded.
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});
