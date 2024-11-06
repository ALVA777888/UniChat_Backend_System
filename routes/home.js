const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { userPost, allPost, recent } = require("../controller/home.controller");

router.get("/userpost",checkJWT,userPost);
router.get("/recent",recent);
router.get("/allpost",checkJWT,allPost)

module.exports = router;
