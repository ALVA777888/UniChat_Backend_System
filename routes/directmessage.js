const router = require("express").Router();
const checkJWT = require('../middleware/checkJWT');
const checkMember = require("../middleware/checkMember");
const { createGroup } = require('../controllers/directMessage/createGroup.controller');
const { invite_user } = require('../controllers/directMessage/invite.controller');
const { getGroups, getMembers, } = require('../controllers/directMessage/group.controller');
const { sendMessage, getMessages } = require('../controllers/directMessage/message.controller');




router.post("/creategroup", checkJWT, createGroup);
router.post("/:groupId/inviteuser", checkJWT, checkMember, invite_user)
router.post("/:groupId", checkJWT, checkMember, sendMessage);

router.get("/", checkJWT, getGroups);
router.get("/:groupId", checkJWT, checkMember, getMessages);
router.get("/:groupId/getmembers", checkJWT, checkMember, getMembers);


module.exports = router;