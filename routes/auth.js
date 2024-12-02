const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const destroyJWT = require("../middleware/destroyJWT");
const { signup, verifyCode, createAccount, login, auto_login, logout} = require("../controllers/auth.controller");



router.post("/signup", signup);
router.post("/verifyCode/:url", verifyCode);
router.post("/createAccount/:url", createAccount);
router.post("/login", login);
router.post("/autologin", checkJWT, auto_login);
router.post("/logout", checkJWT, destroyJWT, logout);


module.exports = router;