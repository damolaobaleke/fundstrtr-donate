var express = require('express');
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var router = express.Router()

const middleware = require('../../middlewares/auth')


//Models
var User = require('../../models/user');
const passport = require('passport');


//AUTHENTICATION ROUTES

//SignUp
router.get("/signup", function(req, res) {
    res.render("Authentication/signUp")
})

router.post("/signup", function(req, res) {
    var Users = new User({ email: req.body.email, username: req.body.username });

    User.register(Users, req.body.password, async function(err, user) {
        if (err) {
            console.log(err)
            let error = err.message
            let errorArray = error.split(" ");
            let range = errorArray.slice(0, 5);
            let endRange = errorArray.slice(6, 9);
            range = range.join(' ')
            endRange = endRange.join(' ')
            req.flash("error_message", "Error: " + range + " email " + endRange);

            return res.redirect("/signup")
        } else {

            if (req.body.password === req.body.confirmPassword) {

                //create stripe customer
                const customer = await stripe.customers.create({
                    email: user.email,
                    description: `Customer: ${user.username} created`,
                });

                if (customer) {
                    user.stripeCustomerId = customer.id;
                    console.log(customer)
                    user.save()
                    console.log(user.stripeCustomerId)
                }

                await req.logIn(user, function(err) {
                    if (err) {
                        console.log(err);
                        req.flash("error_message", err.message)
                    } else {
                        console.log(user)

                        var emailText = ` <div class="bg-notify">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-12">
                                        <p>Hello, welcome to fundstrtr
                                        ${user.username} ,your to go crowdfunding application where you can invest in businesses at any stage.</p>
                
                                    </div>
                                </div>
                            </div>
                        </div>`
                        var emailHtml = `<h1>Welcome ${user.username}</h1> <br> ` + emailText

                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        const msg = {
                            to: user.email,
                            from: 'info@eazifunds.com',
                            subject: 'Welcome to Fundstrtr',
                            text: emailText, //shows in email notification before opening
                            html: emailHtml,
                        };
                        sgMail.send(msg)
                            .then(function() {
                                req.flash("success_message", "You should receive an email notification")
                            }).catch(error => {
                                console.log(error)
                            })


                        res.redirect('/donation-opportunities')
                    }
                })


            } else {
                user = null
                req.flash("error_message", "Your passwords dont match")
                res.redirect('/signup')
            }
        }
    })
})


//Verification route to profile-- 
router.get("/verify-email", async(req, res) => {
    try {
        //find user with email token from query string, UserInDb emailToken against req.query.token
        const user = await User.findOne({ emailToken: req.query.token });
        if (!user) {
            req.flash("error_message", "Token is invalid, contact for assistance or\nuser is already verified")
            return res.redirect('/')
        }
        //set emailToken empty and user to verified, once user found in db and email *token* in query string == emailToken in db
        user.emailToken = null;
        user.isVerified = true;

        //add stripe customer here instead ??? hmmm
        await user.save()

        //login

    } catch (error) {
        console.log(error)
    }

})


//LogIn , dont forget to add middlware isNotVerified
router.post("/login", passport.authenticate('local', { successRedirect: "/donation-opportunities", failureRedirect: "/signup" }), function(req, res) {

})

//LogOut
router.get("/logout", function(req, res) {
    req.logOut() //destroying user data in the session from request
    req.flash("success_message", "Logged Out !")
    res.redirect("/")
})

// forgot password
router.get("/forgot-password", (req, res) => {
    res.render("Authentication/forgotPassword")
})

router.post("/forgot-password", (req, res) => {

})

//sign up with google
router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/donation-opportunities',
    failureRedirect: '/signup'
}));

//sign up with facebook
router.get('/auth/facebook', passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['email'],
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/donation-opportunities',
    failureRedirect: '/signup'
}))

//sign up with LinkedIn
router.get('/auth/linkedin', passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile']
}));

//call back to site
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/donation-opportunities',
    failureRedirect: '/signup'
}));

//AUTHENTICATION ROUTES




module.exports = router