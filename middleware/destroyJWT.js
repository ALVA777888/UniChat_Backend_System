const JWT = require("jsonwebtoken");
const config = require("../config");
const { InvalidToken } = require("../db/User");

// JWTを破棄

module.exports = async (req, res, next) => {
    // JWTを持ってるか確認
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(400).json([{ message: "権限なし" }]);
    }

    try {
        const user = await JWT.verify(token, config.jwt.secret);
        const User_mail_address = user.email;
        const invalidToken = await InvalidToken.findOne({ mail: User_mail_address });

        if (invalidToken) {
            await InvalidToken.updateOne(
                { _id: invalidToken._id },
                { $push: { invalid_tokens: token } }
            );
        } else {
            const invalid_tokens = new InvalidToken({
                mail: User_mail_address,
                invalid_tokens: [token]  // 配列として初期化
            });
            await invalid_tokens.save();
        }
        console.log("削除完了:"+token);
        next();
    } catch (errors) {
        console.log(errors);
        return res.status(500).json([{ message: "トークンを認識できませんでした。すでにトークンが破棄されている可能性があります" }]);
    }
};
