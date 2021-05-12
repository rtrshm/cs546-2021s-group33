const express = require('express');
const router = express.Router();
// const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
// const booksData = mongoCollections.books;
// let { ObjectId } = require('mongodb')

    router.get('/', async (req, res) => {
        
        let obj = {
            perms: "member",
            username: "lempie",
            dateJoined: "5/2/2021",
            usersFollowing: "ecks",
            email: "lempierox@gmail.com",
            favoriteGames: ["Super Smash Brothers Melee", "Pokemon Showdown"],
            reviewsLeft: ["Showdown is awesome! Just kidding it sucks I just got lucked!!! Crit ceit crit crit"]
        };
        res.render("profile.handlebars", {title: "Profile", object: obj})
        
    });

    

    
module.exports = router;