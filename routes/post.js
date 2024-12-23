const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { getUserPost, getMyPost, getFollowingsPost, getAllPost, getRecent, createPost, createReply, repost, likePost } = require("../controllers/post.controller");

router.post("/createpost", checkJWT, createPost);
router.post("/createreply", checkJWT, createReply);

router.post("/repost", checkJWT, repost);
router.post("/likepost", checkJWT, likePost);

router.get("/getmypost",checkJWT,getMyPost);
router.get("/getfollowingspost",checkJWT,getFollowingsPost);
router.get("/getallpost",checkJWT,getAllPost);
router.get("/getrecent",getRecent);
router.get("/getuserpost/:userObjectId",checkJWT,getUserPost);


module.exports = router;
