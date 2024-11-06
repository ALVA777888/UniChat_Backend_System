const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { userpost, recent, allpost } = require("../home.controller");

router.get("/userpost",checkJWT,userPost);
router.get("/recent",recent);
router.get("/allpost",checkJWT,allPost)

module.exports = router;
