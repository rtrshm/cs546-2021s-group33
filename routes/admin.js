const express = require('express');
const gameDatabase = require('../data/games')
const router = express.Router();

router.get("/manage", async(req,res) => {
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("manage.handlebars", {title: "Manage games"});
    }
});
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
        console.log('z');
        return res.render("createGameError.handlebars", {title:"Error", errormsg:e});
    }

    res.render("createGameSuccess.handlebars", {title:"Success", game:title});
});

router.get("/remove", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("removeGame.handlebars", {title: "Remove game"});
    }
});

router.post("/remove", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to remove a game."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to remove a game."});
    }
    else if (user.perms == "admin") {
        let {title} = req.body;
        let game;
        try{
            game = await gameDatabase.getGameByTitle(title);
        }catch(e) {
            return res.render("removeError.handlebars", {title: "Error", errormsg: e});
        }
        let gametitle = game.title;
        let removegame;
        try{
            removegame = await gameDatabase.removeGame(game._id.toString());
        }catch(e) {
            return res.render("removeError.handlebars", {title: "Error", errormsg: e});
        }
        return res.render("removeSuccess.handlebars", {title: "Game removed", gametitle: gametitle});
    }
});

router.get("/modify", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to view this page."});
    }
    else if (user.perms == "admin") {
        return res.render("modifyGame.handlebars", {title: "Modify game"});
    }
});

router.post("/modify", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let {title} = req.body;
        let game;
        try{
            game = await gameDatabase.getGameByTitle(title);
        }catch(e) {
            return res.render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        return res.redirect("/admin/modify/" + game.title);
    }
});

router.get("/modify/:id", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let game;
        try{
            game = await gameDatabase.getGameByTitle(req.params.id);
        }catch(e) {
            return res.render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        return res.render("modifyActual.handlebars", {title: "Modify game", object: game});
    }
});

router.post("/modify/:id", async(req,res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    if (user.perms === "user") {
        return res.render("permissionError.handlebars", {title: "Permission denied", errormsg: "You do not have permission to modify a game."});
    }
    else if (user.perms == "admin") {
        let oldgame;
        try{
            oldgame = await gameDatabase.getGameByTitle(req.params.id);
        }catch(e) {
            return res.render("modifyGameError.handlebars", {title: "Error", errormsg: e});
        }
        let { 
            title, img, dateReleased, genres, developers, publishers, ageRating, platforms, purchaseLinks 
        } = req.body;

        if (!title) {
            title = oldgame.title;
        }
        else if (typeof(title) !== "string" || title.trim().length == 0) {
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid title"});
        }

        if (!img) {
            img = oldgame.img;
        }
        else if (typeof(img) !== "string" || img.trim().length == 0) {
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid img link"});
        }

        if (!dateReleased) {
            dateReleased = oldgame.dateReleased;
        }
        else if (typeof(dateReleased) !== "string" || dateReleased.trim().length == 0) {
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid date released"});
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
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid genres"});
        }
        else {
            genres = genres.split(',');
    
            if (!genres || !Array.isArray(genres)) {
                return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: genres split failed"});
            }
        
            for(let genre of genres) {
                if(typeof(genre)!=="string" || genre.trim().length === 0) {
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: genres must contain non-empty comma seperated strings"});
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
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid developers"});
        }
        else {
            developers = developers.split(',');
            if (!developers || !Array.isArray(developers)) {
                return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: developers split failed"});
            }
        
            for(let developer of developers) {
                if(typeof(developer)!=="string" || developer.trim().length === 0) {
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: developers must contain non-empty comma seperated strings"});
                }
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
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid publishers"});
        }
        else {
            publishers = publishers.split(',');
            if (!publishers || !Array.isArray(publishers)) {
                return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: publishers split failed"});
            }
        
            for(let publisher of publishers) {
                if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: publishers must contain non-empty comma seperated strings"});
                }
            }
        }
        
        if (!ageRating) {
            ageRating = oldgame.ageRating;
        }
        else if (typeof(ageRating) !== "string") {
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid age rating"});
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
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid platforms"});
        }else {
            platforms = platforms.split(',');
            if (!platforms || !Array.isArray(platforms)) {
                return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: platforms split failed"});
            }
        
            for(let platform of platforms) {
                if(typeof(platform)!=="string" || platform.trim().length === 0) {
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Platforms mustcontain non-empty comma seperated strings"});
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
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: Invalid purchase links"});
        }
        else{
            purchaseLinks = purchaseLinks.split(',');
            if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
                return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks split failed"});
            }
        
            for(let purchaseLink of purchaseLinks) {
                if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must contain non-empty comma seperated strings"});
                }
                let url;
                try {
                    url = new URL(purchaseLink);
                }
                catch (e){
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
                }
                if (url.protocol !== "http:" && url.protocol !== "https:"){
                    return res.render("modifyGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks contains invalid url"});
                }
            }
        }
    
        try {
            let myobj = {title: title, img: img, dateReleased: dateReleased, genres: genres, developers: developers, publishers: publishers, ageRating: ageRating, platforms: platforms, purchaseLinks: purchaseLinks}
            newgame = await gameDatabase.updateGame(oldgame._id.toString(), myobj); 
        }catch(e) {
            console.log(genres);
            console.log(developers);
            console.log(publishers);
            console.log(platforms);
            console.log(purchaseLinks);
            return res.render("modifyGameError.handlebars", {title:"Error", errormsg:e});
        }
        return res.render("modifyGameSuccess.handlebars", {title: "Game modified", gametitle: oldgame.title});
    }
});

module.exports = router;