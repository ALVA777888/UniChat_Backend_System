const router = require("express").Router();
const checkJWT = require('../middleware/checkJWT');
const { getUserID } = require("../controller/accountManager/getUserID");


router.get("/getUserID", checkJWT, getUserID);

module.exports = router;