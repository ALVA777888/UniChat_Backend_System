const { UserAccount } = require("../../models/user");

const getUserID = async (req, res) => {
    try {
        const uesrmail = req.user.email;
        const user = await UserAccount.findOne({ mail: uesrmail });
        if (!user) {
            return res.status(400).json({
                message: "ユーザーが見つかりませんでした"
            });
        }
        return res.json({
            username: user.userid
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "ユーザーの取得に失敗しました",
        });
    }
}

module.exports = { getUserID };