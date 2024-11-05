const router = require("express").Router();
const { creategroup, getgroups, getmessages, sendmessage, invite_user, getmembers } = require('../controller/directmessage.controller'); 
const checkJWT = require('../middleware/checkJWT');
const checkMember = require("../middleware/checkMember");



router.post("/creategroup", checkJWT, creategroup);
router.post("/:groupId", checkJWT, checkMember,sendmessage);
router.post("/:groupId/inviteuser", checkJWT, checkMember, invite_user)

router.get("/", checkJWT, getgroups);
router.get("/:groupId", checkJWT, checkMember,getmessages);
router.get("/:groupId/getmembers", checkJWT, checkMember,getmembers);


module.exports = router;