const { UserAccount } = require('../../models/user');
const mongoose = require('mongoose');

class FollowService {
    constructor(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("無効なユーザーIDです。");
        }
        this.userId = userId;
    }

    async getFollowData(field) {
        const user = await UserAccount.findById(this.userId)
            .populate(field, "userid username")
            .exec();

        if (!user) {
            return [];
        }

        return user[field].map(follow => ({
            userid: follow.userid,
            username: follow.username,
        }));
    }

    async getFollowCounts() {
        const user = await UserAccount.findById(this.userId).exec();

        if (!user) {
            throw new Error("ユーザーが見つかりません");
        }

        const followingsCount = user.followers.length;
        const followersCount = user.following.length;

        return { followersCount, followingsCount };
    }

    async isFollowing(targetUserId) {
        const user = await UserAccount.findById(this.userId).exec();

        if (!user) {
            throw new Error("ユーザーが見つかりません");
        }

        return user.following.includes(targetUserId);
    }
}

const handleFollowRequest = async (req, res, field) => {
    try {
        console.log(`${field} リクエスト:`, {
            userObjectId: req.userObjectId,
            targetUserId: req.body.targetUserId
        });

        const userId = field === "followers" ? req.userObjectId : req.body.targetUserId || req.userObjectId;

        // userId をログ出力
        console.log(`${field} userId:`, userId);


        const followService = new FollowService(userId);
        const followData = await followService.getFollowData(field);

        return res.json({ [field]: followData });
    } catch (error) {
        console.error(`${field} データの取得中にエラーが発生しました。`, error);
        const status = error.message === "無効なユーザーIDです。" ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

const handleFollowCountsRequest = async (req, res) => {
    try {
        const userId = req.userObjectId;

        // userId をログ出力
        console.log(`Follow counts userId:`, userId);

        const followService = new FollowService(userId);
        const followCounts = await followService.getFollowCounts();

        return res.json(followCounts);
    } catch (error) {
        console.error(`フォローデータの取得中にエラーが発生しました。`, error);
        const status = error.message === "無効なユーザーIDです。" ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

const handleIsFollowingRequest = async (req, res) => {
    try {
        const userId = req.userObjectId;
        const targetUserId = req.body.targetUserId;

        // userId をログ出力
        console.log(`Is following request: userId=${userId}, targetUserId=${targetUserId}`);

        const followService = new FollowService(userId);
        const isFollowing = await followService.isFollowing(targetUserId);

        return res.json({ isFollowing });
    } catch (error) {
        console.error(`フォローデータの取得中にエラーが発生しました。`, error);
        const status = error.message === "無効なユーザーIDです。" ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

const myFollowers = (req, res) => handleFollowRequest(req, res, "followers");

const userFollowers = (req, res) => handleFollowRequest(req, res, "followers");

const myFollowings = (req, res) => handleFollowRequest(req, res, "following");

const userFollowings = (req, res) => handleFollowRequest(req, res, "following");

const followCounts = (req, res) => handleFollowCountsRequest(req, res);

const isFollowing = (req, res) => handleIsFollowingRequest(req, res);

module.exports = { myFollowers, userFollowers, myFollowings, userFollowings, followCounts, isFollowing, FollowService };