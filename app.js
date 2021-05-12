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

app.get("/nav", async (req, res) => {
    if (!req.session.user) {
        return res.render("login.handlebars", {title: "Error", errormsg: "Error: Not logged in"});
    }
    user = req.session.user;
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
    let { username, password } = req.body;
    if (!username || typeof(username) !== "string") {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "No username provided or username is not valid string."});
    }
    if (!password || typeof(password) !== "string") {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "No password provided or password is not valid string."});
    }
    username = username.toLowerCase();
    let user;
    try {
        user = await userDatabase.findByUsername(username);
    } catch(e){
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "Incorrect username or password."});
    }

    if (bcrypt.compareSync(password,user.password)) {
        req.session.user = user;
        return res.redirect("/nav");
    }
    else {
        return res.render("login.handlebars", {title: "Sign in failed", errormsg: "Invalid username or password."});
    }

    if (!req.session.user) {
        res.status(401);
        res.render("posts/login", {title: "Error", errormsg: "Error: Did not provide a valid username and/or password."});
        return 0;
    }
});

app.get("/profile", async (req, res) => {
    if (!req.session.user) {
        return res.render("login.handlebars", {title:"Login", errormsg:"Error: Not logged in"});
    }
    user = req.session.user;
    let profile = {
        perms: user.perms,
        username: user.username,
        dateJoined: user.dateJoined,
        password: user.password,
        usersFollowing: user.usersFollowing,
        email: user.email,
        favoriteGames: user.favoriteGames,
        reviewsLeft: user.reviewsLeft
    };
    if (user.usersFollowing.length === 0) {
        profile.usersFollowing = "This user is not following anyone.";
    }
    if (user.favoriteGames.length === 0) {
        profile.favoriteGames = "This user has no favorite games.";
    }
    if (user.reviewsLeft.length === 0) {
        profile.reviewsLeft = "This user has not left any reviews.";
    }
    res.render("profile.handlebars", {title: "User profile", object: profile});
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

    if (!title || typeof(title) !== "string") {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:"Error: Cannot create game without a valid title"});
    }
    if (!img || typeof(img) !== "string") {
        img = "../public/no_image.jpeg";
    }
    if (!dateReleased || typeof(dateReleased) !== "string") {
        dateReleased = "N/A";
    }
    
    if (!genres || typeof(genres)!=='string') {
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

    if (!developers || typeof(developers)!=='string') {
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

    if (!publishers || typeof(publishers)!=='string') {
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

    if (!platforms || typeof(platforms)!=='string') {
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

    if (!purchaseLinks || typeof(purchaseLinks)!=='string') {
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
    }
    
    try {
        game = await gameDatabase.createGame(title, img, dateReleased, genres, developers,
            publishers, ageRating, platforms, purchaseLinks); 
    }catch(e) {
        return res.render("createGameError.handlebars", {title:"Error", errormsg:e});
    }
    
    res.render("createGameSuccess.handlebars", {title:"Success"});
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });


