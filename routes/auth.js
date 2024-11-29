const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const destroyJWT = require("../middleware/destroyJWT");
const checkValidation = require("../middleware/checkValidation");
const { signup, verifyCode, createAccount, login, auto_login, logout} = require("../controllers/auth.controller");



router.post("/signup",checkValidation ,signup);
router.post("/verifyCode/:url",verifyCode);
router.post("/createAccount/:url",checkValidation, createAccount);
router.post("/login", checkValidation, login);
router.post("/autologin", checkJWT, auto_login);
router.post("/logout", checkJWT, destroyJWT, logout);


module.exports = router;