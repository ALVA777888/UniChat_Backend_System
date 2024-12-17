const { changePassword, changeAccountProfile, getAccountProfile } = require('../controllers/account.controller');
const router = require("express").Router();
const checkJWT = require('../middleware/checkJWT');

router.post("/changeprofile", checkJWT, changeAccountProfile);
router.post("/changepassword", checkJWT, changePassword);

router.get("/getprofile/:userObjectId", checkJWT, getAccountProfile);

module.exports = router;