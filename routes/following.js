const express = require('express');
const reviewFun = require('../data/reviews');
const userFun = require('../data/users');
const router = express.Router();

router.get("/", async (req, res) => {
    user = req.session.user;
    let reviews;
    try{
        reviews = await reviewFun.getRecentReviews(user.username);
    }catch(e) {
        console.log(e);
    }
    res.render("usersFollowing.handlebars", {title: "Reviews", reviews: reviews});
});

router.post("/isFollowing", async (req, res) => {
    let {followedUser} = req.body;
    let followerUser = req.session.user.username;
    let following = false;
    try{
        following = await userFun.isFollowing(followerUser,followedUser);
    }catch(e) {
        return res.json({bool:false});
    }
    return res.json({bool:following});
});

router.post("/follow", async (req, res) => {
    let {followedUser} = req.body;
    let followerUser = req.session.user.username;
    let user;
    let bool = false;
    try{
        user = await userFun.followUserByName(followerUser,followedUser);
    }catch(e) {
        console.log(e);
        return res.json({bool:false});
    }
    if (user) {
        bool = true;
    }
    return res.json({bool:bool});
});

router.post("/unfollow", async (req, res) => {
    let {followedUser} = req.body;
    let followerUser = req.session.user.username;
    let user;
    let bool = false;
    try{
        user = await userFun.unfollowUserByName(followerUser,followedUser);
    }catch(e) {
        console.log(e);
        return res.json({bool:false});
    }
    if (user) {
        bool = true;
    }
    return res.json({bool:bool});
});

module.exports = router;