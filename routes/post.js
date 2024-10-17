const router = require("express").Router();
const JWT = require("jsonwebtoken");
const checkJWT = require("../middleware/checkJWT");


router.post("/private", checkJWT,(req, res) =>{
    return res.json({
        message: "ログイン成功",
        ID: req.user,
    });
});


module.exports = router;