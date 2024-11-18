const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { post, getposts } = require("../controllers/post.controller");


router.post("/post", checkJWT, post);
router.get("/getpost", checkJWT, getposts);

module.exports = router;
