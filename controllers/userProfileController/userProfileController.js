const express = require('express');
const mongoose = require('mongoose')
const moment = require('moment') //format date library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

mongoose.set('useFindAndModify', false);

const uploadPhoto = require('../../utils/cloudinaryConfig'); //upload cloudinary config

let router = express.Router()

//Model
var User = require('../../models/user');
const donatees = require('../../models/investmentopportunities')

//middleware
const { isLoggedIn } = require('../../middlewares/auth');

//After sign up redirect to complete profile
//GET profile
router.get('/my-profile/:id/', isLoggedIn, function(req, res) {
    User.findById(req.params.id, async function(err, userInDb) {
        if (err) {
            req.flash("error_message", "No user Found")
        } else {

            //Where pitch email == users email in db
            const pitch = await donatees.findOne({ email: userInDb.email })
            if (pitch) {
                console.log(`The ${pitch._id}`)

                //HTML date type input doesnt support ISO format
                const formatDate = moment(userInDb.dateOfBirth).format("YYYY-MM-DD");
                res.render('UserProfile/userProfile', { data: userInDb, dateofbirth: formatDate, pitchId: pitch._id })
            } else {
                const formatDate = moment(userInDb.dateOfBirth).format("YYYY-MM-DD");
                res.render('UserProfile/userProfile', { data: userInDb, dateofbirth: formatDate, pitchId: "" })
            }
        }
    })
})

//Update profile
router.put('/my-profile/complete-form/:id', isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, async(err, updatedUserInDb) => { //req.body.user-- user object already logged in req
        if (err) {
            console.log(err)
        } else {
            //console.log(req.body)
            console.log("Updated user" + updatedUserInDb)

            //retrieve
            const retrieveCustomer = await stripe.customers.retrieve(updatedUserInDb.stripeCustomerId);
            console.log(`Retrieved cus:\n ${retrieveCustomer}`)

            //update customer on stripe
            const customer = await stripe.customers.update(updatedUserInDb.stripeCustomerId, {
                metadata: {
                    email: updatedUserInDb.email,
                    address: updatedUserInDb.addressLine1,
                    name: updatedUserInDb.firstname + " " + updatedUserInDb.lastname,
                    phone: updatedUserInDb.phoneNumber,
                    description: `${updatedUserInDb.email} Updated`,
                }
            });

            console.log(customer)


            req.flash("success_message", "Profile Updated Successfully")
            res.redirect("/my-profile/" + req.params.id);
        }
    })
})

//Upload profile Photo
router.post('/my-profile/:id/upload', isLoggedIn, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const photo = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 20000); //max size 20000kb == 20Mb
        user.profileImage = photo;
        await user.save();
        //Return success
        return res.status(200).json({
            status: "success"
        })

        //res.redirect(`/my-profile/${req.user.id}`)

    } catch (err) {
        console.log(err)
    }
});

//GET Portfolio
router.get("/my-profile/:id/portfolio", isLoggedIn, function(req, res) {
    //path == key in model of what is to be populated
    User.findById(req.params.id).populate({ path: 'pitchesInvestedIn', populate: { path: 'investor', model: 'User' } }).exec(function(err, userInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("UserProfile/userPorfolio", { data: userInDb });
        }
    })
})

module.exports = router;