const express = require('express')
const app = express()
const session = require('express-session')
const configRoutes = require('./routes')
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const userDatabase = require('./data/users');
// require('./tasks/seed');
const bcrypt = require('bcrypt');
const xss = require("xss");

require("./tasks/seed");

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
    if (req.originalUrl != '/' && req.originalUrl != '/login' && req.originalUrl != '/signup' && req.originalUrl != '/verifylogin' && !req.session.user) {
        //console.log(req.originalUrl);
        return res.status(401).render("login.handlebars", {title: "Error", errormsg: "Error: Not logged in", redirect: req.originalUrl});
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
    let { redirect } = req.body;
    redirect=xss(redirect);
    return res.redirect(redirect);
});

app.post("/verifylogin", async (req, res) => {
    let { username, password} = req.body;
    username=xss(username);
    password=xss(password);

    if (!username || typeof(username) !== "string" || username.trim().length == 0) {
        return res.status(400).json({bool : false});
    }
    if (!password || typeof(password) !== "string" || password.trim().length == 0) {
        return res.status(400).json({bool : false});
    }
    username = username.toLowerCase();
    let user;
    try {
        user = await userDatabase.findByUsername(username);
    } catch(e){
        return res.status(500).json({bool : false});
    }

    if (!user.password){
        return res.status(500).json({bool : false});
    }

    if (bcrypt.compareSync(password,user.password)) {
        req.session.user = user;
        return res.json({bool : true});
    }
    else {
        return res.status(400).json({bool : false});
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
