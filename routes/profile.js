const express = require('express');
const router = express.Router();
const errorChecker = require('../data/errorChecker');
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
// let { ObjectId } = require('mongodb')

router.get("/", async (req, res) => {

    user = req.session.user;

    if (!user.perms || typeof(user.perms) != 'string' || user.perms.trim().length == 0){
        user.perms = 'N/A';
    }

    if (!user.username || typeof(user.username) != 'string' || user.username.trim().length == 0){
        user.username = 'N/A';
    }

    if (!user.dateJoined || typeof(user.dateJoined) != 'string' || user.dateJoined.trim().length == 0){
        user.dateJoined = 'N/A';
    }
    
    if (!user.email || typeof(user.email) != 'string' || user.email.trim().length == 0){
        user.email = 'N/A';
    }

    try {
        errorChecker.ValidateEmail(user.email)
    }
    catch (e){
        user.email = 'N/A';
    }

    if (!user.usersFollowing || !Array.isArray(user.usersFollowing) || user.usersFollowing.length === 0) {
        user.usersFollowing = "This user is not following anyone.";
    }
    if (!user.favoriteGames || !Array.isArray(user.favoriteGames) || user.favoriteGames.length === 0) {
        user.favoriteGames = "This user has no favorite games.";
    }
    if (!user.reviewsLeft || !Array.isArray(user.reviewsLeft) || user.reviewsLeft.length === 0) {
        user.reviewsLeft = "This user has not left any reviews.";
    }
    res.render("profile.handlebars", {title: "User profile", object: user});
});
    
module.exports = router;