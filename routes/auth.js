const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const destroyJWT = require("../middleware/destroyJWT");
const checkValidation = require("../middleware/checkValidation");
const { signup, login, auto_login, logout} = require("../controller/auth.controller");



router.post("/signup",checkValidation ,signup);
router.post("/login", checkValidation, login);
router.post("/autologin", checkJWT, auto_login);
router.post("/logout", checkJWT, destroyJWT, logout);


module.exports = router;