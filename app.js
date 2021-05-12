const express = require('express')
const app = express()
const session = require('express-session')
const configRoutes = require('./routes')
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const userDatabase = require('./data/users');
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

app.post("/login", async (req, res) => {
    let { username, password } = req.body;
    if (!username || typeof(username) !== "string") {
        res.render("signin.handlebars", {title: "Sign in failed", errormsg: "No username provided or username is not valid string."});
    }
    if (!password || typeof(password) !== "string") {
        res.render("signin.handlebars", {title: "Sign in failed", errormsg: "No password provided or password is not valid string."});
    }
    username = username.toLowerCase();
    let user;
    try {
        user = await userDatabase.findByUsername(username);
    } catch(e){
        res.render("signin.handlebars", {title: "Sign in failed", errormsg: "Incorrect username or password."});
        return 0;
    }

    if (bcrypt.compareSync(password,user.password)) {
        req.session.user = user;
        // let profile = {
        //     perms: user.perms,
        //     username: user.username,
        //     dateJoined: user.dateJoined,
        //     password: user.password,
        //     usersFollowing: user.usersFollowing,
        //     email: user.email,
        //     favoriteGames: user.favoriteGames,
        //     reviewsLeft: user.reviewsLeft
        // };
        // if (user.usersFollowing.length === 0) {
        //     profile.usersFollowing = "This user is not following anyone.";
        // }
        // if (user.favoriteGames.length === 0) {
        //     profile.favoriteGames = "This user has no favorite games.";
        // }
        // if (user.reviewsLeft.length === 0) {
        //     profile.reviewsLeft = "This user has not left any reviews.";
        // }
        // res.render("profile.handlebars", {title: "User profile", object: profile});
        if (user.perms === "user") {
            return res.render("usernav.handlebars", {title: "Navigation", username: user.username});
        }
        else if (user.perms == "admin") {
            return res.render("adminnav.handlebars", {title: "Navigation", username: user.username});
        }
        else {
            console.log("what");
        }
    }
    else {
        res.render("signin.handlebars", {title: "Sign in failed", errormsg: "Invalid username or password."});
    }

    if (!req.session.user) {
        res.status(401);
        res.render("posts/login", {title: "Error", errormsg: "Error: Did not provide a valid username and/or password."});
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });


