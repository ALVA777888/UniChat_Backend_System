const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { getUserPost, getAllPost, getRecent, createPost, repost, likePost } = require("../controllers/post.controller");

router.post("/createpost", checkJWT, createPost);
router.post("/repost", checkJWT, repost);
router.post("/likepost", checkJWT, likePost);

router.get("/getuserpost",checkJWT,getUserPost);
router.get("/getallpost",checkJWT,getAllPost);
router.get("/getrecent",getRecent);


module.exports = router;
