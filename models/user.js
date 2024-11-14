const mongoose = require("mongoose");
const { DirectMessage } = require("./directmessage");

//User情報関係のDBのフォーマットを形成している場所

const UserAccountSchema = new mongoose.Schema({

    userid:{//アカウントのID
        type: String,
        required: true,
        trim: true,
    },
    UniqueID:{//ユーザー一人に与えられる固有のID 
        type: String,
        required: true,
        ref: "UserAccount",
        trim: true,
    },
    mail:{//学校用のメールアドレス
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    statuscode:{//ユーザーの追加情報を保存する。例えばBANであったりなど
        type: String,//TODO:文字列じゃなくて数列に変更したい
        required: true,
        trim: true,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
    }],
    groups:[{
        groupId: String,
        isApproved: Boolean,
    }]
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
        trim: false,
    },
    posttime:{
        type: Date,
        required: true,
        trim: false,
    },
    originalPostId: { //リポスト元ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPost",
        default: null,
    },
    reposts: [{ //配列[リポストの]
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPost",
    }],
    likes: [{ //配列[いいねをしたユーザーIDの]
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
    }],
    statuscode: {//投稿内容の追加情報を保存する。例えば、制限が設けられた投稿など
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