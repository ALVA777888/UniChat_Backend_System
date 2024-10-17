require("dotenv").config();

module.exports = {
    jwt: {
        secret: process.env.SECRETKEY,
        options:{
            algorithm: "HS256",
            expiresIn: "1d"
        },
    },
    database: {
        passkey: process.env.DBPASSKEY,
    },
};