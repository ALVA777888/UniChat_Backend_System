const router = require("express").Router();
const JWT = require("jsonwebtoken");
const checkJWT = require("../middleware/checkJWT");
const {UserPost} = require("../db/User");

router.post("/private", checkJWT,(req, res) =>{
    return res.json({
        message: "ログイン成功",
        ID: req.user,
    });
});

router.post("/post", checkJWT,async(req,res) =>{
   
    const Userid = req.body.userid;
    const Posttext = req.body.posttext;

    const post = new UserPost({
        userid: Userid,
        posttext: Posttext,
        posttime: Date.now(),
    });
    try{
        await post.save();
    } catch {
        res.status(500).json(
        {
            message: errors,
        });
    }

    return res.json({
        userid: Userid,
        posttext: Posttext,
        message: "投稿完了",
    });

});

router.get("/getpost", checkJWT,(req,res) =>{


});

//全員のポストを確認
router.get("/allPost", async(req, res) => {
    const Posts = await UserPost.find({})
    res.send(Posts);
});

module.exports = router;