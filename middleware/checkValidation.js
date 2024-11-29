const { body, validationResult } = require("express-validator");
const { validateAlphanumeric, validateEmailDomain } = require("../utils/utils");

const checkValidation = [
    body("email").custom(value => {
        if (!validateEmailDomain(value)) {
            throw new Error("許可されていないドメインです\n学校のドメインのみが許可されています");
        }
        return true;
    }),
    body("password").isLength({ min: 6 }).withMessage("パスワードは6文字以上でなければなりません"),
    body("userid").custom(value => {
        if (!validateAlphanumeric(value)) {
            throw new Error("UserIDは半角英数のみ有効です");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().map(error => error.msg).join(',\n')});
        }
        next();
    }
];

module.exports = checkValidation;