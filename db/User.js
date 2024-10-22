const mongoose = require("mongoose");

const UserAccountSchema = new mongoose.Schema({
    username:{//ちょっとよくわからないけどとりあえずつけてるやつ
        type: String,
        required: true,
        trim: true,
    },
    userid:{//アカウントのID
        type: String,
        required: false,
        trim: true,
    },
    mail:{//学校用のメールアドレス
        type: String,
        required: true,
        trim: true,
    },
    password:{//見りゃわかんだろパスワード
        type: String,
        required: true,
        trim: true,
    },

});

const UserPostSchema = new mongoose.Schema({
    // postid:{
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    userid:{
        type: String,
        required: true,
        trim: true,
    },
    posttext:{
        type: String,
        required: true,
        trim: false,
    },
    posttime:{
        type: String,
        required: true,
        trim: false,
    },
});


const UserAccount = mongoose.model("UserAccount", UserAccountSchema);
const UserPost = mongoose.model("UserPost", UserPostSchema);

module.exports = { UserAccount,UserPost };