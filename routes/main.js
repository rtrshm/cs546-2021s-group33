const express = require('express');
const router = express.Router();
const usersDatabase = require("../data/users")
const bcrypt = require('bcrypt');
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
        const {email, username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        try {
            let user = await usersDatabase.createUser("user", username, hashPassword, email);
            
        } catch (e){
            res.render("signupError.handlebars", {title: "Sign up failed", error: e});
            return 0;
        }
        res.render("signupSuccess.handlebars", {title: "Sign up success", user: username});
        //let createUser = async (perms = "user", username, hashPassword, email) => {
        
        
    });

    
    
module.exports = router;