const express = require('express');
const router = express.Router();
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
let { ObjectId } = require('mongodb');
let gamesDatabase = require('../data/games');
let reviewsDatabase = require('../data/reviews');
let usersDatabase = require('../data/users');
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
        game = await gamesDatabase.readGame(req.params.id);
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
    if (!title || typeof(title)!='string' || title.trim().length == 0){
        return res.json({bool:false});
    }
    let taken;
    try{
        taken = await gamesDatabase.titleTaken(title);
    }
    catch (e){
        console.log(e);
        return res.json({bool:false});
    }
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

router.post('/addReview/:id', async (req, res) => {
    let gameId = req.params.id;
    if (!gameId)
        return res.status(404).json({message: "No id provided"});
    
    try {
        errorChecker.idChecker(gameId);
    } catch (e) {
        return res.status(400).json({message: "Invalid game ID"});
    }

    let reviewData = req.body;

    if (!reviewData)
        return res.status(400).json({message: "Missing request body"});



    // ajax converts all input to strings, so we must convert to actual dtypes
    reviewData.spoiler = (reviewData.spoiler == 'true');
    reviewData.recommended = (reviewData.recommended == 'true');
    reviewData.rating = +reviewData.rating;
    reviewData.timestamp = +reviewData.timestamp;


    // check for errors
    try {
        errorChecker.stringChecker(reviewData.reviewTitle, 'review title');
        errorChecker.stringChecker(reviewData.reviewContent, 'review text');
        errorChecker.typeChecker(+reviewData.timestamp, 'number');
        errorChecker.ratingChecker(+reviewData.rating);
        errorChecker.typeChecker(reviewData.spoiler, 'boolean');
        errorChecker.typeChecker(reviewData.recommended, 'boolean');
    } catch (e) {
        console.log(e);
        return res.status(400).json({message: "Invalid add review parameter"});
    }

    let username = req.session.user.username;
    try {
        await reviewsDatabase.createReview(
            gameId, 
            reviewData.spoiler,
            reviewData.reviewTitle,
            reviewData.reviewContent,
            reviewData.rating,
            reviewData.recommended,
            username);
    } catch (e) {
        console.log(e);
        if (e == "Error: Game does not exist.") {
            res.status(404).render('gamesError.handlebars', {title: 'Game not found'});
        } else if (e == "Could not update game with review.") {
            res.status(500).json({message: "Review could not be added."});
        }
    }
    res.status(200).send();
});

router.post('/quiz', async (req, res) => {
    let params = req.body;
    if (!params) res.status(400).json({message: "No parameters provided"});
    try {
        let resultList = await gamesDatabase.getGamesByParameters(params);
        res.json(resultList).send();
        return;
    } catch (e) {
        console.log(e);
        res.status(404).json({message: "No games with matching parameter found"});
        return;
    }
});

router.post("/hasRatedHelpful", async (req, res) => {
    let {reviewId} = req.body;
    let user = req.session.user.username;
    let hasRatedHelpful = false;
    try{
        hasRatedHelpful = await usersDatabase.hasRatedHelpful(user,reviewId);
    } catch(e) {
        console.log(e);
        return res.json({bool:false});
    }
    return res.json({bool:hasRatedHelpful});
});

router.post("/rateHelpful", async (req, res) => {
    let reviewId;
    if (req.body) reviewId = req.body.reviewId;
    else res.status(400).json({message: 'Missing request body'});
    let username = req.session.user.username;
    try {
        let success  = await reviewsDatabase.markHelpful(username, reviewId);
        res.json({bool:success});
    } catch (e) {
        console.log(e);
        res.json({bool:false});
    }
});

router.post("/unrateHelpful", async (req, res) => {
    let reviewId;
    if (req.body) reviewId = req.body.reviewId;
    else res.status(400).json({message: 'Missing request body'});
    let username = req.session.user.username;
    try {
        let success  = await reviewsDatabase.unmarkHelpful(username, reviewId);
        res.json({bool:success});
    } catch (e) {
        console.log(e);
        res.json({bool:false});
    }
});

router.post('/generateSuggestions', async (req, res) => {
    let gameId; 
    if (req.body) gameId = req.body.gameId;
    let username = req.session.user.username;

    try{
        errorChecker.stringChecker(gameId, "gameId");
        errorChecker.idChecker(gameId);
        errorChecker.stringChecker(username, "userId");
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'invalid gameId'});
        return;
    }

    let user;
    try {
        user = await usersDatabase.findByUsername(username);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'user was not found from session username, this should not happen ever'});
    }
    // if user has recommended the game, generate some extra suggestions
    if (await usersDatabase.hasRecommended(user._id.toString(), gameId)) {
        let suggestions = await gamesDatabase.getRecommendedGameByGame(gameId);
        return res.json({suggestions});
    } else {
        return res.json({suggestions: []});
    }
})

module.exports = router;