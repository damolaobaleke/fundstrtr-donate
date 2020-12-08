var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const investmentsSchema = mongoose.Schema({
    amount: [{ type: Number }],
    tradingName: String
});

var userSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: String,
    firstname: String,
    lastname: String,
    gender: [{ type: String }],
    addressLine1: String,
    addressLine2: String,
    city: String,
    postcode: String,
    country: [{ type: String }],
    phoneNumber: String,
    profileImage: String,
    dateOfBirth: Date,
    /*auth*/
    linkedinId: String,
    facebookId: String,
    googleId: String,
    stripeCustomerId: String,
    //Association by reference to pitches
    pitchesInvestedIn: [{
        type: mongoose.Types.ObjectId,
        ref: "investmentOpportunity",
    }],
    netWorth: Number,
    //investments: [Number],
    investments: [{
        amount: [{ type: Number }],
        tradingName: String,
        datesOfInvestments: [{ type: Date }]
    }],
    emailMarketing: { type: Boolean, default: false },
    isInvested: { type: Boolean, default: false },
    dateJoined: { type: Date, default: Date.now },
    emailToken: String,
    isVerified: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

//Adds methods which comes with the passportLocalMongoose package to the userSchema e.g Register()
//use email field for auth
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

var User = mongoose.model("User", userSchema)
module.exports = User