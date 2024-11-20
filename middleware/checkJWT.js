const JWT = require("jsonwebtoken");
const config = require("../config");
const { UserAccount, InvalidToken } = require("../models/user");

// JWTが有効かを確認

module.exports = async (req, res, next) => {
    // JWTを持ってるか確認
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(400).json({ message: "権限なし" });
    }

    try {
        // JWTトークンを検証
        let user = await JWT.verify(token, config.jwt.secret);

        //DBにメールアドレスが存在しているか確認
        const userObjectId = await UserAccount.findOne({ _id: user.userObjectId });
        if (!userObjectId) {
            return res.status(400).json({
                message: "アカウントが見つかりません。削除されている可能性があります",
            });
        }

        //トークンが有効かを確認
        const invalidToken = await InvalidToken.findOne({ userObjectId: user.userObjectId });
        if (invalidToken) {
            const tokenExists = invalidToken.invalid_tokens.includes(token);
            if (tokenExists) {
                return res.status(400).json({
                    message: "最近ログアウトされました。再度ログインしてください",
                });
            }
        }

  
        req.userObjectId = user.userObjectId; //次の関数でも引き続きトークンにある情報を利用できるように入れてる
        console.log("認証完了:"+user.userObjectId);
        next();

    } catch (err) {
        return res.status(400).json({ message: "トークンの期限が切れました。再度ログインしてください" });
    }
};
