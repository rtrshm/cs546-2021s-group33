const express = require('express');
const router = express.Router();
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

    
    
module.exports = router;