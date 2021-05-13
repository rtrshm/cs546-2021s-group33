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


