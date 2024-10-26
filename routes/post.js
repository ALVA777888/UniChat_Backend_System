const router = require("express").Router();
const JWT = require("jsonwebtoken");
const checkJWT = require("../middleware/checkJWT");
const {UserPost} = require("../db/User");

//Post(ツイート)を実装する予定の場所、現在とりあえずユーザーの識別関係なく投稿機能を実装

//JWTによる認証をテスト
router.post("/private", checkJWT,(req, res) =>{
    return res.json({
        message: "ログイン成功",
        ID: req.user,
    });
});


//Post機能、有効なJWTを保持している人のみ投稿できる。現状はユーザーを正確に識別する機能を実装しているわけではない
router.post("/post", checkJWT,async(req,res) =>{
   
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
            message: "なんかのエラー",
        });
    }

    return res.json({
        userid: Userid,
        message: "投稿完了",
    });


});

router.get("/getpost", checkJWT,async(req,res) =>{
    const Posts = await UserPost.find({})
    res.send(Posts);
});

//全員のポストを確認
router.get("/allPost", async(req, res) => {
    const Posts = await UserPost.find({})
    res.send(Posts);
});

module.exports = router;