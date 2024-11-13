const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { post, getUserPost, getAllPost, getRecent, createPost, repost } = require("../controllers/post.controller");


router.post("/createpost", checkJWT, createPost);
router.post("/:postId/repost", checkJWT, repost);

router.get("/getuserpost",checkJWT,getUserPost);
router.get("/getallpost",checkJWT,getAllPost);
router.get("/getrecent",getRecent);


module.exports = router;
