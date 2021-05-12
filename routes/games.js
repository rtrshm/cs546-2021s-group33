const express = require('express');
const router = express.Router();
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
let { ObjectId } = require('mongodb');
let gamesDatabase = require('../data/games');

    router.get('/allgames', async(req, res) => {
        let allgames;
        try{
            allgames = await gamesDatabase.getAllGames();
        } catch(e) {
            return res.status(500).render('gamesError.handlebars', {title: "No games"})
        }
        res.render("games.handlebars", {title:"All games", games:allgames})
    });
    router.get('/game/:id', async(req, res) => {
        let game;
        try{
            game = await gamesDatabase.getGameByTitle(req.params.id);
            if (game.reviews.length < 1) {
                 game.reviews = "None";
            }
        } catch(e) {
            return res.status(500).render('gamesError.handlebars', {title: "No game found"})
        }
        res.render("game.handlebars", {title:"Games", object:game})
    });
    router.get('/', async (req, res) => {
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