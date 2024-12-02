const {UserAccount} = require('../../models/user');
const mongoose = require('mongoose');

const myFollowings = async (req, res) => {
    try {
        const { userObjectId } = req;

        if (!mongoose.Types.ObjectId.isValid(userObjectId)) {
            return res.status(400).json({ message: "無効なユーザーIDです。" });
        }

        
        const user = await UserAccount.findById(userObjectId)
            .populate("following", "userid username")
            .exec();

            const followingData = user.following.map(following => ({
                userid: following.userid,
                username: following.username
            }));
    
            return res.json({
                following: followingData
            });
    
    } catch (error) {
        console.error("フォロー欄の取得中にエラーが発生しました。", error);
        return res.status(500).json({ message: "フォロー欄の取得中にエラーが発生しました。"});
    }
};

const userFollowings = async (req, res) => {
    try {
        const targetObjectId = req.body.targetUserId;
        

        if (!mongoose.Types.ObjectId.isValid(targetObjectId)) {
            return res.status(400).json({ message: "無効なユーザーIDです。" });
        }

        
        const user = await UserAccount.findById(targetObjectId)
            .populate("following", "userid username")
            .exec();

            const followingData = user.following.map(following => ({
                userid: following.userid,
                username: following.username
            }));
    
            return res.json({
                following: followingData
            });
    
    } catch (error) {
        console.error("フォロー欄の取得中にエラーが発生しました。", error);
        return res.status(500).json({ message: "フォロー欄の取得中にエラーが発生しました。"});
    }
};

module.exports = { myFollowings, userFollowings };
