const express = require('express');
const router = express.Router();
const errorChecker = require('../data/errorChecker');
const usersDatabase = require('../data/users');
const reviewsDatabase = require('../data/reviews');

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
    try {
        user.usersFollowing = await usersDatabase.getListFollowing(user.username);
    }catch(e) {
        return res.render('profileError.handlebars', {title: "error", errormsg: e});
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

router.get("/:id", async (req, res) => {
    currentUser = req.session.user;
    let user;
    try {
        user = await usersDatabase.findByUsername(req.params.id);
    } catch (e) {
        return res.render('profileError.handlebars', {title: "error", errormsg: e});
    }
    let profile = user;
    if (!user.perms || typeof(user.perms) != 'string' || user.perms.trim().length == 0){
        profile.perms = 'N/A';
    }

    if (!user.username || typeof(user.username) != 'string' || user.username.trim().length == 0){
        profile.username = 'N/A';
    }

    if (!user.dateJoined || typeof(user.dateJoined) != 'string' || user.dateJoined.trim().length == 0){
        profile.dateJoined = 'N/A';
    }
    
    if (!user.email || typeof(user.email) != 'string' || user.email.trim().length == 0){
        profile.email = 'N/A';
    }

    try {
        errorChecker.ValidateEmail(user.email)
    }
    catch (e){
        profile.email = 'N/A';
    }

    if (user.username !== currentUser.username) {
        profile.email = 'Hidden';
    }
    try {
        profile.usersFollowing = await usersDatabase.getListFollowing(user.username);
    }catch(e) {
        return res.render('profileError.handlebars', {title: "error", errormsg: e});
    }
    if (!profile.usersFollowing || !Array.isArray(profile.usersFollowing) || profile.usersFollowing.length === 0) {
        profile.usersFollowing = "None";
    }
    if (!user.favoriteGames || !Array.isArray(user.favoriteGames) || user.favoriteGames.length === 0) {
        profile.favoriteGames = "This user has no favorite games.";
    }
    
    if (!user.reviewsLeft || !Array.isArray(user.reviewsLeft) || user.reviewsLeft.length === 0) {
        profile.reviewsLeft = "This user has not left any reviews.";
    } else try { 
        profile.reviewsLeft = await reviewsDatabase.getAllReviewsFromUser(user.username);
    } catch (e) {
        res.render(500).json({message: "Could not retrieve reviews for user"});
    }
    res.render("profile.handlebars", {title: "User profile", object: profile});
});
    
module.exports = router;