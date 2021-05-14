const express = require('express');
const reviewFun = require('../data/reviews');
const router = express.Router();

router.get("/", async (req, res) => {
    user = req.session.user;
    let reviews;
    try{
        reviews = await reviewFun.getRecentReviews(user.username);
    }catch(e) {
        console.log(e);
    }
    console.log(reviews);
    res.render("usersFollowing.handlebars", {title: "Reviews", reviews: reviews});
});

module.exports = router;