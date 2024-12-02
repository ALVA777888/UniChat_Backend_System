const {UserPost} = require("../models/user");
const {UserAccount} = require('../models/user');


//Post機能、有効なJWTを保持している人のみ投稿できる。現状はユーザーを正確に識別する機能を実装しているわけではない
const createPost = async(req,res) =>{
   
    const userObjectId = req.userObjectId;
    const Posttext = req.body.posttext;

    try {
        if (Posttext === "") {
            return res.status(400).json({ message: "テキストボックスが空白です" });
        }
        const newPost = new UserPost({
            userObjectId,
            posttext: Posttext,
            posttime: Date.now(),
            statuscode: "0000"
        });
        

        await newPost.save();
        return res.json({ userObjectId: userObjectId, message: "投稿完了", newPost });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

const createReply = async(req,res) =>{
   
    const userObjectId = req.userObjectId;
    const Posttext = req.body.posttext;
    const originalPostId = req.body.originalPostId;

    try {
        if (Posttext === "") {
            return res.status(400).json({ message: "テキストボックスが空白です" });
        }
        const newReply = new UserPost({
            userObjectId,
            posttext: Posttext,
            posttime: Date.now(),
            replyTo: originalPostId,
            statuscode: "reply"
        });
        
        await newReply.save();

        await UserPost.findByIdAndUpdate(originalPostId,{
            $push: { replies: newReply._id },
        });

        return res.json({ userObjectId: userObjectId, message: "投稿完了", newReply });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

const repost = async (req, res) => {
    const { originalPostId } = req.body;
    const userObjectId = req.userObjectId;

    try {
        const user = await UserAccount.findOne({ _id: userObjectId });
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }

        const originalPost = await UserPost.findById(originalPostId);
        if (!originalPost) {
            return res.status(404).json({ message: "元の投稿が見つかりません" });
        }

        const existingRepost = await UserPost.findOne({
            userObjectId: userObjectId,
            originalPostId: originalPostId
        });

        if (existingRepost) {
            originalPost.reposts = originalPost.reposts.filter(id => id.toString() !== existingRepost._id.toString());
            await originalPost.save();
            await UserPost.deleteOne({ _id: existingRepost._id });

            return res.json({ userObjectId: userObjectId, message: "リポストを解除しました" });
        }

        const repost = new UserPost({
            userObjectId,
            originalPostId: originalPostId,
            posttime: Date.now(),
            statuscode: "repost"
        });

        originalPost.reposts.push(repost._id);
        await originalPost.save();
        await repost.save();

        return res.json({ userObjectId: userObjectId, message: "リポスト完了", repost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

const likePost = async (req, res) => {
    try {
        const { originalPostId } = req.body;
        const userObjectId = req.userObjectId;

        const userFromDB = await UserAccount.findOne({ _id: userObjectId });
        if (!userFromDB) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }

        const originalPost = await UserPost.findById(originalPostId);
        if (!originalPost) {
            return res.status(404).json({ message: "元の投稿が見つかりません" });
        }

        const userIdFromDB = userFromDB._id;

        originalPost.likes = originalPost.likes.filter(like => like !== null);
        const existingLike = originalPost.likes.find(like => like.equals(userIdFromDB));

        if (existingLike) {
            originalPost.likes = originalPost.likes.filter(like => !like.equals(userIdFromDB));
            await originalPost.save();
            return res.json({ message: "いいねを解除しました" });
        }

        originalPost.likes.push(userIdFromDB);
        await originalPost.save();

        return res.json({ message: "いいねしました" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

//ログインした対象userのpostのみ閲覧
const getMyPost = async (req, res) => {
    try {
        const userObjectId = req.userObjectId; //JWTからuseridを取得
        //特定のpostを取得、日時で降順にソート
        const posts = await UserPost.find({ userObjectId }).sort({ posttime: -1 }).limit(10);

        return res.json(posts);
    } catch (error) {
        console.error("Error home timeline", error);
        return res.status(500).json({ message: "TimeLineの取得中にエラーが発生しました。"});
    }
};

//フォローしたuserのpostのみ閲覧
const getFollowingsPost = async (req, res) => {
    try {
        const userObjectId = req.userObjectId;
        
        const user = await UserAccount.findById(userObjectId);
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }

        const followingUserIds = user.following;

        //特定のpostを取得、日時で降順にソート
        const posts = await UserPost.find({ userObjectId: { $in: followingUserIds } })
        .sort({ posttime: -1 })
        .limit(10);
        
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




module.exports = {createPost,createReply,repost,likePost,getMyPost,getFollowingsPost,getAllPost,getRecent};
