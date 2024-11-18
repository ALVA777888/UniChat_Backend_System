const UserAccount = require('../../models/user');

const getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await UserAccount.findById(userId).populate('followers', 'userid mail');
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません。"});
        }

        res.status(200).json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ message: "エラーが発生しました。", error: error.message });
    }
};

module.exports = { getFollowers };