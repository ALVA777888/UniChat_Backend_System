const { UserPost, UserReply, UserAccount } = require("../models/user");
const { getUserName, getUserID } = require("../utils/accountHelper");

// 共通エラーハンドラー
const handleError = (res, error, message = "エラーが発生しました") => {
    console.error(error);
    return res.status(500).json({ message });
};

// 投稿保存処理
const savePost = async (res, post) => {
    try {
        await post.save();
        return res.json({ message: "投稿完了", post });
    } catch (error) {
        return handleError(res, error, "投稿に失敗しました。再度お試しください");
    }
};

// リプライ一覧を取得する機能
const getRepliesForPost = async (req, res) => {
    const { postId } = req.params; // リクエストURLからpostIdを取得

    try {
        // postIdに紐づく全リプライを取得し、投稿時間で降順にソート
        const replies = await UserReply.find({ originalPostId: postId }).sort({ posttime: -1 });

        // リプライにユーザー情報を追加
        const modifiedReplies = await Promise.all(replies.map(async (reply) => {
            const userName = await getUserName(reply.userObjectId); // ユーザー名を取得
            const userID = await getUserID(reply.userObjectId);     // ユーザーIDを取得
            return {
                ...reply._doc,
                userName,
                userID
            };
        }));

        // リプライ一覧を返却
        return res.json(modifiedReplies);
    } catch (error) {
        return handleError(res, error, "リプライの取得中にエラーが発生しました");
    }
};

// 新規投稿作成
const createPost = async (req, res) => {
    const { posttext, postfile = undefined } = req.body;
    const { userObjectId } = req;

    if (!posttext) {
        return res.status(400).json({ message: "テキストボックスが空白です" });
    }

    const newPost = new UserPost({
        userObjectId,
        posttext,
        postfile,
        posttime: Date.now(),
        statuscode: "0000"
    });

    return savePost(res, newPost);
};

// リプライ投稿
const createReply = async (req, res) => {
    const { posttext, postId: originalPostId } = req.body;
    const { userObjectId } = req;

    if (!posttext) {
        return res.status(400).json({ message: "テキストボックスが空白です" });
    }

    const newReply = new UserReply({
        userObjectId,
        posttext,
        posttime: Date.now(),
        originalPostId,
        statuscode: "reply"
    });

    return savePost(res, newReply);
};

// リポスト作成/解除
const repost = async (req, res) => {
    const { originalPostId } = req.body;
    const { userObjectId } = req;

    try {
        const user = await UserAccount.findById(userObjectId);
        const originalPost = await UserPost.findById(originalPostId);
        if (!user || !originalPost) {
            return res.status(404).json({ message: "ユーザーまたは元投稿が見つかりません" });
        }

        // リポスト済みか確認
        const existingRepost = await UserPost.findOne({ userObjectId, originalPostId });
        if (existingRepost) {
            originalPost.reposts = originalPost.reposts.filter(id => id.toString() !== existingRepost._id.toString());
            await originalPost.save();
            await UserPost.deleteOne({ _id: existingRepost._id });
            return res.json({ message: "リポストを解除しました" });
        }

        // 新規リポスト
        const repost = new UserPost({
            userObjectId,
            originalPostId,
            posttime: Date.now(),
            statuscode: "repost"
        });

        originalPost.reposts.push(repost._id);
        await originalPost.save();
        return savePost(res, repost);
    } catch (error) {
        return handleError(res, error);
    }
};

// いいね機能
const likePost = async (req, res) => {
    const { originalPostId } = req.body;
    const { userObjectId } = req;

    try {
        const user = await UserAccount.findById(userObjectId);
        const post = await UserPost.findById(originalPostId);
        if (!user || !post) {
            return res.status(404).json({ message: "ユーザーまたは投稿が見つかりません" });
        }

        const isLiked = post.likes.some(like => like.equals(user._id));
        if (isLiked) {
            post.likes = post.likes.filter(like => !like.equals(user._id));
            await post.save();
            return res.json({ message: "いいねを解除しました", status: false });
        }

        post.likes.push(user._id);
        await post.save();
        return res.json({ message: "いいねしました", status: true });
    } catch (error) {
        return handleError(res, error);
    }
};

// 投稿リスト取得（共通処理）
const fetchPosts = async (filter, res, userObjectId = null) => {
    try {
        const posts = await UserPost.find(filter).sort({ posttime: -1 }).limit(10);
        const modifiedPosts = await Promise.all(posts.map(async (post) => {
            const userName = await getUserName(post.userObjectId);
            const userID = await getUserID(post.userObjectId);
            return {
                ...post._doc,
                userName,
                userID,
                isMyLike: userObjectId ? post.likes.includes(userObjectId) : false,
                likes: post.likes.length
            };
        }));

        return res.json(modifiedPosts);
    } catch (error) {
        return handleError(res, error, "投稿の取得中にエラーが発生しました");
    }
};

// 自分の投稿を取得
const getMyPost = (req, res) => fetchPosts({ userObjectId: req.userObjectId }, res);

// 他ユーザーの投稿を取得
const getUserPost = (req, res) => fetchPosts({ userObjectId: req.params.userObjectId }, res, req.userObjectId);

// フォローしているユーザーの投稿を取得
const getFollowingsPost = async (req, res) => {
    try {
        const { userObjectId } = req;
        const user = await UserAccount.findById(userObjectId);
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }
        return fetchPosts({ userObjectId: { $in: user.following } }, res);
    } catch (error) {
        return handleError(res, error);
    }
};

// 全投稿を取得
const getAllPost = (req, res) => fetchPosts({}, res, req.userObjectId);

// 最新投稿を取得
const getRecent = (req, res) => fetchPosts({}, res);

module.exports = {
    createPost,
    createReply,
    repost,
    likePost,
    getMyPost,
    getUserPost,
    getFollowingsPost,
    getAllPost,
    getRecent,
    getRepliesForPost // 新機能をエクスポート
};
