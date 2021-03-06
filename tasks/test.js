const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const { getListFollowing } = require("../data/users");
const users = data.users;
const games = data.games;
const reviews = data.reviews;

// TODO: Extend seeding.

let main = async () => {
    // Initializing database.
    const db = await dbConnection();

    await db.dropDatabase();

    // Initialize a user.
    const randomname = await users.createUser(
        "user",
        "randomname",
        "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
        "aszyluk@stevens.edu"
    );

    const epicgamer69420 = await users.createUser(
        "user",
        "epicgamer69420",
        // 'gaming'
        "$2b$16$2c4OX8P2k.H4ilbWo3FfY.zroEWy1Hl4QEZ67EjByeXUmWYAC3RX6",
        "epicgaming@gamers.com"
    );

    // Some functions for testing the functionality of user database functions.
    // This is not checking if errors are properly handled. This should be done separately.
    // TODO: Once we've confirmed that the functions work, remove these functions.
    try {
        const test1 = await users.readUser(randomname._id.toString());
        console.log(`Test 1 (readUser): ${JSON.stringify(test1)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test2 = await users.findByUsername(randomname.username);
        console.log(`Test 2 (findByUsername): ${JSON.stringify(test2)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test3 = await users.updateUser(randomname._id.toString(), {
            username: "morerandomname",
            perms: "admin",
        });
        console.log(`Test 3 (updateUser): ${JSON.stringify(test3)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test3andahalf = await users.followUser(randomname._id.toString(), epicgamer69420._id.toString());
        console.log(`Test 3.5 (followUser): ${test3andahalf.usersFollowing}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        )
    }

    try {
        const test3pt66 = await users.isFollowing("morerandomname", "epicgamer69420");
        console.log(`Test 3.66 (isFollowing) should be true: ${test3pt66}`);
        console.log(
            "******************************************************************************************************"
        )
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        )
    }

    try {
        const test3and3q = await users.unfollowUser(randomname._id.toString(), epicgamer69420._id.toString());
        console.log(`Test 3.75 (unfollowUser) should be empty: ${test3and3q.usersFollowing}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        )
    }



    try {
        const test4 = await users.removeUser(randomname._id.toString());
        console.log(`Test 4 (removeUser): ${JSON.stringify(test4)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }



    // Initializing a user with the same information as the first user. Since the user was deleted, there's no issue.
    // If there's an issue, that means the user wasn't removed properly.
    let morerandomname;
    try {
        morerandomname = await users.createUser(
            "user",
            "morerandomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            "aszyluk@stevens.edu"
        );
    } catch (e) {
        console.log(e);
    }

    // Initialize a game.
    const game = await games.createGame(
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
    try {
        const test5 = await games.readGame(game._id.toString());
        console.log(`Test 5 (readGame): ${JSON.stringify(test5)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test6 = await games.getAllGames();
        console.log(`Test 6 (getAllGames): ${JSON.stringify(test6)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test7 = await games.getGameByTitle(game.title);
        console.log(`Test 7 (getGameByTitle): ${JSON.stringify(test7)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const elems = [];
        let i = 0;
        game.genres.forEach((elem) => {
            elems[i] = elem;
            i++;
        });

        const test8a = await games.getGamesByGenre(elems[0]);
        console.log(`Test 8a (getGamesByGenre): ${JSON.stringify(test8a)}`);

        const test8b = await games.getGamesByGenre(elems[1]);
        console.log(`Test 8b (getGamesByGenre): ${JSON.stringify(test8b)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test9 = await games.updateGame(game._id.toString(), {
            title: "Dark Souls Remastered",
        });
        console.log(`Test 9 (updateGame): ${JSON.stringify(test9)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test10 = await games.removeGame(game._id.toString());
        console.log(`Test 10 (removeGame): ${JSON.stringify(test10)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    // Initializing a game with the same information as the first game. Since the game was deleted, there's no issue.
    // If there's an issue, that means the game wasn't removed properly.
    let dsr;
    try {
        dsr = await games.createGame(
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
    } catch (e) {
        console.log(e);
    }

    // Initialize a review.
    const review = await reviews.createReview(
        dsr._id.toString(),
        false,
        "Good Game",
        "This a good game",
        5,
        true,
        morerandomname.username
    );

    let test11;
    try {
        test11 = await reviews.readAllReviews(dsr._id.toString());
        console.log(`Test 11 (readAllReviews): ${JSON.stringify(test11)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test12 = await reviews.readReview(test11[0]._id.toString());
        console.log(`Test 12 (readReview): ${JSON.stringify(test12)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test13 = await reviews.updateReview(
            test11[0]._id.toString(),
            morerandomname.username,
            {
                reviewTitle: "Really Good Game",
            }
        );
        console.log(`Test 13 (updateReview): ${JSON.stringify(test13)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    try {
        const test14 = await reviews.removeReview(test11[0]._id.toString());
        console.log(`Test 14 (removeReview): ${JSON.stringify(test14)}`);
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "******************************************************************************************************"
        );
    }

    // Initializing a review with the same information as the first review. Since the review was deleted, there's no issue.
    // If there's an issue, that means the review wasn't removed properly.
    await reviews.createReview(
        dsr._id.toString(),
        false,
        "Good Game",
        "This a good game",
        5,
        true,
        morerandomname.username
    );
    console.log("Test 15 works!!!!");
    console.log(
        "************************************************************************************"
    );
    try {
        const bean = await users.createUser(
            "user",
            "randomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            "jimmy johsn"
        );
    } catch (e) {
        console.log(e);
        console.log("Test 16: Failure success! Error: Not a Valid Email");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser(
            "user",
            "randomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            false
        );
    } catch (e) {
        console.log(e);
        console.log("Test 17: Failure success! Error: email is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser(
            "user",
            "randomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C"
        );
    } catch (e) {
        console.log(e);
        console.log("Test 18: Failure success! Error: email does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser(
            "user",
            "morerandomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            "ga@gmail.com"
        );
    } catch (e) {
        console.log(e);
        console.log(
            "Test 19: Failure success! Error: Username already registered."
        );
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser();
    } catch (e) {
        console.log(e);
        console.log("Test 20: Failure success! Error: username does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser("user", "username", 5, "ga@gmail.com");
    } catch (e) {
        console.log(e);
        console.log("Test 21: Failure success! Error: password is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser(
            "user",
            5,
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            "ga@gmail.com"
        );
    } catch (e) {
        console.log(e);
        console.log("Test 22: Failure success! Error: username is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean = await users.createUser(
            "user",
            "randomname",
            "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
            "gavinrules@gmail.com"
        );
        const bean2 = await users.readUser(bean._id.toString());
        const bean3 = await users.findByUsername(bean.username);
        console.log(bean2);
        console.log(bean3);
        const bean4 = await users.removeUser(bean._id.toString());
        console.log("Test 23: Success!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }
    const bean = await users.createUser(
        "user",
        "randomname",
        "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
        "gavinrules@gmail.com"
    );
    try {
        const bean2 = await users.readUser();
    } catch (e) {
        console.log(e);
        console.log("Test 24: Failure success! Error: id does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.readUser(3483);
    } catch (e) {
        console.log(e);
        console.log("Test 25: Failure success! Error: id is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.readUser("                          ");
    } catch (e) {
        console.log(e);
        console.log(
            'Test 26: Failure success! Error: id cannot be "" or contain only whitespace'
        );
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.readUser("232423");
    } catch (e) {
        console.log(e);
        console.log("Test 27: Failure success! Error: Invalid Id!");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.findByUsername("Steve");
    } catch (e) {
        console.log(e);
        console.log("Test 28: Failure success! User not found.");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.findByUsername();
    } catch (e) {
        console.log(e);
        console.log("Test 29: Failure success! Error: username does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.findByUsername(3483);
    } catch (e) {
        console.log(e);
        console.log("Test 30: Failure success! Error: username is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.findByUsername("                          ");
    } catch (e) {
        console.log(e);
        console.log(
            'Test 31: Failure success! Error: username cannot be "" or contain only whitespace'
        );
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser();
    } catch (e) {
        console.log(e);
        console.log("Test 32: Failure success! Error: id does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser(3483);
    } catch (e) {
        console.log(e);
        console.log("Test 33: Failure success! Error: id is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser("                          ");
    } catch (e) {
        console.log(e);
        console.log(
            'Test 34: Failure success! Error: id cannot be "" or contain only whitespace'
        );
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser("232423");
    } catch (e) {
        console.log(e);
        console.log("Test 35: Failure success! Error: Invalid Id!");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser(bean._id.toString(), 1);
    } catch (e) {
        console.log(e);
        console.log("Test 36: Failure success! Error: Input is not a object");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser(bean._id.toString(), {
            fish: "string",
        });
    } catch (e) {
        console.log(e);
        console.log("Test 37: Failure success! Error: fish Key not valid");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser(bean._id.toString());
    } catch (e) {
        console.log(e);
        console.log("Test 38: Failure success! Error: input does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.updateUser(bean._id.toString(), {
            username: "12312",
        });
        const bean3 = await users.findByUsername("12312");
        console.log(bean3);
        console.log("Test 39: Success!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }
    try {
        const bean2 = await users.removeUser();
    } catch (e) {
        console.log(e);
        console.log("Test 40: Failure success! Error: id does not exist");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.removeUser(3483);
    } catch (e) {
        console.log(e);
        console.log("Test 41: Failure success! Error: id is not a string");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.removeUser("                          ");
    } catch (e) {
        console.log(e);
        console.log(
            'Test 42: Failure success! Error: id cannot be "" or contain only whitespace'
        );
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.removeUser("232423");
    } catch (e) {
        console.log(e);
        console.log("Test 43: Failure success! Error: Invalid Id!");
        console.log(
            "******************************************************************************************************"
        );
    }
    try {
        const bean2 = await users.removeUser(bean._id.toString());
        console.log(bean2);
        console.log("Test 44: Success! It got removed!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }

    const bean1 = await users.createUser(
        "user",
        "randomname",
        "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
        "gavinrules@gmail.com"
    );

    const bean2 = await users.createUser(
        "user",
        "randomname2",
        "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
        "gavinrul1es@gmail.com"
    );

    const bean3 = await users.createUser(
        "user",
        "randomnsame2",
        "$2a$16$ZLJbBLfBjgHk/Cst7F1ek.iM.8tL02YLq5Jqa5pbxHnseXRreQP9C",
        "gavinrusl1es@gmail.com"
    );

    const bean4 = await users.followUser(morerandomname._id.toString(), bean1._id.toString());
    const bean5 = await users.followUser(morerandomname._id.toString(), bean2._id.toString());
    const bean6 = await users.followUser(morerandomname._id.toString(), bean3._id.toString());
    await reviews.createReview(
        dsr._id.toString(),
        true,
        "this should be last",
        "this should be last",
        5,
        true,
        bean1.username
    );
    await reviews.createReview(
        dsr._id.toString(),
        false,
        "asdas",
        "asdasda",
        5,
        true,
        bean2.username
    );
    await reviews.createReview(
        dsr._id.toString(),
        false,
        "this should be first",
        "this should be first",
        5,
        true,
        bean3.username
    );

    try {
        let array = await reviews.getRecentReviews(morerandomname.username);

        for (let i = 0; i < array.length; i++) {
            console.log(array[i]);
        }
        console.log("Test 45: Success!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }

    try {
        let listFollowing = await users.getListFollowing("morerandomname");
        console.log("Test 46: " + listFollowing);
    } catch (e) {
        console.log("Test 46 error: " + e);
    }

    console.log(
        "******************************************************************************************************"
    );

    try {
        let array = await reviews.getAllReviewIdsFromUser(morerandomname.username);
        let arrayz =[];
        for(let i = 0; i < array.length; i++)
        {
            console.log(array[i]);
        }
        for(let i = 0; i < array.length; i++)
        {
            arrayz.push(await reviews.readReview(array[i].toString()));
        }
        for(let i = 0; i < arrayz.length; i++)
        {
            console.log(arrayz[i]);
        }
        console.log("Test 47: Success!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }

    try {
        let array = await reviews.getAllReviewsFromUser(morerandomname.username);
        for(let i = 0; i < array.length; i++)
        {
            console.log(array[i]);
        }
        console.log("Test 48: Success!");
        console.log(
            "******************************************************************************************************"
        );
    } catch (e) {
        console.log(e);
    }
    
    // Testing complete with some basic information seeded.
    console.log("Done seeding database");
    await db.serverConfig.close();
};

main().catch((error) => {
    console.error(error);
    /*return dbConnection().then((db) => {
      return db.serverConfig.close();
    });*/
});
