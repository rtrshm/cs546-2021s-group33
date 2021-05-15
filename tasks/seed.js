// NOTE: seed.js is being run when app.js is run. Do not run it independently anymore.

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

  const gavin = await users.createUser(
    "user",
    "gavin",
    "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
    "gpan1@stevens.edu"
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
    ["Action", "RPG", "Difficult", "Singleplayer"],
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
      "PC",
      "Playstation 4",
      "Xbox One",
      "Nintendo Switch",
    ],
    [
      "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/",
      "https://www.amazon.com/Dark-Souls-Remastered-PlayStation-4/dp/B078Y4FR14",
    ]
  );

  const dsrreview = await reviews.createReview(
    dsr._id.toString(),
    false,
    "Good Game",
    "This a good game",
    5,
    true,
    randomname.username
  );

  await reviews.markHelpful("lempie", dsrreview._id.toString());
  await users.favoriteGame(randomname._id.toString(), dsr._id.toString());

  const csgo = await games.createGame(
    "Counter Strike: Global Offensive",
    "https://www.mobygames.com/images/covers/l/501538-counter-strike-global-offensive-playstation-3-front-cover.jpg",
    "8/21/2012",
    ["Action", "Shooter", "Competitive", "Multiplayer", "AAA"],
    ["Hidden Path Entertainment, Inc.", "Valve Corporation"],
    ["Valve Corporation"],
    "M",
    ["Playstation 3", "Xbox 360", "PC"],
    ["https://store.steampowered.com/app/730"]
  );

  const csgoreview = await reviews.createReview(
    csgo._id.toString(),
    false,
    "Pretty Alright",
    "I really just wish my teammates wouldn't hold me back so much.",
    4,
    true,
    lempie.username
  );
  await reviews.markHelpful(dylan.username, csgoreview._id.toString());
  await users.favoriteGame(dylan._id.toString(), csgo._id.toString());

  const pyre = await games.createGame(
    "Pyre",
    "https://www.mobygames.com/images/covers/l/417517-pyre-playstation-4-front-cover.jpg",
    "7/25/2017",
    ["Sport", "Adventure", "RPG", "Indie"],
    ["Supergiant Games, Inc."],
    ["Supergiant Games, Inc."],
    "E10",
    ["Playstation 4", "PC"],
    [
      "https://store.steampowered.com/app/462770",
      "https://www.gog.com/game/pyre",
      "http://www.supergiantgames.com/",
      "https://www.playstation.com/en-us/games/pyre/",
    ]
  );

  const pyrereview = await reviews.createReview(
    pyre._id.toString(),
    false,
    "A Personal Favorite",
    "Really fun game with a good story.",
    5,
    true,
    randomname.username
  );
  await reviews.markHelpful(dylan.username, pyrereview._id.toString());
  await users.favoriteGame(randomname._id.toString(), pyre._id.toString());

  const brawlhalla = await games.createGame(
    "Brawlhalla",
    "https://www.mobygames.com/images/covers/l/432210-brawlhalla-playstation-4-front-cover.jpg",
    "4/30/2014",
    ["Fighting", "Multiplayer", "Casual", "Indie"],
    ["Blue Mammoth Games"],
    ["Blue Mammoth Games"],
    "E10",
    ["Playstation 4", "PC", "Android", "iOS", "Xbox One"],
    [
      "https://store.steampowered.com/app/291550",
      "https://play.google.com/store/apps/details?id=air.com.ubisoft.brawl.halla.platform.fighting.action.pvp&hl=en_US&gl=US",
      "https://apps.apple.com/us/app/brawlhalla/id1491520571",
      "https://www.brawlhalla.com/play/",
    ]
  );

  const brawlhallareview = await reviews.createReview(
    brawlhalla._id.toString(),
    false,
    "Eh...",
    "It's pretty fun but the monetization leaves something to be desired and also my teammates still suck.",
    3,
    false,
    lempie.username
  );
  await reviews.markHelpful(
    randomname.username,
    brawlhallareview._id.toString()
  );
  await users.favoriteGame(dylan._id.toString(), brawlhalla._id.toString());

  const mk8 = await games.createGame(
    "Mario Kart 8 Deluxe",
    "https://www.mobygames.com/images/covers/l/398969-mario-kart-8-deluxe-nintendo-switch-front-cover.png",
    "4/28/2017",
    ["Racing", "Multiplayer", "Casual", "AAA"],
    ["Nintendo EAD"],
    ["Nintendo of America Inc."],
    "E",
    ["Nintendo Switch"],
    ["https://mariokart8deluxe.nintendo.com/"]
  );

  const mk8review = await reviews.createReview(
    mk8._id.toString(),
    false,
    "Vroom Vroom",
    "I like using blue shells.",
    5,
    true,
    dylan.username
  );
  await reviews.markHelpful(randomname.username, mk8review._id.toString());
  await reviews.markHelpful(lempie.username, mk8review._id.toString());
  await users.favoriteGame(randomname._id.toString(), mk8._id.toString());
  await users.favoriteGame(dylan._id.toString(), mk8._id.toString());

  const sts = await games.createGame(
    "Slay the Spire",
    "https://www.mobygames.com/images/covers/l/561995-slay-the-spire-playstation-4-front-cover.jpg",
    "11/14/2017",
    [
      "Strategy",
      "Roguelike",
      "Card Game",
      "Adventure",
      "Indie",
      "Singleplayer",
    ],
    ["Mega Crit Games"],
    ["Mega Crit Games"],
    "E10",
    ["Nintendo Switch", "Android", "iOS", "PC", "Playstation 4", "Xbox One"],
    ["https://www.megacrit.com/"]
  );

  const stsreview = await reviews.createReview(
    sts._id.toString(),
    true,
    "Really Hard but Fun",
    "The game is really fun but I still haven't beaten the heart.",
    5,
    true,
    randomname.username
  );
  await reviews.markHelpful(dylan.username, stsreview._id.toString());
  await reviews.markHelpful(lempie.username, stsreview._id.toString());
  await users.favoriteGame(randomname._id.toString(), sts._id.toString());

  const nkp = await games.createGame(
    "Nekopara: Vol. 4",
    "https://www.mobygames.com/images/covers/l/705705-nekopara-vol-4-nintendo-switch-front-cover.jpg",
    "11/26/2020",
    ["Dating Sim", "Romance", "Sexual Content", "Anime", "AAA", "Singleplayer"],
    ["NEKO WORKs"],
    ["Sekai Project, Inc."],
    "M",
    ["Nintendo Switch", "PC", "Playstation 4"],
    ["https://store.steampowered.com/app/1406990"]
  );

  await reviews.createReview(
    nkp._id.toString(),
    false,
    "An Honorable Successor - A Review From A Lifelong Fan",
    "jaw drops to floor, eyes pop out of sockets accompanied by trumpets, heart beats out of chest, awooga awooga sound effect, pulls chain on train whistle that has appeared next to head as steam blows out, slams fists on table, rattling any plates, bowls or silverware, whistles loudly, fireworks shoot from top of head, pants loudly as tongue hangs out of mouth, wipes comically large bead of sweat from forehead, clears throat, straightens tie, combs hair Ahem, you look very lovely.",
    4,
    true,
    gavin.username
  );
  await users.favoriteGame(gavin._id.toString(), nkp._id.toString());

  const sub = await games.createGame(
    "Subnautica",
    "https://www.mobygames.com/images/covers/l/526178-subnautica-playstation-4-front-cover.jpg",
    "12/16/2014",
    ["Survival", "Horror", "Building", "Indie", "Singleplayer"],
    ["Unknown Worlds Entertainment, Inc."],
    ["Unknown Worlds Entertainment, Inc."],
    "E10",
    ["Nintendo Switch", "PC", "Playstation 4", "Xbox One"],
    ["http://subnauticagame.com/"]
  );

  const subreview = await reviews.createReview(
    sub._id.toString(),
    false,
    "Very Good Game",
    "This game scares the **** out of me!",
    5,
    true,
    randomname.username
  );
  await reviews.markHelpful(lempie.username, subreview._id.toString());
  await reviews.markHelpful(dylan.username, subreview._id.toString());
  await reviews.markHelpful(gavin.username, subreview._id.toString());
  await users.favoriteGame(randomname._id.toString(), sub._id.toString());
  await users.favoriteGame(gavin._id.toString(), sub._id.toString());

  const rks = await games.createGame(
    "Rocksmith 2014 Edition - Remastered",
    "https://www.gamereleasedates.net/images/covers/ps4/cover-ps4-rocksmith-2014-edition-remastered.jpg",
    "10/04/2016",
    ["Educational", "Singleplayer", "Casual", "AAA"],
    ["Ubisoft, Inc."],
    ["Ubisoft, Inc."],
    "T",
    ["PC", "Playstation 4", "Xbox One"],
    ["https://rocksmith.ubisoft.com/rocksmith/en-us/buy/index.aspx"]
  );

  const rksreview = await reviews.createReview(
    rks._id.toString(),
    false,
    "Good, but...",
    "I'm still awful at guitar",
    4,
    true,
    gavin.username
  );
  await reviews.markHelpful(randomname.username, rksreview._id.toString());
  await reviews.markHelpful(dylan.username, rksreview._id.toString());
  await users.favoriteGame(randomname._id.toString(), rks._id.toString());
  await users.favoriteGame(gavin._id.toString(), rks._id.toString());

  const ff6 = await games.createGame(
    "Final Fantasy VI",
    "https://www.mobygames.com/images/covers/l/22870-final-fantasy-iii-snes-front-cover.jpg",
    "4/02/1994",
    ["Adventure", "Singleplayer", "JRPG", "AAA"],
    ["Square Co., Ltd."],
    ["Square Co., Ltd."],
    "T",
    ["Android", "iOS", "Playstation 3", "PC"],
    [
      "https://www.amazon.com/SQUARE-ENIX-CO-LTD-FANTASY/dp/B00QA2C5E6/",
      "https://store.steampowered.com/app/382900/",
    ]
  );

  const ff6review = await reviews.createReview(
    ff6._id.toString(),
    true,
    "GOAT Game",
    "Greatest game of all time even if I'm mad I jumped with Shadow instead of waiting.",
    5,
    true,
    randomname.username
  );
  await reviews.markHelpful(gavin.username, ff6review._id.toString());
  await reviews.markHelpful(lempie.username, ff6review._id.toString());
  await users.favoriteGame(randomname._id.toString(), ff6._id.toString());

  const touhou = await games.createGame(
    "The Embodiment of Scarlet Devil",
    "https://www.mobygames.com/images/covers/l/179617-the-embodiment-of-scarlet-devil-windows-front-cover.jpg",
    "8/11/2002",
    ["Bullet Hell", "Singleplayer", "Difficult", "Anime", "Indie"],
    ["Team Shanghai Alice"],
    ["Team Shanghai Alice"],
    "T",
    ["PC"],
    ["https://www16.big.or.jp/~zun/html/th06.html"]
  );

  const touhoureview = await reviews.createReview(
    touhou._id.toString(),
    false,
    "Pretty good",
    "Easy game, easy life.",
    4,
    true,
    dylan.username
  );
  await reviews.markHelpful(randomname.username, touhoureview._id.toString());
  await reviews.markHelpful(lempie.username, touhoureview._id.toString());
  await users.favoriteGame(dylan._id.toString(), touhou._id.toString());

  const fs19 = await games.createGame(
    "Farming Simulator 19",
    "https://www.mobygames.com/images/covers/l/538459-farming-simulator-19-playstation-4-front-cover.jpg",
    "11/19/2018",
    ["Agriculture", "Singleplayer", "Casual", "Indie"],
    ["GIANTS Software GmbH"],
    ["Focus Home Interactive SAS"],
    "E",
    ["PC", "Playstation 4", "Xbox One"],
    ["https://www.farming-simulator.com/?lang=en&country=es"]
  );

  const fs19review = await reviews.createReview(
    fs19._id.toString(),
    false,
    "Just Farming",
    "It really makes you feel like a farmer.",
    2,
    false,
    dylan.username
  );
  const fs19review2 = await reviews.createReview(
    fs19._id.toString(),
    false,
    "I Love Farming",
    "It really makes you feel like a farmer.",
    5,
    false,
    lempie.username
  );
  await reviews.markHelpful(gavin.username, fs19review._id.toString());
  await reviews.markHelpful(randomname.username, fs19review2._id.toString());
  await users.favoriteGame(dylan._id.toString(), fs19._id.toString());

  await users.followUser(lempie._id.toString(), randomname._id.toString());
  await users.followUser(lempie._id.toString(), dylan._id.toString());

  // Testing complete with some basic information seeded.
  console.log("Done seeding database");
  // We no longer need to close the database connection since we are running seed.js in tandem with app.js.
  // await db.serverConfig.close();
};

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});