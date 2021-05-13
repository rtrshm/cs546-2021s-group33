const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    res.render("quiz.handlebars", {title: "Quiz"});
});

module.exports = router;