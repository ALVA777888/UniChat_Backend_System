const {UserAccount,UserPost} = require("../models/user");
const bcrypt = require("bcrypt");

//全員のユーザーを確認
const get_alluser = async(req, res) => {
    const Users = await UserAccount.find({})
    res.send(Users);
};

//全員のポストを確認
const get_allposts = async(req, res) => {
    const Posts = await UserPost.find({})
    res.send(Posts);
};


//テスト用の借ユーザ作成
const make_fakeuser = async(req, res) => {

    const email = req.body.email;
    const password = "password";

    const hashedPassword = await bcrypt.hash(password, 10);
    // データベースに保存
    const UserID = new UserAccount({
        mail: email,
        password: hashedPassword,
        //仮の値
        userid: "fake_user#" + email,
        username: username = "ふぇいく" + email,
        CollegeName: CollegeName = "Unaffiliated",
        statuscode: "9999",
    });
    await UserID.save();
    
    return res.status(200).json({ 
        message: "ユーザー登録が完了しました" ,
        userid: UserID.userid,
        UserObjID: UserID._id
    });
};
module.exports = { get_alluser, get_allposts, make_fakeuser };