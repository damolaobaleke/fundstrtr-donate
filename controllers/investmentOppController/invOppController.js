var express = require('express')
const moment = require('moment')
var router = express.Router()

const uploadPhoto = require('../../utils/cloudinaryConfig')
const { uploadFile, uploadCompanyHeader, uploadTeamMember1, uploadTeamMember2, uploadTeamMember3 } = require('./uploadFileController');
const middleware = require('../../middlewares/auth');

//STRIPE
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); ////
//SENDGRID
const sgMail = require('@sendgrid/mail');
//Models
var User = require('../../models/user')
var donatees = require('../../models/investmentopportunities')


router.get("/donation-opportunities", function(req, res) {
    donatees.find({}, function(err, donateesInDb) {
        if (err) {
            console.log(err)
        } else {
            /**Days */

            // hours*minutes*seconds*milliseconds --to get in days not milliseconds
            const oneDay = 24 * 60 * 60 * 1000;
            let currentDay = new Date();
            //Live for 60 days, +2 days refund period for investors
            let dateCreated;
            let daysLeft;
            for (let i = 0; i < donateesInDb.length; i++) {
                dateCreated = new Date(moment(donateesInDb[i].created).format("YYYY-MM-DD"));

                let dateCreated62 = new Date(dateCreated); //date + 62days; 60 + 2 days adds 1 extra day instead of 2
                let daysLive = new Date(dateCreated62.setDate(dateCreated.getDate() + 63)); //days its live till
                //differenceInDays
                daysLeft = Math.round(Math.abs((daysLive - currentDay) / oneDay)); //starts counting from daycreated == currentDay
                //console.log(daysLeft)

                // check if days left is equals to zero before updating
                //Once days left gets to zero set variable to zero, stop calculating difference in days
                if (donateesInDb[i].daysLeftToInvest > 1) {
                    donateesInDb[i].daysLeftToInvest = daysLeft
                    donateesInDb[i].save()
                }
            }

            /**Days */

            res.render('InvOpp/InvestmentOpp', { data: donateesInDb })
        }
    })
})

router.post("/donation-opportunities", isLoggedIn, function(req, res) {
    donatees.create(req.body.donatee, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            //send an email to business
            var emailText = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><link rel="icon" href="../../assets/img/icons/foundation-favicon.ico" type="image/x-icon"><meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" name="viewport"></head><body style="background:#f3f3f3!important"><style class="float-center" type="text/css"></style><span class="preheader"></span><table class="body" style="background:#f3f3f3!important"><tbody><tr><td align="center" class="center" valign="top"><center data-parsed=""><table class="spacer float-center"><tbody><tr><td height="16px" style="font-size:16px;line-height:16px"></td></tr></tbody></table><table align="center" class="container header float-center" style="background:#f3f3f3;margin-top:5rem"><tbody><tr><td><table class="row"><tbody><tr><th class="small-12 large-12 columns first last"><table><tbody><tr><th><center data-parsed=""></center></th><th class="expander"></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table><table align="center" class="container card float-center" style="background:#FFF;border-radius:40px;box-shadow:0 20px 40px rgba(40,57,144,.25);height:833px"><tbody><tr><td><table class="demo" style="border-collapse:collapse;padding:5px"><tbody><tr><td style="padding:5px"><img class="fs-logo" src="https://res.cloudinary.com/https-eazifunds-com/image/upload/v1598370095/Fundstrtr/Group_1280_cicdhj.png" alt="" style="height:150px;width:150px"></td></tr></tbody></table><table class="row"><tbody><tr><th class="small-12 large-12 columns first last"><table><tbody><tr><th><h1 class="text-center" style="color:#283990;font-family:Montserrat;font-size:32px;font-style:normal;font-weight:700;height:35px;line-height:90%;margin-top:3rem">Welcome ${pitchInDb.firstname} ${pitchInDb.lastname}</h1><table class="spacer"><tbody><tr><td height="32px" style="font-size:32px;line-height:32px"></td></tr></tbody></table><div class="fs-paragraph-pos"><p class="mt-4" style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">Hello, welcome to fundstrtr</p><p style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">Congratulations on successfully completing your crowdfunding application and for registering your business with us to fuel your investment</p><p style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">We will be sure to get back to you in 3-7 working days as regards your application.</p><p style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">Remember to check back frequently and if you have any questions fell free to reply to this email and a representative will be happy to help you out.</p><p style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">Thanks for choosing fundstrtr, your true path to making your dream a reality !</p><p style="color:#283990;font-family:Montserrat;font-style:normal;font-weight:400">Regards,<br>fundstrtr team.</p></div><center data-parsed=""></center></th><th class="expander"></th></tr></tbody></table></th></tr></tbody></table><table class="spacer"><tbody><tr><td height="16px" style="font-size:16px;line-height:16px"></td></tr></tbody></table></td></tr></tbody></table></center></td></tr></tbody></table></body></html>`
            var emailHtml = emailText;

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: pitchInDb.email,
                from: 'info@eazifunds.com',
                subject: 'Fundstrtr - Confirmation of registration',
                text: emailText, //shows in email notification before opening
                html: emailHtml,
            };
            sgMail.send(msg).then(function() {
                console.log("Email sent successfully")

            }).catch(error => {
                console.log(error)
            });


            //send an email to info@eazifunds.com
            var businessInfo = `<h1>Name of Business: ${pitchInDb.registeredCompanyName}</h1>
  
              <h2>Personal Info</h2>
              <ul>
                  <li>email: ${pitchInDb.email}</li>
                  <li>First Name: ${pitchInDb.firstname}</li>
                  <li>Last Name: ${pitchInDb.lastname}</li>
                  <li>Phone Number: ${pitchInDb.phoneNumber}</li>
              </ul>
              <h2>Business & Company Info</h2>
              <ul>
                  <li>Business Type: ${pitchInDb.businessType}</li>
                  <li>Corporate Structure: ${pitchInDb.corporateStructure}</li>
                  <li>Company Number: ${pitchInDb.companyNumber}</li>
                  <li>Company Country: ${pitchInDb.companyCountry}</li>
                  <li>Other Country: None OR ${pitchInDb.otherCountry}</li>
                  <li>Date Founded: ${pitchInDb.dateFounded}</li>
                  <li>Date Incorporated: ${pitchInDb.dateIncorporated}</li>
                  <li>Raising Amount: ${pitchInDb.raisingAmount}</li>
                  <li>Raising Type: ${pitchInDb.raisingType}</li>
                  <li>Trading Name: ${pitchInDb.tradingName}</li>
                  <li>Address:${pitchInDb.addressLine1}, ${pitchInDb.addressLine2} </li>
                  <li>City: ${pitchInDb.city}</li>
                  <li>Company Website: ${pitchInDb.companyWebsite}</li>
                  <li>Executive Summary: ${pitchInDb.executiveSummary}</li>
                  <li>
                      Milestone: ${pitchInDb.milestone}
                  </li>
                  <li>Equity Offer: ${pitchInDb.equityOffer}</li>
                  <li style="color: red;">Pre-money Valuation: ${pitchInDb.premoneyValuation}</li>
                  <li>Share Price: ${pitchInDb.sharePrice}</li>
                  <li>Share Type: ${pitchInDb.shareType}</li>
              
              </ul>
              
              <h2>Social Media</h2>
              
              <ul>
                  <li>Facebook URL: ${pitchInDb.facebookUrl }</li>
                  <li>Twitter URL: ${pitchInDb.twitterUrl}</li>
                  <li>Instagram URL: ${pitchInDb.instagramUrl}</li>
                  <li>LinkedIn URL: ${pitchInDb.linkedinUrl}</li>
              </ul>
              
              <h2>Private Access Link</h2>
              <p>Business private access link: https://beta.fundstrtr.com/private-access/donation-opportunities/pitches/${pitchInDb._id}/details </p>
              
               
              <h2>Dashboard Link</h2>
              <p>dashboard link: https://beta.fundstrtr.com/donation-opportunities/pitches/${pitchInDb._id}/details/edit/company_information </p>  
              `

            const msgInfo = {
                to: 'eazifunds@gmail.com',
                from: 'info@eazifunds.com',
                subject: 'Registered Business',
                text: emailText, //shows in email notification before opening
                html: businessInfo,
            };
            sgMail.send(msgInfo).then(function() {
                console.log("Email sent successfully")

                //show a flash message
                req.flash("success_message", "You've been registered successfully, Thank you !")
                res.redirect('/donation-opportunities/pitches/' + pitchInDb._id + '/details/edit/dashboard')

            }).catch(error => {
                console.log(error)
            })

            console.log(pitchInDb)

        }
    })

    //redirect back to investment pitches OR manage pitch ? thinkaboutit
    //res.redirect('/donation-opportunities')
})

//Upload company Logo Image Route
router.post('/donation-opportunities/:pitchId/upload', isLoggedIn, uploadFile);
router.post('/donation-opportunities/:pitchId/upload-header', isLoggedIn, uploadCompanyHeader);

//Upload company Team Members Route
router.post('/donation-opportunities/pitches/:pitchId/team-member1', isLoggedIn, uploadTeamMember1);

router.post('/donation-opportunities/pitches/:pitchId/team-member2', isLoggedIn, uploadTeamMember2);
router.post('/donation-opportunities/pitches/:pitchId/team-member3', isLoggedIn, uploadTeamMember3);

/**SHOW -PRIVATE ACCESS */

router.get("/private-access/donation-opportunities/pitches/:id/details", middleware.isSignedUp, function(req, res) {
    //.populate("discussion")
    donatees.findById(req.params.id).populate({ path: 'discussion', populate: { path: 'replies', model: 'reply' } }).exec(function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {

            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            let currentDay = new Date();
            console.log(currentDay)

            //Live for 60 days, +2 days refund period for investors
            let dateCreated = new Date(moment(pitchInDb.created).format("YYYY-MM-DD")); // 
            console.log(dateCreated)

            let dateCreated62 = new Date(dateCreated); //date + 62days; 60 + 2 days adds 1 extra day instead of 2
            let daysLive = new Date(dateCreated62.setDate(dateCreated.getDate() + 63));
            console.log(daysLive);
            console.log('Day Live till: ' + daysLive)

            //differenceInDays
            let daysLeft = Math.round(Math.abs((daysLive - currentDay) / oneDay)); //starts counting from daycreated == currentDay
            console.log(`Days Left ${daysLeft}`)

            //Once days left gets to zero set variable to zero, stop calculating difference in days
            if (daysLeft === 0) {
                daysLeft = 0;
                console.log(`Days Left ${daysLeft}`)

            }

            pitchInDb.daysLeftToInvest = daysLeft;
            pitchInDb.save();

            res.render('InvOpp/InvestmentOppdetails', { data: pitchInDb, daysLeft: daysLeft })
        }
    })
})


//SHOW
router.get("/donation-opportunities/pitches/:id/details", isLoggedIn, function(req, res) {
    //.populate("discussion")
    donatees.findById(req.params.id).populate({ path: 'discussion', populate: { path: 'replies', model: 'reply' } }).exec(function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {

            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            let currentDay = new Date();
            console.log(currentDay)

            //Live for 60 days, +2 days refund period for investors
            let dateCreated = new Date(moment(pitchInDb.created).format("YYYY-MM-DD")); // 
            console.log(dateCreated)

            let dateCreated62 = new Date(dateCreated); //date + 62days; 60 + 2 days adds 1 extra day instead of 2
            let daysLive = new Date(dateCreated62.setDate(dateCreated.getDate() + 63));
            console.log(daysLive);
            console.log('Day Live till: ' + daysLive)

            //differenceInDays
            let daysLeft = Math.round(Math.abs((daysLive - currentDay) / oneDay)); //starts counting from daycreated == currentDay
            console.log(`Days Left ${daysLeft}`)

            //Once days left gets to zero set variable to zero, stop calculating difference in days
            if (daysLeft > 1) {
                daysLeft = daysLeft;
                console.log(`Days Left ${daysLeft}`)

            }

            res.render('InvOpp/InvestmentOppdetails', { data: pitchInDb, daysLeft: daysLeft })
        }
    })
})

//EDIT PITCH
//Normal form editing
router.get("/donation-opportunities/pitches/:id/details/edit", isLoggedIn, function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitch", { data: pitchInDb })
        }
    })
})


//===Using DashBoard====
router.get("/donation-opportunities/pitches/:id/details/edit/dashboard", [checkPitchOwnership, isLoggedIn], function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchDashboard", { data: pitchInDb, currentUser: req.user })
            console.log(req.user) // passport adds current user to request
        }
    })
})

//profile
router.get("/donation-opportunities/pitches/:id/details/edit/profile", isLoggedIn, function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchProfile", { data: pitchInDb })
        }
    })
})

//business info
router.get("/donation-opportunities/pitches/:id/details/edit/business_information", isLoggedIn, function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchBusinessInfo", { data: pitchInDb })
        }
    })
})

router.get("/donation-opportunities/pitches/:id/details/edit/company_information", isLoggedIn, function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchCompanyInfo", { data: pitchInDb })
        }
    })
})

//comments in business--Working on it 
router.get("/donation-opportunities/pitches/:id/details/comments/", function(req, res) {
    donatees.findById(req.params.id).populate({ path: 'discussion', populate: { path: 'replies', model: 'reply' } }).exec(function(err, pitchesinDB) {
        if (err) {
            console.log(err)
        } else {
            console.log("Pitch" + pitchesinDB.discussion)
            res.render("ManagePitch/pitchComments", { data: pitchesinDB })
        }
    })
})

//company docs
router.get("/donation-opportunities/pitches/:id/details/edit/company_documents", function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchDocuments", { data: pitchInDb })
        }
    })
})

//reports & Investments
router.get("/donation-opportunities/pitches/:id/details/edit/reports", function(req, res) {
    donatees.findById(req.params.id).populate({ path: "investor", populate: { path: 'pitchesInvestedIn', model: 'investmentOpportunity' } }).exec(function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/editPitchReports", { data: pitchInDb })
        }
    })
})

//settings
router.get("/donation-opportunities/pitches/:id/details/settings", function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            res.render("ManagePitch/pitchSettings", { data: pitchInDb })
        }
    })
})

//EDIT PITCH

//UPDATE PITCH
router.put("/donation-opportunities/pitches/:id/", isLoggedIn, function(req, res) {
    donatees.findByIdAndUpdate(req.params.id, req.body.pitch, function(err, UpdatedPitchInDb) {
        if (err) {
            console.log(err)
            res.redirect("/donation-opportunities")
        } else {
            console.log(UpdatedPitchInDb)
            res.redirect("/donation-opportunities/pitches/" + req.params.id + "/details") //GET pitch details
        }

    })
})

//REMOVE PITCH--DANGER!
router.delete("/donation-opportunities/pitches/:id/", isLoggedIn, function(req, res) {
    donatees.findByIdAndRemove(req.params.id, function(err, pitchInDb) {
        if (!err) {
            res.redirect("/donation-opportunities")
            console.log("deleted pitch" + "\n" + pitchInDb)
        } else {
            console.log(err)
            res.redirect("/donation-opportunities")
        }

    })
})

//PAYMENT/Investing ROUTES
router.get("/donation-opportunities/pitches/:id/invest", isLoggedIn, function(req, res) {
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            console.log("User info \n" + req.user)
            res.render('Investing/investInPitch', { data: pitchInDb })
        }
    })
})

//PAY ROUTE

//Included in the returned PaymentIntent is a client secret, which is used on the client side to 
//securely complete the payment process instead of passing the entire PaymentIntent object

router.post('/donation-opportunities/pitches/:id/invest/:user_id/pay', async(req, res) => {
    donatees.findById(req.params.id, async function(err, pitchInDb) {
        if (!err) {

            console.log(req.body)
            const { paymentMethodId, items, currency, chargeAmount } = req.body; //object destructured

            //amount received stored in database, without *100 for stripe
            const amountInDb = chargeAmount

            const amount = chargeAmount * 100; //value charged is amount *100, e.g 10$ -> (10* 100) = 1000

            //Havent added Transaction fees(Stripe + investment fee)
            const stripeFees = 2.9 / 100 + (0.30); //2.9% + 0.30C
            let investmentFees = 1.5 / 100 * amount

            if (amountInDb >= 13400) {
                //investment fee capped at 201$
                investmentFees = 201;
            }

            let amountWithFee = amount + parseInt(stripeFees + investmentFees)

            try {
                // Create new PaymentIntent with a PaymentMethod ID from the client.
                const intent = await stripe.paymentIntents.create({
                    //amountWithFee,
                    amount: amountWithFee,
                    currency,
                    customer: req.user.stripeCustomerId,
                    payment_method: paymentMethodId,
                    error_on_requires_action: true,
                    setup_future_usage: 'off_session',
                    //off_session: true,
                    confirm: true,
                    capture_method: 'manual', //capture the amount-- dont debit immediately
                });

                //capture authorized funds
                const captureIntent = await stripe.paymentIntents.capture(intent.id, {
                    //description: `${pitchInDb.tradingName} Investment`,
                })
                console.log(`The captured intent: ${captureIntent}`)

                // Confirm the PaymentIntent to place a hold on the card-- with condition
                //let captureIntent = await stripe.paymentIntents.confirm(intent.id);

                // if (captureIntent.status === "requires_capture") {
                //     console.log("❗ Charging the card for: " + captureIntent.amount_capturable);
                //     captureIntent = await stripe.paymentIntents.capture(intent.id);
                // }


                console.log("💰 Payment received!");

                //amounts received by pitch, successful investment
                pitchInDb.amountReceived.push(amountInDb);

                let amountRaised = 0;
                for (i = 0; i < pitchInDb.amountReceived.length; i++) {
                    amountRaised += parseInt(pitchInDb.amountReceived[i])
                    pitchInDb.amountRaised = amountRaised;

                }

                //save pitchInDb with amount raised
                pitchInDb.save(function(err, pitchInDb) {
                    if (!err) {
                        console.log(`pitch: amount recieved::${pitchInDb.amountReceived} amount raised::${pitchInDb.amountRaised}`)

                        //Add pitch invested in to user(for portfolio)
                        User.findById(req.params.user_id, function(err, userInDb) {
                            if (!err) {
                                userInDb.pitchesInvestedIn.addToSet(pitchInDb);
                                /*Net worth - sharesReceived Value*/

                                //const sharesReceived = chargeAmount / pitchInDb.sharePrice
                                //userInDb.investments.push(chargeAmount) //old MODEL

                                let invObj = {
                                    amount: [chargeAmount],
                                    tradingName: pitchInDb.tradingName,
                                    datesOfInvestments: [new Date()]
                                }

                                //if trading name exists in array of investments
                                let tradingObjS = userInDb.investments.find((inv) => {
                                    return inv.tradingName == pitchInDb.tradingName
                                })

                                if (tradingObjS != null) {
                                    //add amount to amount array field and date to datefield
                                    //in unique object
                                    tradingObjS.amount.push(chargeAmount);
                                    tradingObjS.datesOfInvestments.push(new Date())
                                } else {
                                    //if not push  or create new investment object in investment
                                    userInDb.investments.addToSet(invObj);
                                }
                                //userInDb.investments.addToSet(invObj);


                                let netWorth = 0;
                                userInDb.investments.forEach((investment) => {
                                    investment.amount.forEach((amount) => {

                                        netWorth += parseInt(amount)
                                        userInDb.netWorth = netWorth;
                                    })
                                })


                                userInDb.save(function(err, user) {
                                    if (!err) {
                                        //Add investor to pitch -- addToSet prevent duplicate value e.g so duplicate user object
                                        pitchInDb.investor.addToSet(user);
                                        console.log(user)

                                        //After adding investor to pitch
                                        pitchInDb.save()
                                    }
                                });

                            } else {
                                console.log(err.message)
                            }
                        })

                        console.log(`Updated pitch: amount received:: ${pitchInDb.amountReceived}  amount raised:: ${pitchInDb.amountRaised}`)
                    } else {
                        console.log(err)
                    }
                });

                req.user.isInvested = true;
                await req.user.save();

                // The payment is complete and the money has been moved

                // Send the client secret generated from intent to confirm payment on client side.
                res.send({ clientSecret: intent.client_secret });

            } catch (e) {
                // See https://stripe.com/docs/declines/codes
                if (e.code === "authentication_required") {
                    // Bring the customer back on-session to authenticate the purchase
                    // send an email or app notification
                    const msgInfo = {
                        to: req.user.email,
                        from: 'info@eazifunds.com',
                        subject: 'Transaction Failed',
                        text: "Your card is being charged",
                        html: '<p>Your card is about to be charged, please authenticate this</p>',
                    };
                    sgMail.send(msgInfo)

                    res.send({
                        error: "This card requires authentication in order to proceed. Please use a different card.",
                        paymentMethod: e.raw.payment_method.id,
                        clientSecret: e.raw.payment_intent.client_secret,
                        amount: amountWithFee,
                        card: {
                            brand: e.raw.payment_method.card.brand,
                            last4: e.raw.payment_method.card.last4
                        }

                    });
                } else if (e.code) {
                    // The card was declined for other reasons (e.g. insufficient funds)
                    // Bring the customer back on-session to ask for a new payment method
                    res.send({
                        error: e.code,
                        clientSecret: e.raw.payment_intent.client_secret,
                    });
                } else {
                    console.log(e.message)
                    res.send({ error: e.message });
                }
            }
        } else {
            console.log(err)
        }
    })
});
//PAYMENT ROUTES

//Due diligence charter
router.get("/due-diligence-charter", function(req, res) {
    res.render("InvOpp/dueDiligenceCharter")

})


//Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next() // the next thing to run
    } else {
        req.flash('error_message', "You need to be logged in to view that!")
        console.log("You are not logged in")
        res.redirect("/") //should be redirecting to /login(but its a modal) showing modal login
    }
}

function checkPitchOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        donatees.findById(req.params.id, function(err, pitchInDb) {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                //does user own pitch ?
                console.log(pitchInDb.email + " compared to " + req.user.email)
                if (pitchInDb.email === req.user.email) {
                    next() //dashboard
                } else {
                    req.flash("error_message", "You dont have access to the dashboard.\n The email logged in is not the email used to create the pitch")
                    res.redirect("back")
                }
            }
        })
    } else {

    }
}

module.exports = router