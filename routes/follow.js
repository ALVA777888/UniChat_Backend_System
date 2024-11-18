const router = require("express").Router();
const followUser = require('../controllers/follow/following.controller');
const checkJWT = require("../middleware/checkJWT");

router.post('/follow', checkJWT,followUser);

module.exports = router;