var express = require("express");
var router = express.Router();

router.get("/raising", function(req, res) {
    res.render("Raising/raising");
});

//Middleware to join
router.get("/raising/create-a-pitch", function(req, res) {
    res.render("Raising/raisingForm");
});

//
router.get("/raising/about-equity-crowdfunding", function(req, res) {
    res.render("Raising/about-equity");
});

router.get("/raising/about-debt-crowdfunding", function(req, res) {
    res.render("Raising/about-debt");
});

router.get("/raising/thinking-about-raising", function(req, res) {
    res.render("Raising/thinkingAboutRaising");
});

router.get("/raising/post-funding-support", function(req, res) {
    res.render("Raising/postFundingSupport");
});

/**Footer Page Routes */
router.get("/raising/knowledge-hub", function(req, res) {
    res.render("FooterPages/knowledgeHub");
});

router.get("/raising/sector-focus", function(req, res) {
    res.render("FooterPages/sectorFocus");
});

router.get("/raising/partnerships", function(req, res) {
    res.render("FooterPages/partnerships");
});

router.get("/terms-of-use", function(req, res) {
    res.render("FooterPages/termsOfUse");
});

router.get("/helpcenter", function(req, res) {
    res.render("FooterPages/helpCenter");
});

router.get("/careers", function(req, res) {
    res.render("FooterPages/careers");
});

router.get("/helpcenter/investing", function(req, res) {
    res.render("FooterPages/helpInvesting");
});

router.get("/helpcenter/raising", function(req, res) {
    res.render("FooterPages/helpRaising");
});

router.get("/helpcenter/partnership", function(req, res) {
    res.render("FooterPages/helpPartnership");
});

//

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // the next thing to run
    } else {
        req.flash("error_message", "You need to Login!");
        console.log("You are not logged in");
        res.redirect("/"); //should be redirecting to /login(but its a modal) showing modal login
    }
}

module.exports = router;