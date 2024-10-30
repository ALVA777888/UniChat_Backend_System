const mongoose = require("mongoose");
const { DirectMessage } = require("../models/directmessage");

//User情報関係のDBのフォーマットを形成している場所

const UserAccountSchema = new mongoose.Schema({

    userid:{//アカウントのID
        type: String,
        required: true,
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
    statuscode:{//ユーザーの追加情報を保存する。例えばBANであったりなど
        type: String,//TODO:文字列じゃなくて数列に変更したい
        required: true,
        trim: true,
    },
    groupId: [String],

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
        type: Date,
        required: true,
        trim: false,
    },
    statuscode:{//投稿内容の追加情報を保存する。例えば、制限が設けられた投稿など
        type: String,
        required: true,
        trim: true,
    }
});

const InvalidTokenSchema = new mongoose.Schema({
    mail:{
        type: String,
        required: true,
        trim: false,
    },
    invalid_tokens:{
        type: [String],
        required: true,
        trim: false,
    },

})


const UserAccount = mongoose.model("UserAccount", UserAccountSchema);
const UserPost = mongoose.model("UserPost", UserPostSchema);
const InvalidToken = mongoose.model("InvalidToken", InvalidTokenSchema);
module.exports = { UserAccount,UserPost,InvalidToken};