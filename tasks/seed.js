const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const users = data.users;
const games = data.games;
const reviews = data.reviews;

let main = async () => {
  // Initializing database.
  const db = await dbConnection();

  await db.dropDatabase();

  // Initialize an admin.
  const lempie = await users.createUser(
    "admin",
    "lempie",
    "$2b$16$dZk6oJKoy2NBpI5KUM0bVOv7tjusBluaKUWKzOEjOsAPciMcMRu36",
    "lempie@gmail.com"
  );
 
  // Initialize a user.
  const randomname = await users.createUser(
    "user",
    "randomname",
    "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
    "aszyluk@stevens.edu"
  );
  const dylan = await users.createUser(
    "user",
    "dulan",
    "$2b$16$ufnk/noA/fhVyjF06Z9XkeiS39djqRFl5xdRUhUrGOMc2GO0LhXL6",
    "dulan@gmail.com"
  );

  // Initialize a game.
  const dsr = await games.createGame(
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

  await reviews.createReview(
    dsr._id.toString(),
    false,
    "Good Game",
    "This a good game",
    5,
    true,
    randomname.username
  );
  await users.followUser(lempie._id.toString(), randomname._id.toString());
  await users.followUser(lempie._id.toString(), dylan._id.toString());

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
