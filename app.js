const express = require('express')
const app = express()
const session = require('express-session')
const configRoutes = require('./routes')
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const userDatabase = require('./data/users');
const gameDatabase = require('./data/games');
const errorChecker = require('./data/errorChecker')
const bcrypt = require('bcrypt');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main', extname:'handlebars'}));
app.set('view engine', 'handlebars');
app.use(
    session({
        name: 'AuthCookie',
        secret: 'babababababababayoink',
        resave: false,
        saveUninitialized: true
    })
);

app.use(async (req, res, next) => {
    //console.log(req);
    //console.log(req.baseUrl);
    //console.log(req.originalUrl);
    if (req.originalUrl != '/' && req.originalUrl != '/login' && req.originalUrl != '/signup' && !req.session.user) {
        //console.log(req.originalUrl);
        return res.render("login.handlebars", {title: "Error", errormsg: "Error: Not logged in", redirect: req.originalUrl});
    }
    next();
});

app.get("/", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/nav')
    }
    next();
});

app.get("/signup", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/nav')
    }
    next();
});

app.get("/nav", async (req, res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.render("navError.handlebars", {title: "No perms", errormsg: "User has no perms"});
    }
    if (user.perms === "user") {
        return res.render("usernav.handlebars", {title: "Navigation", username: user.username});
    }
    else if (user.perms == "admin") {
        return res.render("adminnav.handlebars", {title: "Navigation", username: user.username});
    }
    else {
        console.log("what");
    }
});

app.post("/login", async (req, res) => {
    let { username, password, redirect } = req.body;
    if (!username || typeof(username) !== "string" || username.trim().length == 0) {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "No username provided or username is not valid string.", redirect: redirect});
    }
    if (!password || typeof(password) !== "string" || password.trim().length == 0) {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "No password provided or password is not valid string.", redirect: redirect});
    }
    username = username.toLowerCase();
    let user;
    try {
        user = await userDatabase.findByUsername(username);
    } catch(e){
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "Incorrect username or password.", redirect: redirect});
    }

    if (!user.password){
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "Invalid username or password.", redirect: redirect});
    }

    if (bcrypt.compareSync(password,user.password)) {
        req.session.user = user;
        return res.redirect(redirect);
    }
    else {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "Invalid username or password.", redirect: redirect});
    }
});

app.get("/profile", async (req, res) => {

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

app.get("/quiz", async (req, res) => {
    res.render("quiz.handlebars", {title: "Quiz"});
});

app.get("/addgame", async(req,res) => {
    res.render("admin.handlebars", {title: "Admin"});
});
app.post("/addgame", async (req, res) => {
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

    if (!errorChecker.isValidDate(dateReleased)){
        dateReleased = "N/A"
    }

    if (!genres || typeof(genres)!=='string' || genres.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres must be a list of non-empty strings seperated by commas"});
    }

    genres = genres.split(',');

    if (!genres || !Array.isArray(genres)) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres split failed"});
    }

    for(let genre of genres) {
        if(typeof(genre)!=="string" || genre.trim().length === 0) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: genres must be an array of non-empty strings"});
        }
    }

    if (!developers || typeof(developers)!=='string' || developers.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must be a list of non-empty strings seperated by commas"});
    }

    developers = developers.split(',');

    if (!developers || !Array.isArray(developers)) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers split failed"});
    }

    for(let developer of developers) {
        if(typeof(developer)!=="string" || developer.trim().length === 0) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: developers must be an array of non-empty strings"});
        }
    }

    if (!publishers || typeof(publishers)!=='string' || publishers.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be a list of non-empty strings seperated by commas"});
    }

    publishers = publishers.split(',');

    if (!publishers || !Array.isArray(publishers)) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers split failed"});
    }

    for(let publisher of publishers) {
        if(typeof(publisher)!=="string" || publisher.trim().length === 0) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: publishers must be an array of non-empty strings"});
        }
    }

    if (!ageRating || typeof(ageRating) !== "string") {
        ageRating = "N/A";
    }

    if (!platforms || typeof(platforms)!=='string' || platforms.trim().length == 0) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms must be a list of non-empty strings seperated by commas"});
    }

    platforms = platforms.split(',');

    if (!platforms || !Array.isArray(platforms)) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: platforms split failed"});
    }

    for(let platform of platforms) {
        if(typeof(platform)!=="string" || platform.trim().length === 0) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: Platforms must be an array of non-empty strings"});
        }
    }

    if (!purchaseLinks || typeof(purchaseLinks)!=='string' || purchaseLinks.trim().length == 0) {
        purchaseLinks = [];
    }
    else{
        purchaseLinks = purchaseLinks.split(',');
    }

    if (!purchaseLinks || !Array.isArray(purchaseLinks)) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks split failed"});
    }

    for(let purchaseLink of purchaseLinks) {
        if(typeof(purchaseLink)!=="string" || purchaseLink.trim().length === 0) {
            return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: purchaseLinks must be an array of non-empty strings"});
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
    
    try {
        game = await gameDatabase.createGame(title, img, dateReleased, genres, developers,
            publishers, ageRating, platforms, purchaseLinks); 
    }catch(e) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:e});
    }

    res.render("createGameSuccess.handlebars", {title:"Success"});
});

app.get('/logout', function (request, response) {
    request.session.destroy(function () {
        response.render('loggedOut', {title: "Logged out"});
    })
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });


