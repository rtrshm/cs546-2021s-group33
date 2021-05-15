const express = require('express');
const router = express.Router();
const xss = require("xss");

router.get("/", async (req, res) => {
    res.render("quiz.handlebars", {title: "Quiz"});
});

module.exports = router;