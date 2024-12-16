const { UserAccount } = require("../models/user");

const getUserID = async (userObjectId, res) => {
    try {
        const user = await UserAccount.findOne({ _id:userObjectId });
        if (!user) {
            return "Unknown_User";
        }
        console.log(user.userid);
        return user.userid;
        

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "ユーザーの取得に失敗しました",
        });
    }
}

const getUserName = async (userObjectId, res) => {
    try {
        const user = await UserAccount.findOne({ _id:userObjectId });
        if (!user) {
            return "退会したユーザー";
        }
        console.log(user.username);
        return user.username;
        

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "ユーザーの取得に失敗しました",
        });
    }
}


// ユーザーのuserObjectIdを元にユーザー名を取得しJson形式で返す
const getUserMap = async (userObjectIds) => {
    // クエリ条件を指定して特定のユーザーのみを取得
    const users = await UserAccount.find({ _id: { $in: userObjectIds } }, '_id username');
    const userMap = users.reduce((map, user) => {
        map[user._id] = user.username;
        return map;
    }, {});
    return userMap;
};



module.exports = { getUserID, getUserMap, getUserName };