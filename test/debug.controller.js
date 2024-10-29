const {UserAccount,UserPost} = require("../db/User");


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

module.exports = { get_alluser, get_allposts };