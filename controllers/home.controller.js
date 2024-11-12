const { UserPost } = require("../models/user");


//ログインした対象userのpostのみ閲覧
const userPost = async (req, res) => {
    try {
        const userId = req.user.userid; //JWTからuseridを取得
        //特定のpostを取得、日時で降順にソート
        const posts = await UserPost.find({ userid: userId }).sort({ posttime: -1 }).limit(10);

        return res.json(posts);
    } catch (error) {
        console.error("Error home timeline", error);
        return res.status(500).json({ message: "TimeLineの取得中にエラーが発生しました。"});
    }
};

//全post閲覧（認証必要）
const allPost = async (req, res) => {
    try {
        const posts = await UserPost.find().sort({ posttime: -1 });
        return res.json(Posts);
     } catch (error) {
        console.error("Error home timeline", error);
        return res.status(500).json({ message: "TimeLineの取得中にエラーが発生しました。"});
     }
    };

//最新投稿を取得(デバッグ)
const recent = async (req, res) => {
    try {
        //最新10件取得、降順ソート
        const recentPosts = await UserPost.find().sort({ posttime: -1 }).limit(10);

        return res.json(recentPosts);
    } catch (error) {
        console.error("Error recent posts:", error);
        return res.status(500).json({ message: "最新投稿の取得時にエラーが発生しました。"});
    }
};

module.exports = {userPost,allPost,recent};
