var mongoose = require("mongoose")
var replySchema = mongoose.Schema({
    //author: String,
    reply: String,
    author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        username: String
    },
})

var reply = mongoose.model("reply", replySchema);
module.exports = reply;