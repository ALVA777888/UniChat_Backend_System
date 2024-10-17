const JWT = require("jsonwebtoken");
const config = require("../config");

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
        req.user = user.email;
        next();
        
    } catch (err) {
        return res.status(400).json([
            {
                message: "トークンが一致しません",
            },
        ]);
    }
};
