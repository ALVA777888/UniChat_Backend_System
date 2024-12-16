const { changePassword, changeAccountProfile } = require('../controllers/account.controller');
const router = require("express").Router();
const checkJWT = require('../middleware/checkJWT');

router.post("/changeprofile", checkJWT, changeAccountProfile);
router.post("/changepassword", checkJWT, changePassword);

module.exports = router;