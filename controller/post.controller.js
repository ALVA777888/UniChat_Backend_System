const {UserPost} = require("../db/User");const jwt = require("jsonwebtoken");



//Post(ツイート)を実装する予定の場所、現在とりあえずユーザーの識別関係なく投稿機能を実装



//Post機能、有効なJWTを保持している人のみ投稿できる。現状はユーザーを正確に識別する機能を実装しているわけではない
const post = async(req,res) =>{
   
    const Userid = req.user.userid;
    const Posttext = req.body.posttext;

    const post = new UserPost({
        userid: Userid,
        posttext: Posttext,
        posttime: Date.now(),
        statuscode: "0000"
    });
    try{
        await post.save();
    } catch {
        console.log(Posttext);
        if(Posttext == ""){
            return res.status(400).json({
                message: "テキストボックスが空白です",
            });
        }
        return res.status(500).json(
        {
            message: "サーバー側で何かしらのエラーが発生しました",
        });
    }

    return res.json({
        userid: Userid,
        message: "投稿完了",
    });


};

//ポストを取得するAPI
const getposts = async(req,res) =>{
    try{
        const Posts = await UserPost.find({})
        res.send(Posts);
    } catch(err) {
        return res.status(500).json(
            {
                message: "ポストの取得に失敗しました",
            });
    }

};

const reposts = async(req,res) =>{
    
};



module.exports = {post,getposts};
