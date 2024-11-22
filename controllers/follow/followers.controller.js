const {UserAccount} = require('../../models/user');
const mongoose = require('mongoose');

const myFollowers = async (req, res) => {
    try {
        const { userObjectId } = req;

        if (!mongoose.Types.ObjectId.isValid(userObjectId)) {
            return res.status(400).json({ message: "無効なユーザーIDです。" });
        }

        
        const user = await UserAccount.findById(userObjectId)
            .populate("followers", "userid username")
            .exec();

            const followersData = user.followers.map(follower => ({
                userid: follower.userid,
                username: follower.username
            }));

            return res.json({
                followers: followersData,
            });
    
    } catch (error) {
        console.error("フォロワー欄の取得中にエラーが発生しました。", error);
        return res.status(500).json({ message: "フォロワー欄の取得中にエラーが発生しました。"});
    }
};

const userFollowers = async (req, res) => {
    try {
        const targetObjectId = req.body.targetUserId;
        

        if (!mongoose.Types.ObjectId.isValid(targetObjectId)) {
            return res.status(400).json({ message: "無効なユーザーIDです。" });
        }

        
        const user = await UserAccount.findById(targetObjectId)
            .populate("followers", "userid username")
            .exec();

            const followersData = user.followers.map(follower => ({
                userid: follower.userid,
                username: follower.username
            }));
    
            return res.json({
                followers: followersData,
            });
    
    } catch (error) {
        console.error("フォロワー欄の取得中にエラーが発生しました。", error);
        return res.status(500).json({ message: "フォロワー欄の取得中にエラーが発生しました。"});
    }
};

module.exports = { myFollowers, userFollowers };
