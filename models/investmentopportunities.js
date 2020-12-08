var mongoose = require('mongoose')

var Donatees = mongoose.Schema({
    email: { type: String, default: "femi@gmail.com" },
    firstname: String,
    lastname: String,
    phoneNumber: Number,
    raisingTarget: { type: Number, default: 40000 },
    projectName: String,
    projectHost: String,
    hostNumber: Number,
    hostEmail: String,
    companyWebsite: { type: String, default: 'https://www.eazifunds.com' },
    facebookUrl: { type: String, default: 'https://web.facebook.com/Eazi-Funds-Inc-511497816039463/' },
    twitterUrl: { type: String, default: 'https://twitter.com/eazifundsinc_' },
    instagramUrl: { type: String, default: 'https://www.instagram.com/eazifundsinc/' },
    linkedinUrl: { type: String, default: 'https://www.linkedin.com/company/eazifunds' },
    companyLogo: String,
    companyHeader: String,
    idea: String,
    //Team
    teamMember1: {
        name: String,
        position: String,
        details: String,
        picture: { type: String, default: "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1601316915/d5_1_djdqfr.png" }
    },
    teamMember2: {
        name: String,
        position: String,
        details: String,
        picture: { type: String, default: "https://images.crowdcube.com/unsafe/570x0/filters:format(jpeg):max_bytes(50000)/https://files-crowdcube-com.s3.amazonaws.com/files/opportunity_section_media/original/202003/estherbandw_a7f98e116977f52feb0b4aae6171d91b.jpg" }
    },
    teamMember3: {
        name: String,
        position: String,
        details: String,
        picture: String
    },
    teamMember4: {
        name: String,
        position: String,
        details: String,
        picture: String
    },
    teamMember5: {
        name: String,
        position: String,
        details: String,
        picture: String
    },
    //Associating Comments with pitch
    discussion: [{
        type: mongoose.Schema.Types.ObjectId, //object id
        ref: "discussion" //the model name
    }],

    //Amount recieved-- storing in an array
    amountReceived: [{ type: Number }],
    noOfDonators: Number,
    amountRaised: { type: Number },

    //Associate user with donatee
    investor: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    daysLeftToInvest: { type: Number },
    dateUserInvested: [{ type: Date }],
    created: { type: Date, default: Date.now }

})

var donatees = mongoose.model('donatee', Donatees)
module.exports = donatees;


//FIXED TEAM(use in update)--TO STORE ALL MEMBER OBJECTS IN AN ARRAY, WHILE STORING ALL ATTRIBUTES IN AN ARRAY
// Team: [{
//     member1:[{
//         name: { type: String },
//         position: { type: String },
//         details: { type: String },
//     }],
//     member2:[{
//         name: { type: String },
//         position: { type: String },
//         details: { type: String },
//     }],
//     member2:[{
//         name: { type: String },
//         position: { type: String },
//         details: { type: String },
//     }], 
// }],