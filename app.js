/** ==========================================
; Title:  fundstrtr donate
; Description: Donation Platform
; Author: Oyindamola Obaleke
; Date:   7 Dec 2020
;=======================================*/

require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser'),
    mongoose = require('mongoose')
passport = require('passport'),
    LocalStrategy = require('passport-local')
passportLocalMongoose = require('passport-local-mongoose'),
    fileSystem = require('fs'),
    methodOverride = require('method-override'),
    flash = require('connect-flash')

const fileupload = require('express-fileupload');

//Production -ScaleGrid
var certificateFileBuf = fileSystem.readFileSync("sslCA");
var options = {
    sslCA: certificateFileBuf
}

// mongoose.connect(process.env.MongoDbScaleGrid, options)
//     .then(() => {
//         console.log("Connected to MongoDbAtlas")
//     }).catch(function(err) {
//         console.log("Error" + err)
//     })


//Production-Atlas
// mongoose.connect(process.env.MongoDBAtlas, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("Connected to MongoDbAtlas")
// }).catch(function(err) {
//     console.log("Error" + err)
// })

//Development
mongoose.connect('mongodb://localhost/fundstrtr_donate_app', { useNewUrlParser: true, useUnifiedTopology: true });

var app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method")) //whenever app gets a request having _method use that new request to override 
app.set("view engine", "ejs");

//MODELS
var donatees = require('./models/investmentopportunities')
var discussion = require('./models/discussion')
var User = require('./models/user')

//ROUTES DECLARATION
var homeRoute = require('./controllers/homeController/homeController')
var investmentOppRoutes = require('./controllers/investmentOppController/invOppController')
let raisingRoutes = require('./controllers/raisingController/raisingController')
let commentsRoutes = require('./controllers/commentsController/commentsController')
let authenticationRoutes = require('./controllers/authController/authenticationController')
let userProfileRoute = require('./controllers/userProfileController/userProfileController')

//FLASH MESSAGE 
app.use(flash());

//PASSPORT CONFIG
app.use(require('express-session')({ //requiring the package and passing in some options
    secret: "ezffst", //used to encode and decode the sessions 
    resave: false,
    saveUninitialized: false
}))

app.use(fileupload({ useTempFiles: true }));
//set passport up for use
app.use(passport.initialize())
app.use(passport.session())

//--Responsible for reading the session & taking the data thats encoded in session and unencoding it

// encoding the data and put back in session
passport.serializeUser(User.serializeUser());
//unencoding the data
passport.deserializeUser(User.deserializeUser())
    //passport.use(new LocalStrategy(User.authenticate())) //uses default passport config, username & password
passport.use(User.createStrategy())
    //Middleware- passing currentUser and Flash messages to every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    res.locals.successMessage = req.flash('success_message');
    res.locals.errorMessage = req.flash('error_message');
    next();
})



//ROUTES
app.use(homeRoute)
app.use(authenticationRoutes)
app.use(userProfileRoute)
app.use(investmentOppRoutes)
app.use(raisingRoutes)
app.use(commentsRoutes)



//HANDLE 404 REQUEST
app.use(function(req, res) {
    //render error page
    res.status(404).render('ErrorPage/404');
});




//Production -only runs on port 3000 on servers-  .process.env.PORT, process.env.IP,
// app.listen(3000, function() {
//     console.log("Fundstrtr listening on port 3000")
// })

//Development
app.listen("3002", function() {
    console.log("donate listening on port 3002")
})