const {UserPost} = require("../../models/user");
const {UserAccount} = require('../../models/user');
const mongoose = require('mongoose'); 

const followUser = async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "自分自身をフォローすることはできません" });
        }

        const user = await UserAccount.findOne({ userid: userId });
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }

        const targetUser = await UserAccount.findOne({ userid: targetUserId });
        if (!targetUser) {
            return res.status(404).json({ message: "フォロー対象のユーザーが見つかりません" });
        }

        const userObjectId = user._id;
        const targetUserObjectId = targetUser._id;

        const alreadyFollowing = targetUser.following.includes(userObjectId.toString());

        if (alreadyFollowing) {
            targetUser.following = targetUser.following.filter(id => id.toString() !== userObjectId.toString());
            user.followers = user.followers.filter(id => id.toString() !== targetUserObjectId.toString());

            await targetUser.save();
            await user.save();
            return res.json({ message: "フォローを解除しました" });
        } else {
            targetUser.following.push(userObjectId);
            user.followers.push(targetUserObjectId);

            await targetUser.save();
            await user.save();
            return res.json({ message: "フォローしました" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバーエラーが発生しました" });
    }
};


module.exports = followUser;