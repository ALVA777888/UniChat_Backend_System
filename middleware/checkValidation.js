const { body } = require("express-validator");
const { validateAlphanumeric } = require("../utils/utils");


// バリデーションミドルウェアを定義
module.exports = signupValidation = [
    body("email").isEmail().withMessage("有効なメールアドレスを入力してください"),
    body("password").isLength({ min: 6 }).withMessage("パスワードは6文字以上でなければなりません"),
    body("userid").custom(value => {
        if (!validateAlphanumeric(value)) {
            throw new Error("UserIDは半角英数のみ有効です");
        }
        return true;
    })
];


