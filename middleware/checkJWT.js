const JWT = require("jsonwebtoken");
const config = require("../config");
const {UserAccount} = require("../db/User");

//JWTが有効かを確認する場所

module.exports = async (req, res, next) => {
    // JWTを持ってるか確認
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(400).json([
            {
                message: "権限なし",
            },
        ]);
    }

    try {
        // JWTトークンを検証
        let user = await JWT.verify(token, config.jwt.secret);
        console.log(user);
        const user_email = await UserAccount.findOne({ mail: user.email });
        if(!user_email){
            return res.status(400).json(
                {
                    message: "アカウントが削除されているか、無効なトークンです",
                });
        }
        next();
        
    } catch (err) {
        return res.status(400).json([
            {
                message: "トークンが一致しません",
            },
        ]);
    }
};
