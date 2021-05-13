const express = require('express');
const gameDatabase = require('../data/games')
const router = express.Router();

router.get("/addgame", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("admin.handlebars", {title: "Admin"});
    }
});

router.post("/addgame", async (req, res) => {
    let { 
        title, img, dateReleased, genres, developers, publishers, ageRating, platforms, purchaseLinks 
    } = req.body;

    let game;

    if (!title || typeof(title) !== "string" || title.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: Cannot create game without a valid title"});
    }
    if (!img || typeof(img) !== "string" || img.trim().length == 0) {
        img = "../public/no_image.jpeg";
    }
    if (!dateReleased || typeof(dateReleased) !== "string" || dateReleased.trim().length == 0) {
        dateReleased = "N/A";
    }

    if (!genres || typeof(genres)!=='string' || genres.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres cannot be empty"});
    }
    else {
        genres = genres.split(',');

        if (!genres || !Array.isArray(genres)) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres split failed"});
        }
    
        for(let genre of genres) {
            if(typeof(genre)!=="string" || genre.trim().length === 0) {
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres must contain non-empty comma seperated strings"});
            }
        }
    }

    if (!developers || typeof(developers)!=='string' || developers.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must be a list of non-empty strings seperated by commas"});
        developers = [];
    }
    else {
        developers = developers.split(',');
        if (!developers || !Array.isArray(developers)) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers split failed"});
        }
    
        for(let developer of developers) {
            if(typeof(developer)!=="string" || developer.trim().length === 0) {
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must contain non-empty comma seperated strings"});
            }
        }
    }

    if (!publishers || typeof(publishers)!=='string' || publishers.trim().length == 0) {
     //   return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be a list of non-empty strings seperated by commas"});
        publishers = [];
    }
    else {
        publishers = publishers.split(',');
        if (!publishers || !Array.isArray(publishers)) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers split failed"});
        }
    
        for(let publisher of publishers) {
            if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must contain non-empty comma seperated strings"});
            }
        }
    }

    if (!ageRating || typeof(ageRating) !== "string") {
        ageRating = "N/A";
    }

    if (!platforms || typeof(platforms)!=='string' || platforms.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms must be a list of non-empty strings seperated by commas"});
        platforms = [];
    }else {
        platforms = platforms.split(',');
        if (!platforms || !Array.isArray(platforms)) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms split failed"});
        }
    
        for(let platform of platforms) {
            if(typeof(platform)!=="string" || platform.trim().length === 0) {
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: Platforms mustcontain non-empty comma seperated strings"});
            }
        }
    }

    if (!purchaseLinks || typeof(purchaseLinks)!=='string' || purchaseLinks.trim().length == 0) {
        purchaseLinks = [];
    }
    else{
        purchaseLinks = purchaseLinks.split(',');
        if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks split failed"});
        }
    
        for(let purchaseLink of purchaseLinks) {
            if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must contain non-empty comma seperated strings"});
            }
            let url;
            try {
                url = new URL(purchaseLink);
            }
            catch (e){
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
            }
            if (url.protocol !== "http:" && url.protocol !== "https:"){
                return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
            }
        }
    }

    try {
        game = await gameDatabase.createGame(title, img, dateReleased, genres, developers,
            publishers, ageRating, platforms, purchaseLinks); 
    }catch(e) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:e});
    }

    res.render("createGameSuccess.handlebars", {title:"Success"});
});
module.exports = router;