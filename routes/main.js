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
        res.render("login.handlebars", {title: "Login"})
    });

    router.get('/signup', async (req,res) => { 
        res.render("signup.handlebars", {title: "Sign up"})
    });

    router.post('/signup', async (req,res) => {
        const {email, username, password, confirmpassword} = req.body;
        if (!email) {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Email not provided or is not a valid string."});
        }
        try {
            errorChecker.ValidateEmail(email);
        } catch(e) {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Please enter a valid E-mail."});
            return 0;   
        }
        if (!username || typeof(username) !== "string") {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Username not provided or is not a valid string."});
            return 0;  
        }
        if (!password || typeof(password) !== "string") {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Password not provided or is not a valid string."});
            return 0;  
        }
        if (!confirmpassword || typeof(confirmpassword) !== "string") {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Confirm password not provided or is not a valid string."});
            return 0;  
        }
        if (password !== confirmpassword) {
            res.render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Passwords do not match."});
            return 0;  
        }
        const realusername = username.toLowerCase();
        const hashPassword = await bcrypt.hash(password, saltRounds);
        try {
            let user = await usersDatabase.createUser("user", realusername, hashPassword, email);
        } catch (e){
            res.render("signupError.handlebars", {title: "Sign up failed", error: e});
            return 0;
        }
        res.render("signupSuccess.handlebars", {title: "Sign up success", user: realusername});
        //let createUser = async (perms = "user", username, hashPassword, email) => { 
    });

    
    
module.exports = router;