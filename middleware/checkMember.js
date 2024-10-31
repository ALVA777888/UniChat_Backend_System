const { DirectMessage } = require("../models/directmessage");

// グループに存在しないユーザをはじく処理
module.exports = async (req, res, next) => {
    try {
        const userid = req.user.userid;
        const groupid = req.params.groupId;

        // グループの存在確認とユーザーの所属確認を一度に行う
        const user = await DirectMessage.findOne({ "groups.groupId": groupid });

        if (!user) {
            return res.status(400).json({
                message: "グループが見つかりませんでした"
            });
        }

        const foundGroup = user.groups.find(group => group.groupId === groupid);

        if (!foundGroup || !foundGroup.members.includes(userid)) {
            return res.status(400).json({
                message: "あなたはこのグループのメンバーではありません。"
            });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "何らしらのエラー"
        });
    }
};
