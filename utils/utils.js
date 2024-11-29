const config = require("../config");
// utils.js
function validateAlphanumeric(input) {
    const alphanumericPattern = /^[a-zA-Z0-9]*$/;
    return alphanumericPattern.test(input);
}

//メールアドレスのドメインが許可されているかどうかを確認
const validateEmailDomain = (email) => {
    const allowedDomains = [config.mail.valid_domain]; // 許可するドメインを指定
    const emailDomain = email.split('@')[1];
    return allowedDomains.includes(emailDomain);
};
module.exports = { validateAlphanumeric, validateEmailDomain };
