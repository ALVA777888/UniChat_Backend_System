const JWT = require("jsonwebtoken");
const config = require("../config");
const { UserAccount, InvalidToken } = require("../db/User");

// JWTが有効かを確認

module.exports = async (req, res, next) => {
    // JWTを持ってるか確認
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(400).json([{ message: "権限なし" }]);
    }

    try {
        // JWTトークンを検証
        let user = await JWT.verify(token, config.jwt.secret);

        //DBにメールアドレスが存在しているか確認
        const user_email = await UserAccount.findOne({ mail: user.email });
        if (!user_email) {
            return res.status(400).json({
                message: "アカウントが見つかりません。削除されている可能性があります",
            });
        }

        //トークンが有効かを確認
        const invalidToken = await InvalidToken.findOne({ mail: user.email });
        if (invalidToken) {
            const tokenExists = invalidToken.invalid_tokens.includes(token);
            if (tokenExists) {
                return res.status(400).json({
                    message: "ログアウトされました。再度ログインしてください",
                });
            }
        }

        req.user = user; //次の関数でも引き続きトークンにある情報を利用できるように入れてる
        console.log("認証完了:"+user.email);
        next();

    } catch (err) {
        return res.status(400).json([{ message: "トークンが一致しません。トークンの期限が切れている可能性があります。再度ログインしてください" }]);
    }
};
