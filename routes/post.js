const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { getMyPost, getFollowingsPost, getAllPost, getRecent, createPost, repost, likePost } = require("../controllers/post.controller");

router.post("/createpost", checkJWT, createPost);
router.post("/repost", checkJWT, repost);
router.post("/likepost", checkJWT, likePost);

router.get("/getmypost",checkJWT,getMyPost);
router.get("/getfollowingspost",checkJWT,getFollowingsPost);
router.get("/getallpost",checkJWT,getAllPost);
router.get("/getrecent",getRecent);


module.exports = router;
