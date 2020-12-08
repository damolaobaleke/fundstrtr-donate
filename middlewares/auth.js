let User = require('../models/user')

let middleWareObj = {}

//if user not verified cant login, for LOGIN post route
middleWareObj.isNotVerified = function(req, res, next) {
    //check USER username against req.body,username
    User.findOne({ username: req.body.username }, function(err, user) {
        if (!err) {
            if (user.isVerified) {
                return next();
            } else {
                req.flash("error_message", "Your account has not yet been verified, please check you email")
                return res.redirect("/")
            }
        } else {
            console.log(err)
        }
    })
}

middleWareObj.isSignedUp = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error_message", "You need to sign up to invest!")
        res.redirect('/signup')
    }
}

middleWareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next() // the next thing to run
    } else {
        req.flash('error_message', "You need to be logged in to view that!")
        console.log("You are not logged in")
        res.redirect("/") //should be redirecting to /login(but its a modal) showing modal login
    }
}
module.exports = middleWareObj;