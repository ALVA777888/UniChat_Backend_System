const router = require("express").Router();
const { addgroup, getgroups, getmessages, sendmessage } = require('../controller/directmessage.controller'); 
const checkJWT = require('../middleware/checkJWT');
const checkMember = require("../middleware/checkMember");



router.post("/addgroup", checkJWT, addgroup);
router.post("/:groupId", checkJWT, checkMember,sendmessage);

router.get("/", checkJWT, getgroups);
router.get("/:groupId", checkJWT, checkMember,getmessages);

module.exports = router;