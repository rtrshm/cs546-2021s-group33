let myTitle = document.getElementById('title');
let myImg = document.getElementById('img');
let myGenres = document.getElementById('genres');
let myDevel = document.getElementById('developers');
let myPubli = document.getElementById('publishers');
let myAge = document.getElementById('ageRating');
let myPlat = document.getElementById('platforms');
let myPurch = document.getElementById('purchaseLinks');
let myForm = document.getElementById('addgame-form');
let err = document.getElementById('error');

function stringChecker(string, name)
{
    if(string === undefined)
    {
        throw "Error: " + name + " does not exist";
    }
    if(typeof string !== 'string')
    {
        throw "Error: " + name + " is not a string";
    }
    string = string.trim();
    if(string === "" || string.length === 0)
    {
        throw "Error: " + name + " cannot be \"\" or contain only whitespace";
    }
}

function genreChecker(string)
{
    stringChecker(string, "string");
    let genres = ["action", "shooter", "rpg", "sport", "adventure", "fighting", "racing", "strategy", "casual", "difficult", 
    "competitive", "multiplayer", "singleplayer", "romance", "roguelike", "dating sim", "survival", "sexual content", "anime",
    "horror", "building", "educational", "jrpg", "bullet hell", "card game", "agriculture", "indie", "aaa"];

    if(!genres.includes(string.toLowerCase())){
        throw string.toLowerCase();
    }
}

function platformChecker(string)
{
    stringChecker(string, "string");
    let plat= ["pc", "playstation 3", "playstation 4", "playstation 5", "xbox 360", "xbox one", "nintendo switch", "ios", "android"];

    if(!plat.includes(string.toLowerCase())){
        throw string.toLowerCase();
    }
}

function ageRatingChecker(string)
{
    stringChecker(string, "ageRating");
    let rating = ["e", "e10", "t", "m", "rp", "a"];
    if(!rating.includes(string.toLowerCase()))
    {
        throw string.toLowerCase();
    }
}

myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    err.innerHTML = "";
    let title = myTitle.value;
    let img = myImg.value;
    let genres = myGenres.value;
    let developers = myDevel.value;
    let publishers = myPubli.value;
    let ageRating = myAge.value;
    let platforms = myPlat.value;
    let purchaseLinks = myPurch.value;

    if (!title || typeof(title) !== "string" || title.trim().length == 0) {
        err.innerHTML = "Error: Game needs a title.";
        myTitle.focus();
        return;
    }

    if (!img || typeof(img) !== "string" || img.trim().length == 0) {
        myImg.value = "../public/images/noimage.png";
    }

    if (!genres || typeof(genres)!=='string' || genres.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres must be a list of non-empty strings seperated by commas"});
        err.innerHTML = "Error: Game needs genres.";
        myTitle.focus();
        return;
    }
    else {
        genres = genres.split(',');
        if (!genres || !Array.isArray(genres)) {
            err.innerHTML = "Error: Error: genres split failed";
            myGenres.focus();
            return;
        }

        for(let genre in genres) {
            if(typeof(genres[genre])!=="string" || genres[genre].trim().length === 0) {
                err.innerHTML = "Error: genres must contain non-empty comma seperated strings";
                myGenres.focus();
                return;
            }
            else {
                genres[genre] = genres[genre].trim().toLowerCase();
                try{
                    genreChecker(genres[genre]);
                }catch(e){
                    err.innerHTML = `invalid genre ${e}, genres can be "action", "shooter", "rpg", "sport", "adventure", "fighting", "racing", "strategy", "casual", "difficult", 
                    "competitive", "multiplayer", "singleplayer", "romance", "roguelike", "dating sim", "survival", "sexual content", "anime",
                    "horror", "building", "educational", "jrpg", "bullet hell", "card game", "agriculture", "indie", "aaa"`;
                    myGenres.focus();
                    return;
                }
            }
        }
        genres = [...new Set(genres)];
    }

    if (!developers || typeof(developers)!=='string' || developers.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must be a list of non-empty strings seperated by commas"});
        myDevel.value = "";
    }
    else {
        developers = developers.split(',');
        if (!developers || !Array.isArray(developers)) {
            err.innerHTML = "Error: developers split failed";
            myDevel.focus();
            return;
        }
    
        for(let developer in developers) {
            if(typeof(developers[developer])!=="string" || developers[developer].trim().length === 0) {
                err.innerHTML = "Error: developers must contain non-empty comma seperated strings";
                myDevel.focus();
                return;
            }
            else {
                developers[developer] = developers[developer].trim();
            }
        }
        developers = [...new Set(developers)];

    }

    if (!publishers || typeof(publishers)!=='string' || publishers.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be a list of non-empty strings seperated by commas"});
        myPubli.value = "";
    }
    else {
        publishers = publishers.split(',');
        if (!publishers || !Array.isArray(publishers)) {
            err.innerHTML = "Error: publishers split failed";
            myPubli.focus();
            return;
        }
    
        for(let publisher in publishers) {
            if(typeof(publishers[publisher])!=="string" || publishers[publisher].trim().length === 0) {
                err.innerHTML = "Error: publishers must contain non-empty comma seperated strings";
                myPubli.focus();
                return;
            }
            else {
                publishers[publisher] = publishers[publisher].trim();
            }
        }
        publishers = [...new Set(publishers)];

    }

    if (!ageRating || typeof(ageRating) !== "string") {
        err.innerHTML = "Error: Game needs an age rating.";
        myAge.focus();
        return;
    }
    else {
        try{
           ageRatingChecker(ageRating);
        }catch(e){
            err.innerHTML = `invalid age rating ${e}, rating can be "e", "e10", "t", "m", "rp", "a"`;
            myAge.focus();
            return;
        }
    }

    if (!platforms || typeof(platforms)!=='string' || platforms.trim().length == 0) {
        err.innerHTML = "Error: Game needs platforms.";
        myPlat.focus();
        return;
    }
    else {
        platforms = platforms.split(',');
        if (!platforms || !Array.isArray(platforms)) {
            err.innerHTML = "Error: platforms split failed";
            myPlat.focus();
            return;
        }
    
        for(let platform in platforms) {
            if(typeof(platforms[platform])!=="string" || platforms[platform].trim().length === 0) {
                err.innerHTML = "Error: platforms must contain non-empty comma separated strings";
                myPlat.focus();
                return;
            }
            else {
                platforms[platform] = platforms[platform].trim().toLowerCase();
                try{
                    platformChecker(platforms[platform]);
                }catch(e){
                    err.innerHTML = `invalid platform ${e}, platforms can be "pc", "playstation 3", "playstation 4", "playstation 5", "xbox 360", "xbox one", "nintendo switch", "ios", "android"`;
                    myPlat.focus();
                    return;
                }
            }
        }
        platforms = [...new Set(platforms)];

    }

    if (!purchaseLinks || typeof(purchaseLinks)!=='string' || purchaseLinks.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must be a list of non-empty strings seperated by commas"});
        myPurch.value = "";
    }
    else {
        purchaseLinks = purchaseLinks.split(',');
        if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
            err.innerHTML = "Error: purchaseLinks split failed";
            myPurch.focus();
            return;
        }
    
        for(let purchaseLink in purchaseLinks) {
            if(typeof(purchaseLinks[purchaseLink])!=="string" || purchaseLinks[purchaseLink].trim().length === 0) {
                err.innerHTML = "Error: purchaseLinks must contain non-empty comma seperated strings";
                myPurch.focus();
                return;
            }
            purchaseLinks[purchaseLink] = purchaseLinks[purchaseLink].trim();
            let url;
            try {
                url = new URL(purchaseLinks[purchaseLink]);
            }
            catch (e){
                err.innerHTML = "Error: purchaseLinks contains invalid URL";
                myPurch.focus();
                return;
            }
            if (url.protocol !== "http:" && url.protocol !== "https:"){
                err.innerHTML = "Error: purchaseLinks contains invalid URL";
                myPurch.focus();
                return;
            }
        }
        purchaseLinks = [...new Set(purchaseLinks)];

    }

    document.addgame.submit();
  });