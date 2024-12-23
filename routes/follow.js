const router = require("express").Router();
const addFollow = require('../controllers/follow/follow.controller');
// const { myFollowings, userFollowings } = require("../controllers/follow/followings.controller");
// const { myFollowers, userFollowers } = require("../controllers/follow/followers.controller");

const { myFollowers, userFollowers,myFollowings, userFollowings, isFollowing  } = require("../controllers/follow/followList.controller");

const checkJWT = require("../middleware/checkJWT");

router.post('/addfollow', checkJWT,addFollow);

router.get('/myfollowers', checkJWT,myFollowers);
router.post('/userfollowers', checkJWT,userFollowers);

router.get('/myfollowings', checkJWT,myFollowings);
router.post('/userfollowings', checkJWT,userFollowings);

router.post('/isfollowing', checkJWT,isFollowing);



module.exports = router;