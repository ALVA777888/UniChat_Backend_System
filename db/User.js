const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    mail:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },

});


const UserAccount = mongoose.model("UserAccount", UserSchema);

module.exports = UserAccount;