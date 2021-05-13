let myTitle = document.getElementById('title');
let myDate = document.getElementById('dateReleased');
let myImg = document.getElementById('image');
let myGenres = document.getElementById('genres');
let myDevel = document.getElementById('developers');
let myPubli = document.getElementById('publishers');
let myAge = document.getElementById('ageRating');
let myPlat = document.getElementById('platforms');
let myPurch = document.getElementById('purchaseLinks');
let myForm = document.getElementById('addgame-form');
let err = document.getElementById('error');

myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = myTitle.value;
    let img = myImg.value;
    let dateReleased = myDate.value;
    let genres = myGenres.value;
    let developers = myDevel.value;
    let publishers = myPubli.value;
    let ageRating = myAge.value;
    let platforms = myPlat.value;
    let purchaseLinks = myPurch.value;

    if (!img || typeof(img) !== "string" || img.trim().length == 0) {
        myImg.value = "../public/images/noimage.png";
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
        }
    
        for(let developer of developers) {
            if(typeof(developer)!=="string" || developer.trim().length === 0) {
                err.innerHTML = "Error: developers must contain non-empty comma seperated strings";
                myDevel.focus();
            }
        }
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
        }
    
        for(let publisher of publishers) {
            if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
                err.innerHTML = "Error: publishers must contain non-empty comma seperated strings";
                myPubli.focus();
            }
        }
    }

    if (!ageRating || typeof(ageRating) !== "string") {
        myAge.value = "N/A";
    }

    if (!platforms || typeof(platforms)!=='string' || platforms.trim().length == 0) {
        //return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms must be a list of non-empty strings seperated by commas"});
        myPlat.value = "";
    }
    else {
        platforms = platforms.split(',');
        if (!platforms || !Array.isArray(platforms)) {
            err.innerHTML = "Error: platforms split failed";
            myPlat.focus();
        }
    
        for(let platform of platforms) {
            if(typeof(platform)!=="string" || platform.trim().length === 0) {
                err.innerHTML = "Error: platforms must contain non-empty comma seperated strings";
                myPlats.focus();
            }
        }
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
        }
    
        for(let purchaseLink of purchaseLinks) {
            if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
                err.innerHTML = "Error: purchaseLinks must contain non-empty comma seperated strings";
                myPurch.focus();
                break;
            }
            let url;
            try {
                url = new URL(purchaseLink);
            }
            catch (e){
                err.innerHTML = "Error: purchaseLinks contains invalid URL";
                myPurch.focus();
            }
            if (url.protocol !== "http:" && url.protocol !== "https:"){
                err.innerHTML = "Error: purchaseLinks contains invalid URL";
                myPurch.focus();
            }
        }
    }
    
    if (!title || typeof(title) !== "string" || title.trim().length == 0) {
        err.innerHTML = "Error: Game needs a title.";
        myTitle.focus();
        return;
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
    
        for(let genre of genres) {
            if(typeof(genre)!=="string" || genre.trim().length === 0) {
                err.innerHTML = "Error: genres must contain non-empty comma seperated strings";
                myGenres.focus();
                return;
            }
        }
    }

    document.login.submit();
  });