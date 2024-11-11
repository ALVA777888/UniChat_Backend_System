const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { userPost, recent, allPost } = require("../home.controller");

router.get("/userpost",checkJWT,userPost);
router.get("/allpost",checkJWT,allPost);
router.get("/recent",recent);

module.exports = router;
