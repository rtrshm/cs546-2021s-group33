const express = require('express');
const router = express.Router();
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
let { ObjectId } = require('mongodb');
let gamesDatabase = require('../data/games');
const errorChecker = require('../data/errorChecker')

    router.get('/allgames', async(req, res) => {
        let allgames;
        try{
            allgames = await gamesDatabase.getAllGames();
        } catch(e) {
            return res.status(500).render('gamesError.handlebars', {title: "No games"})
        }
        return res.render("games.handlebars", {title:"All games", games:allgames})
    });

    router.get('/game/:id', async(req, res) => {
        let game;
        try{
            game = await gamesDatabase.getGameByTitle(req.params.id);
            if (!game.img || typeof(game.img) !== "string" || game.img.trim().length == 0) {
                game.img = "/public/no_image.jpeg";
            }
            if (!game.dateReleased || typeof(game.dateReleased) !== "string" || game.dateReleased.trim().length == 0) {
                game.dateReleased = "N/A";
            }

            if (!errorChecker.isValidDate(game.dateReleased)){
                game.dateReleased = "N/A";
            }
            
            if (!game.genres || !Array.isArray(game.genres)) {
                game.genres = "N/A";
            }
            if (game.genres.length < 1) {
                game.genres = "N/A";
            } 
            if (!game.developers || !Array.isArray(game.developers)) {
                game.developers = "N/A";
            }
            if (game.developers.length < 1) {
                game.developers = "N/A";
            } 
            if (!game.publishers || !Array.isArray(game.publishers)) {
                game.publishers = "N/A";
            }
            if (game.publishers.length < 1) {
                game.publishers = "N/A";
            }
            if (game.averageRating === null || typeof(game.averageRating) !== "number") {
                game.averageRating = "N/A";
            }
            if (game.numberOfReviews === null || typeof(game.numberOfReviews) !== "number") {
                game.numberOfReviews = "N/A";
            }
            if (!game.reviews || !Array.isArray(game.reviews)) {
                game.reviews = "None";
            }
            if (game.reviews.length < 1) {
                game.reviews = "None";
            }
            if (!game.ageRating || typeof(game.ageRating) !== "string" || game.ageRating.trim().length == 0) {
                game.ageRating = "N/A";
            }
            if (!game.platforms || !Array.isArray(game.platforms)) {
                game.platforms = "N/A";
            }
            if (game.platforms.length < 1) {
                game.platforms = "N/A";
            }
            if (!game.purchaseLinks || !Array.isArray(game.purchaseLinks)) {
                delete game.purchaseLinks;
            }
            if (game.purchaseLinks.length < 1) {
                delete game.purchaseLinks;
            }
        } catch(e) {
            return res.status(500).render('gamesError.handlebars', {title: "No game found"})
        }
        return res.render("game.handlebars", {title:"Games", object:game})
    });

    router.get('/allgames', async(req, res) => {
        let allgames;
        try{
            allgames = await gamesDatabase.getAllGames();
        } catch(e) {
            return res.status(500).render('gamesError.handlebars', {title: "No games"})
        }
        return res.render("games.handlebars", {title:"All games", games:allgames})
    });

    router.get('/search', async(req, res) => {
        return res.render("search.handlebars", {title:"Search for game"})
    });

    router.post('/exists', async(req, res) => {
        let {title} = req.body;
        console.log('requested');
        if (!title || typeof(title)!='string' || title.trim().length == 0){
            return res.status(500).render('searchError.handlebars', {title: "No game found"});
        }
        console.log('requested2');
        let taken;
        try{
          taken = await gamesDatabase.titleTaken(title);
        }
        catch (e){
            console.log(e);
            return res.status(500).render('searchError.handlebars', {title: "No game found"});
        }
        console.log('requested3');
        res.json({bool:taken})
    });

    router.post('/searchresults', async(req,res) => {
        let {title} = req.body;
        if (!title || typeof(title)!='string' || title.trim().length == 0){
            return res.status(500).render('searchError.handlebars', {title: "No game found"});
        }
        let gameFromDatabase;
        try {
            gameFromDatabase = await gamesDatabase.getGameByTitle(title);
        } catch(e) {
            return res.render("search.handlebars", {title:"Error", errormsg: "Error: No results found"});
        }
        return res.redirect('/games/search/' + gameFromDatabase.title);
    });

    router.get('/search/:id', async(req, res) => {
        let game;
        try{
            game = await gamesDatabase.getGameByTitle(req.params.id);
            if (!game.img || typeof(game.img) !== "string") {
                game.img = "../public/no_image.jpeg";
            }
            if (!game.dateReleased || typeof(game.dateReleased) !== "string") {
                game.dateReleased = "N/A";
            }
            if (!game.genres || !Array.isArray(game.genres)) {
                game.genres = "N/A";
            }
            if (game.genres.length < 1) {
                game.genres = "N/A";
            } 
            if (!game.developers || !Array.isArray(game.developers)) {
                game.developers = "N/A";
            }
            if (game.developers.length < 1) {
                game.developers = "N/A";
            } 
            if (!game.publishers || !Array.isArray(game.publishers)) {
                game.publishers = "N/A";
            }
            if (game.publishers.length < 1) {
                game.publishers = "N/A";
            }
            if (game.averageRating === null || typeof(game.averageRating) !== "number") {
                game.averageRating = "N/A";
            }
            if (game.numberOfReviews === null || typeof(game.numberOfReviews) !== "number") {
                game.numberOfReviews = "N/A";
            }
            if (!game.reviews || !Array.isArray(game.reviews)) {
                game.reviews = "None";
            }
            if (game.reviews.length < 1) {
                game.reviews = "None";
            }
            if (!game.ageRating || typeof(game.ageRating) !== "string") {
                game.ageRating = "N/A";
            }
            if (!game.platforms || !Array.isArray(game.platforms)) {
                game.platforms = "N/A";
            }
            if (game.platforms.length < 1) {
                game.platforms = "N/A";
            }
            if (!game.purchaseLinks || !Array.isArray(game.purchaseLinks)) {
                game.publishers = "N/A";
            }
            if (game.purchaseLinks.length < 1) {
                game.purchaseLinks = "N/A";
            }
        } catch(e) {
            return res.status(500).render('searchError.handlebars', {title: "No game found"})
        }
        return res.render("searchresult.handlebars", {title:"Game", object:game})
    });

module.exports = router;