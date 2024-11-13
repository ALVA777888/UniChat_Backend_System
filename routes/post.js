const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const { post, getUserPost, getAllPost, getRecent } = require("../controllers/post.controller");


router.post("/post", checkJWT, post);

router.get("/getuserpost",checkJWT,getUserPost);
router.get("/getallpost",checkJWT,getAllPost);
router.get("/getrecent",getRecent);


module.exports = router;
