const express = require('express');
const gameDatabase = require('../data/games')
const router = express.Router();
const errorChecker = require('../data/errorChecker')
const xss = require("xss");

router.get("/manage", async(req,res) => {
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("manage.handlebars", {title: "Manage games"});
    }
});
router.get("/addgame", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("admin.handlebars", {title: "Admin"});
    }
});

router.post("/addgame", async (req, res) => {
    let { 
        title, img, dateReleased, genres, developers, publishers, ageRating, platforms, purchaseLinks 
    } = req.body;
    title = xss(title);
    img = xss(img);
    dateReleased = xss(dateReleased);
    genres = xss(genres);
    developers = xss(developers);
    publishers = xss(publishers);
    ageRating =xss(ageRating);
    platforms = xss(platforms);
    purchaseLinks = xss(purchaseLinks);

    let game;

    if (!title || typeof(title) !== "string" || title.trim().length == 0) {
        return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: Cannot create game without a valid title"});
    }
    if (!img || typeof(img) !== "string" || img.trim().length == 0) {
        img = "../public/images/noimage.png";
    }
    if (!dateReleased || typeof(dateReleased) !== "string" || dateReleased.trim().length == 0) {
        dateReleased = "N/A";
    }
    else {
        dateReleased = dateReleased.split('-');
        if (dateReleased.length != 3){
            //console.log(`length ${dateReleased}`);
            dateReleased = 'N/A';
        }
        else {
            dateReleased = `${dateReleased[1]}/${dateReleased[2]}/${dateReleased[0]}`;
            //console.log(`${dateReleased} validity: ${errorChecker.isValidDate(dateReleased)}`);
            if (!errorChecker.isValidDate(dateReleased)){
                dateReleased = 'N/A';
            }
        }
    }

    if (!genres || typeof(genres)!=='string' || genres.trim().length == 0) {
        return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres cannot be empty"});
    }
    else {
        genres = genres.split(',');

        if (!genres || !Array.isArray(genres)) {
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres split failed"});
        }
    
        for(let genre of genres) {
            //console.log('genre is ' + genre)
            if(typeof(genre)!=="string" || genre.trim().length === 0) {
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres must contain non-empty comma seperated strings"});
            }
            else {
                genre = genre.trim();
                try{
                    errorChecker.genreChecker(genre)
                }catch(e){
                    return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:`invalid genre ${e}`});
                }
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
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers split failed"});
        }
    
        for(let developer of developers) {
            if(typeof(developer)!=="string" || developer.trim().length === 0) {
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must contain non-empty comma seperated strings"});
            }
            developer = developer.trim();
        }
    }

    if (!publishers || typeof(publishers)!=='string' || publishers.trim().length == 0) {
     //   return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be a list of non-empty strings seperated by commas"});
        publishers = [];
    }
    else {
        publishers = publishers.split(',');
        if (!publishers || !Array.isArray(publishers)) {
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers split failed"});
        }
    
        for(let publisher of publishers) {
            if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must contain non-empty comma seperated strings"});
            }
            publisher = publisher.trim();
        }
    }

    if (!ageRating || typeof(ageRating) !== "string") {
        ageRating = "N/A";
    }
    else {
        try{
            errorChecker.ageRatingChecker(ageRating)
        }catch(e){
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:`invalid age rating ${e}`});
        }
    }

    if (!platforms || typeof(platforms)!=='string' || platforms.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms must be a list of non-empty strings seperated by commas"});
        platforms = [];
    }else {
        platforms = platforms.split(',');
        if (!platforms || !Array.isArray(platforms)) {
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms split failed"});
        }
    
        for(let platform of platforms) {
            if(typeof(platform)!=="string" || platform.trim().length === 0) {
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: Platforms mustcontain non-empty comma seperated strings"});
            }
            else {
                platform = platform.trim();
                try{
                    errorChecker.platformChecker(platform)
                }catch(e){
                    return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:`invalid platform ${e}`});
                }
            }
        }
    }

    if (!purchaseLinks || typeof(purchaseLinks)!=='string' || purchaseLinks.trim().length == 0) {
        purchaseLinks = [];
    }
    else{
        purchaseLinks = purchaseLinks.split(',');
        if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
            return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks split failed"});
        }
    
        for(let purchaseLink of purchaseLinks) {
            if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must contain non-empty comma seperated strings"});
            }
            purchaseLink = purchaseLink.trim();
            let url;
            try {
                url = new URL(purchaseLink);
            }
            catch (e){
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
            }
            if (url.protocol !== "http:" && url.protocol !== "https:"){
                return res.status(400).render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
            }
        }
    }

    try {
        game = await gameDatabase.createGame(title, img, dateReleased, genres, developers,
            publishers, ageRating, platforms, purchaseLinks); 
    }catch(e) {
        // console.log('heree')
        return res.status(500).render("createGameError.handlebars", {title:"Error", errormsg:e});
    }

    res.render("createGameSuccess.handlebars", {title:"Success", game:game});
});

router.get("/remove", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("removeGame.handlebars", {title: "Remove game"});
    }
});

router.post("/remove", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to remove a game."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to remove a game."});
    }
    else if (user.perms == "admin") {
        let {title} = req.body;
        title=xss(title);

        let game;
        try{
            game = await gameDatabase.getGameByTitle(title);
        }catch(e) {
            return res.status(500).render("removeError.handlebars", {title: "Error", errormsg: e});
        }
        let gametitle = game.title;
        let removegame;
        try{
            removegame = await gameDatabase.removeGame(game._id.toString());
        }catch(e) {
            return res.status(500).render("removeError.handlebars", {title: "Error", errormsg: e});
        }
        return res.render("removeSuccess.handlebars", {title: "Game removed", gametitle: gametitle});
    }
});

router.get("/modify", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("modifyGame.handlebars", {title: "Modify game"});
    }
});

router.post("/modify", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let {title} = req.body;
        title=xss(title);
        let game;
        try{
            game = await gameDatabase.getGameByTitle(title);
        }catch(e) {
            return res.status(500).render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        return res.redirect("/admin/modify/" + game.title);
    }
});

router.get("/modify/:id", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let game;
        try{
            game = await gameDatabase.getGameByTitle(req.params.id);
        }catch(e) {
            return res.status(500).render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        return res.render("modifyActual.handlebars", {title: "Modify game", object: game});
    }
});

router.post("/modify/:id", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.status(403).render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let oldgame;
        let sameName = false;
        try{
            oldgame = await gameDatabase.readGame(req.params.id);
        }catch(e) {
            return res.status(500).render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        let { 
            title, img, dateReleased, genres, developers, publishers, ageRating, platforms, purchaseLinks 
        } = req.body;
        title = xss(title);
        img = xss(img);
        dateReleased = xss(dateReleased);
        genres = xss(genres);
        developers = xss(developers);
        publishers = xss(publishers);
        ageRating =xss(ageRating);
        platforms = xss(platforms);
        purchaseLinks = xss(purchaseLinks);

        if (!title) {
            title = oldgame.title;
            sameName = true;
        }
        else if (typeof(title) !== "string" || title.trim().length == 0) {
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid title"});
        }
        else {
            if (title == oldgame.title){
                sameName = true;
            }
        }

        if (!img) {
            img = oldgame.img;
        }
        else if (typeof(img) !== "string" || img.trim().length == 0) {
            img = "../public/images/noimage.png";
        }

        if (!dateReleased) {
            dateReleased = oldgame.dateReleased;
        }
        else if (typeof(dateReleased) !== "string" || dateReleased.trim().length == 0) {
            dateReleased = 'N/A';
        }
        else {
            dateReleased = dateReleased.split('-');
            if (dateReleased.length != 3){
                dateReleased = 'N/A';
            }
            else {
                dateReleased = `${dateReleased[1]}/${dateReleased[2]}/${dateReleased[0]}`;
                //console.log(`${dateReleased} validity: ${errorChecker.isValidDate(dateReleased)}`);
                if (!errorChecker.isValidDate(dateReleased)){
                    dateReleased = 'N/A';
                }
            }
        }
        if(!genres) {
            if (!oldgame.genres || oldgame.genres.length === 0) {
                genres = [];
            }
            else {
                genres = oldgame.genres;
            }
        }
        else if (typeof(genres)!=='string' || genres.trim().length == 0) {
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid genres"});
        }
        else {
            genres = genres.split(',');
    
            if (!genres || !Array.isArray(genres)) {
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: genres split failed"});
            }
        
            for(let genre of genres) {
                if(typeof(genre)!=="string" || genre.trim().length === 0) {
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: genres must contain non-empty comma seperated strings"});
                }
                else {
                    genre = genre.trim();
                    try{
                        errorChecker.genreChecker(genre)
                    }catch(e){
                        return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:`invalid genre ${e}`});
                    }
                }
            }
        }

        if (!developers) {
            if (!oldgame.developers || oldgame.developers.length === 0){
                developers = [];
            }
            else {
                developers = oldgame.developers;
            }
        }
    
        else if (typeof(developers)!=='string' || developers.trim().length == 0) {
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid developers"});
        }
        else {
            developers = developers.split(',');
            if (!developers || !Array.isArray(developers)) {
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: developers split failed"});
            }
        
            for(let developer of developers) {
                if(typeof(developer)!=="string" || developer.trim().length === 0) {
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: developers must contain non-empty comma seperated strings"});
                }
                developer = developer.trim();
            }
        }
        
        if (!publishers) {
            if (!oldgame.publishers || oldgame.publishers.length === 0){
                publishers = [];
            }
            else {
                publishers = oldgame.publishers;
            }
        }
        else if (typeof(publishers)!=='string' || publishers.trim().length == 0) {
         //   return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be a list of non-empty strings seperated by commas"});
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid publishers"});
        }
        else {
            publishers = publishers.split(',');
            if (!publishers || !Array.isArray(publishers)) {
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: publishers split failed"});
            }
        
            for(let publisher of publishers) {
                if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: publishers must contain non-empty comma seperated strings"});
                }
                publisher = publisher.trim();
            }
        }
        
        if (!ageRating) {
            ageRating = oldgame.ageRating;
        }
        else if (typeof(ageRating) !== "string") {
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid age rating"});
        }
        else {
            try{
                errorChecker.ageRatingChecker(ageRating)
            }catch(e){
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:`invalid age rating ${e}`});
            }
        }

        if (!platforms) {
            if (!oldgame.platforms || oldgame.platforms.length === 0){
                platforms = [];
            }
            else {
                platforms = oldgame.platforms;
            }
        }
    
        else if (typeof(platforms)!=='string' || platforms.trim().length == 0) {
            //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms must be a list of non-empty strings seperated by commas"});
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid platforms"});
        }else {
            platforms = platforms.split(',');
            if (!platforms || !Array.isArray(platforms)) {
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: platforms split failed"});
            }
        
            for(let platform of platforms) {
                if(typeof(platform)!=="string" || platform.trim().length === 0) {
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Platforms mustcontain non-empty comma seperated strings"});
                }
                else {
                    platform = platform.trim();
                    try{
                        errorChecker.platformChecker(platform)
                    }catch(e){
                        return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:`invalid platform ${e}`});
                    }
                }
            }
        }
        
        if (!purchaseLinks) {
            if (!oldgame.purchaseLinks || oldgame.purchaseLinks.length === 0){
                purchaseLinks = [];
            }
            else {
                purchaseLinks = oldgame.purchaseLinks;
            }
        }
        else if (typeof(purchaseLinks)!=='string' || purchaseLinks.trim().length == 0) {
            return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid purchase links"});
        }
        else{
            purchaseLinks = purchaseLinks.split(',');
            if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
                return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks split failed"});
            }
        
            for(let purchaseLink of purchaseLinks) {
                if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must contain non-empty comma seperated strings"});
                }
                purchaseLink = purchaseLink.trim();
                let url;
                try {
                    url = new URL(purchaseLink);
                }
                catch (e){
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
                }
                if (url.protocol !== "http:" && url.protocol !== "https:"){
                    return res.status(400).render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
                }
            }
        }
    
        try {
            let myobj = {title: title, img: img, dateReleased: dateReleased, genres: genres, developers: developers, publishers: publishers, ageRating: ageRating, platforms: platforms, purchaseLinks: purchaseLinks, sameName};
            newgame = await gameDatabase.updateGame(oldgame._id.toString(), myobj); 
        }catch(e) {
            return res.status(500).render("modifyGameError.handlebars", {title:"Error", errormsg:e});
        }
        return res.render("modifyGameSuccess.handlebars", {title: "Game modified", game: newgame});
    }
});

module.exports = router;