const router = require("express").Router();
const express = require("express");
const checkJWT = require("../middleware/checkJWT");
const { UserPost } = require("../db/User");

//home画面のTLを取得(認証必要)
router.get("/", checkJWT, async (req, res) => {
    try {
        const userId = req.user.userid; //JWTからuseridを取得
        //特定のpostを取得、日時で降順にソート
        const posts = await UserPost.find({ userid: userId }).sort({ posttime: -1 }).limit(10);

        return res.json(posts);
    } catch (error) {
        console.error("Error home timeline", error);
        return res.status(500).json({ message: "TimeLineの取得中にエラーが発生しました。"});
    }
});

//最新投稿を取得(デバッグ、user向け)
router.get("/recent", async (req, res) => {
    try {
        //最新10件取得、降順ソート
        const recentPosts = await UserPost.find().sort({ posttime: -1 }).limit(10);

        return res.json(recentPosts);
    } catch (error) {
        console.error("Error recent posts:", error);
        return res.status(500).json({ message: "最新投稿の取得時にエラーが発生しました。"});
    }
});

module.exports = router;