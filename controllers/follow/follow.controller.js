const UserAccount = require('../../models/user');

const followUser = async (req, res) => {
    try{
        const userId = req.user.userid;
        console.log(userId);
        const targetUserId = req.params.userId;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "自分自身はフォローできません。"});
        }

        const user = await UserAccount.findById(userId);
        const targetUser = await UserAccount.findById(targetUserId);

        if(!user || !targetUser) {
            return res.status(404).json({ message: "ユーザーが見つかりません"});
        }
        if (user.following.includes(targetUserId)) {
            res.status(400).json({ message: "そのユーザーはすでにフォローされています。"});
        }

        user.following.push(targetUserId);
        targetUser.followers.push(userId);
        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "ユーザーをフォローしました。"});
    } catch (error) {
        res.status(500).json({ message: "エラーが発生しました。", error: error.message });
    }
};

module.exports = { followUser };