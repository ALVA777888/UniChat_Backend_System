const UserAccount = require('./User');

const unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.param.userId;

        const user = await UserAccount.findById(userId);
        const targetUser = await UserAccount.findById(targetUserid);

        if (!user.following.includes(targetUserId)) {
            return res.status(400).json({ message: "ユーザーがみつかりません。"});
        }

        if (!user.following.includes(targetUserId)) {
            return res.status(400).json({ message: "フォローしていません。" });
        }

        user.following = user.following.filter(id => id.toString() !== targetUserId);
        targetUser.follwers = targetUser.follwers.filter(id => id.toString() !== userId);
        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "フォローを解除しました。"});
    } catch (error) {
        res.status(500).json({ message: "エラーが発生しました。", error: error.message });
    }
};

module.exports = { unfollowUser };