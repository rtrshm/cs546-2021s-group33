const express = require('express');
const router = express.Router();
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
let { ObjectId } = require('mongodb')

    router.get('/', async (req, res) => {
// “_id”: ObjectID(60690756a54720327839a831),
// “title”: “Dark Souls”,
// “dateReleased”: “9/22/2011”,
// “genres” : [“Action role-playing game”, “Dungeon crawl”]
// “developers”: [“FromSoftware, Inc.”, “Bluepoint Games”, “Japan Studio”, “Virtuos”, “Shirogumi”, “QLOC”]
// “publishers” : [“FromSoftware, Inc.”, “BANDAI NAMCO”, “MORE”]
// “averageRating”: 9.5,
// “numberOfReviews”: 105,
// “gameReviews”: [ObjectId(6069093d88a06901fd7b7b85), ObjectId(606909be50205ec3304bfc75)],
// “ageRating”: “M”,
// “platforms”: [“Playstation 3”, “Xbox 360”, “Microsoft Windows”, “Playstation 4”, “Xbox One”, “Nintendo Switch”],
// “purchaseLinks”: [“https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/”, “https://www.amazon.com/Dark-Souls-Remastered-PlayStation-4/dp/B078Y4FR14/ref=sr_1_3?dchild=1&keywords=Dark+Souls&qid=1617495969&sr=8-3”]

        let obj = {
            title: "Dark Souls",
            dateReleased: "9/22/2011",
            genres: ["Action role-playing game", "Dungeon crawl"],
            developers: ["FromSoftware, Inc.", "Bluepoint Games", "Japan Studio", "Virtuos", "Shirogumi", "QLOC"],
            publishers: ["FromSoftware, Inc.", "BANDAI NAMCO", "MORE"],
            averageRating: 9.5,
            numberOfReviews: 105,
            gameReviews: [ObjectId("6069093d88a06901fd7b7b85").toString(), ObjectId("606909be50205ec3304bfc75").toString()],
            ageRating: "M",
            platforms: ["Playstation 3", "Xbox 360", "PC"],
            purchaseLinks: ["https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/"]
        };
        res.render("game.handlebars", {title: obj.title, object: obj})
        
    });

    

    
module.exports = router;