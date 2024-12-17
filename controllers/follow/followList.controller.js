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

const myFollowers = (req, res) => handleFollowRequest(req, res, "followers");

const userFollowers = (req, res) => handleFollowRequest(req, res, "followers");


const myFollowings = (req, res) => handleFollowRequest(req, res, "following");

const userFollowings = (req, res) => handleFollowRequest(req, res, "following");

module.exports = { myFollowers, userFollowers, myFollowings, userFollowings };
