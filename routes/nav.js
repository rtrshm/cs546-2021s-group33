const express = require('express');
const router = express.Router();
const xss = require("xss");

router.get('/', async (req, res) => {
    user = req.session.user;
    if (!user.perms || typeof(user.perms) !== 'string' || user.perms.trim().length == 0){
        return res.status(401).render("navError.handlebars", {title: "No perms", errormsg: "User has no perms"});
    }
    if (user.perms === "user") {
        return res.render("usernav.handlebars", {title: "Navigation", username: user.username});
    }
    else if (user.perms == "admin") {
        return res.render("adminnav.handlebars", {title: "Navigation", username: user.username});
    }
    else {
        console.log("what");
    }
});
module.exports = router;