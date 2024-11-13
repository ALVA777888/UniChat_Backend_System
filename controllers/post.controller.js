const {UserPost} = require("../models/user");

//Post(ツイート)を実装する予定の場所、現在とりあえずユーザーの識別関係なく投稿機能を実装



//Post機能、有効なJWTを保持している人のみ投稿できる。現状はユーザーを正確に識別する機能を実装しているわけではない
const createPost = async(req,res) =>{
   
    const Userid = req.user.userid;
    const Posttext = req.body.posttext;

    try {
        const newPost = new UserPost({
            userid: Userid,
            posttext: Posttext,
            posttime: Date.now(),
            statuscode: "0000"
        });

        await newPost.save();
        return res.json({ userid: Userid, message: "投稿完了", newPost });
    } catch (error) {
        console.error(error);
        if (Posttext === "") {
            return res.status(400).json({ message: "テキストボックスが空白です" });
        }
        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

const repost = async (req, res) => {
    const Userid = req.user.userid;
    const originalPostId = req.params.postId; // パラメータから取得

    try {
        const originalPost = await UserPost.findById(originalPostId);
        if (!originalPost) {
            return res.status(404).json({ message: "元の投稿が見つかりません" });
        }

        const existingRepost = await UserPost.findOne({
            userid: Userid,
            originalPostId: originalPostId
        });

        if (existingRepost) {
            originalPost.reposts = originalPost.reposts.filter(id => id.toString() !== existingRepost._id.toString());
            await originalPost.save();
            await UserPost.deleteOne({ _id: existingRepost._id });

            return res.json({ userid: Userid, message: "リポストを解除しました" });
        }

        const repost = new UserPost({
            userid: Userid,
            originalPostId: originalPostId,
            posttime: Date.now(),
            statuscode: "repost"
        });

        originalPost.reposts.push(repost._id);
        await originalPost.save();
        await repost.save();

        return res.json({ userid: Userid, message: "リポスト完了", repost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

//ログインした対象userのpostのみ閲覧
const getUserPost = async (req, res) => {
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
const getAllPost = async (req, res) => {
    try {
        const posts = await UserPost.find().sort({ posttime: -1 });
        return res.json(posts);
     } catch (error) {
        console.error("Error home timeline", error);
        return res.status(500).json({ message: "TimeLineの取得中にエラーが発生しました。"});
     }
    };

//最新投稿を取得(デバッグ)
const getRecent = async (req, res) => {
    try {
        //最新10件取得、降順ソート
        const recentPosts = await UserPost.find().sort({ posttime: -1 }).limit(10);

        return res.json(recentPosts);
    } catch (error) {
        console.error("Error recent posts:", error);
        return res.status(500).json({ message: "最新投稿の取得時にエラーが発生しました。"});
    }
};




module.exports = {createPost,repost,getUserPost,getAllPost,getRecent};
