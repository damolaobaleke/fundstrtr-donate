var mongoose = require("mongoose")

var discussionSchema = mongoose.Schema({
    //author: String,
    comment: String,
    author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        username: String
    },

    //Associate replies to comments by reference
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reply"
    }],
    datecreated: { type: Date, default: Date.now }
})

var discussion = mongoose.model("discussion", discussionSchema);
module.exports = discussion;