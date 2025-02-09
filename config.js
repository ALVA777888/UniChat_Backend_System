require("dotenv").config();

//主に.envファイルの情報を簡単に取り出せるようにする場所。
//.envとはGithubなどに載せるとまずい情報(複合キーなど)を記載しておく場所。gitignoreなどに入れて漏洩を伏せぐ目的

module.exports = {
    jwt: {
        secret: process.env.SECRETKEY,
        options:{
            algorithm: "HS256",
            expiresIn: "30d"
        },
    },
    database: {
        passkey: process.env.DBPASSKEY,
        url: process.env.DBURL,
    },
    mail: {
        valid_domain: process.env.VAL_DOMAIN,
        provider_address: process.env.MAIL_PROVIDER_ADDRESS,
        provider_address_key: process.env.MAIL_PROVIDER_ADDRESS_KEY,
        
    },
};