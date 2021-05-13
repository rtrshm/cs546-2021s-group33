const express = require('express');
const router = express.Router();
const usersDatabase = require("../data/users")
const bcrypt = require('bcrypt');
const errorChecker = require('../data/errorChecker')
const saltRounds = 16;

// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
// let { ObjectId } = require('mongodb')

    router.get('/', async (req,res) => { 
       return res.render("login.handlebars", {title: "Login", redirect: "/nav"});
    });

    router.get('/signup', async (req,res) => { 
        return res.render("signup.handlebars", {title: "Sign up"});
    });

    router.post('/signup', async (req,res) => {
        const {email, username, password, confirmpassword} = req.body;
        if (!email || typeof(email) !== 'string' || email.trim().length == 0) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Email not provided or is not a valid string."});
        }
        try {
            errorChecker.ValidateEmail(email);
        } catch(e) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Please enter a valid E-mail."});
        }
        if (!username || typeof(username) !== "string" || username.trim().length == 0) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Username not provided or is not a valid string."});
        }
        if (!password || typeof(password) !== "string" || password.trim().length == 0) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Password not provided or is not a valid string."});
        }
        if (!confirmpassword || typeof(confirmpassword) !== "string" || confirmpassword.trim().length == 0) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Confirm password not provided or is not a valid string."});
        }
        if (password !== confirmpassword) {
            return res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Passwords do not match."});
        }
        const realusername = username.toLowerCase();
        const hashPassword = await bcrypt.hash(password, saltRounds);
        try {
            let user = await usersDatabase.createUser("user", realusername, hashPassword, email);
        } catch (e){
            return res.render("signupError.handlebars", {title: "Sign up failed", error: e});
            return 0;
        }
        return res.render("signupSuccess.handlebars", {title: "Sign up success", user: realusername});
        //let createUser = async (perms = "user", username, hashPassword, email) => { 
    });

    
    
module.exports = router;