var express = require('express')
var router = express.Router()


//Models
var donatees = require('../../models/investmentopportunities');
var discussion = require('../../models/discussion');
var reply = require('../../models/reply');
var User = require('../../models/user');

//COMMENTS Routes  --Nested
router.get("/donation-opportunities/pitches/:id/details/comments/new", function(req, res) {
    donatees.findById(req.params.id, function(err, pitchesinDB) {
        if (err) {
            console.log(err)
        } else {
            res.render("Comments/newComments", { data: pitchesinDB })
        }
    })
})

//Display all comments on separate page as well
router.get("/donation-opportunities/pitches/:id/details/comments", function(req, res) {
    donatees.findById(req.params.id).populate({ path: 'discussion', populate: { path: 'replies', model: 'reply' } }).exec(function(err, pitchesinDB) {
        if (err) {
            console.log(err)
        } else {
            console.log("Pitch" + pitchesinDB.discussion)
            res.render("Comments/commentsPage", { data: pitchesinDB })
        }
    })
})

//Create comment
router.post("/donation-opportunities/pitches/:id/details/comments/", function(req, res) {
    var discussionbody = { author: req.body.author, comment: req.body.comment }
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            //console.log("pitch in db\n" + pitchInDb)
            discussion.create(discussionbody, function(err, discussionInDb) {
                if (!err) {
                    //add username and id to comment 
                    discussionInDb.author.id = req.user._id
                    discussionInDb.author.username = req.user.username

                    //then save comment
                    discussionInDb.save();
                    console.log(discussionInDb)

                    //add comments to pitch
                    pitchInDb.discussion.push(discussionInDb)

                    //save pitch with comments --commentsInDb == discussionInDb
                    pitchInDb.save(function(err, commentsInDb) {
                        if (err) {
                            console.log("Error creating comment" + err)
                        } else {
                            //console.log(commentsInDb)
                            res.redirect("/donation-opportunities/pitches/" + pitchInDb._id + "/details/");
                        }
                    })
                } else {
                    //show error message
                    console.log("error creating" + err);
                }

            })
        }
    })

})

//Edit Comments
router.get("/donation-opportunities/pitches/:id/details/comments/:comment_id/edit", checkCommentOwnership, function(req, res) {
    //note, if nested route comments is defined with ":id" would override first id, so give distinct name
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            discussion.findById(req.params.comment_id, function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("discussion data \n" + comment)

                    //edit Modal
                    res.render("Comments/editComment", { data: pitchInDb, discussiondata: comment })
                }
            })
        }
    })
})

//Update Comments
router.put("/donation-opportunities/pitches/:id/details/comments/:comment_id/", function(req, res) {
    discussion.findByIdAndUpdate(req.params.comment_id, req.body.pitch, function(err, updatedCommentsIndb) {
        if (err) {
            console.log(err)
            req.flash("error_message", err.message)
        } else {
            console.log(req.body)
            console.log("Updated comment" + updatedCommentsIndb)

            res.redirect("/donation-opportunities/pitches/" + req.params.id + "/details")
        }
    })
})


//Delete Comment -Update
router.delete("/donation-opportunities/pitches/:id/details/comments/:comment_id/", checkCommentOwnership, (req, res) => {
    discussion.findByIdAndRemove(req.params.comment_id, function(err, comments) {
        if (!err) {
            console.log("deleted comment" + "\n" + comments)
            res.redirect("/donation-opportunities/pitches/" + req.params.id + "/details")
        } else {
            req.flash("error_message", err.message)
            console.log(err)
        }
    })
})


//REPLIES

router.post("/donation-opportunities/pitches/:id/details/comments/:comment_id/replies", isLoggedIn, function(req, res) {
    var replybody = { author: req.body.author, reply: req.body.reply }
    donatees.findById(req.params.id, function(err, pitchInDb) {
        if (err) {
            console.log(err)
        } else {
            //console.log("pitch in db\n" + pitchInDb)
            reply.create(replybody, function(err, replyInDb) {
                if (!err) {
                    //add username and id to the reply 
                    replyInDb.author.id = req.user._id
                    replyInDb.author.username = req.user.username

                    //then save reply
                    replyInDb.save();
                    console.log(replyInDb)


                    //Add replies to comments inside the pitch
                    discussion.findById(req.params.comment_id, function(err, commentInDb) {
                        if (!err) {
                            console.log(`Before reply added\n: ${commentInDb}`)

                            //Add replies to comments
                            commentInDb.replies.push(replyInDb);

                            //save comments in db with replies
                            commentInDb.save(function(err, updatedWithReply) {
                                if (!err) {
                                    //Updated comment with reply
                                    console.log(`After reply added\n: ${updatedWithReply}`)
                                }
                            })

                            //Add comments with replies to pitch

                            pitchInDb.discussion.push(commentInDb)

                            //save pitch

                            //save pitch with replies in comments after adding replies --replyInDb
                            pitchInDb.save(function(err, pitchInDb) {
                                if (err) {
                                    console.log("Error creating reply to comment" + err)
                                } else {
                                    console.log(pitchInDb)
                                    res.redirect("/donation-opportunities/pitches/" + pitchInDb._id + "/details/");
                                }
                            });

                        } else {
                            console.log(err);
                        }

                    });

                } else {
                    //show error message
                    console.log("error creating" + err);
                }

            })
        }
    })
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next() // the next thing to run
    } else {
        req.flash('error_message', "You need to Login!")
        console.log("You are not logged in")
        res.redirect("/") //should be redirecting to /login(but its a modal) showing modal login
    }
}

//
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        discussion.findById(req.params.comment_id, function(err, commentInDb) {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                //does user own comment
                if (commentInDb.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect("back")
                }
            }
        })
    } else {

    }
}

module.exports = router