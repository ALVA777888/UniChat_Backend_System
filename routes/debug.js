const router = require("express").Router();
const {get_alluser,get_allposts,make_fakeuser} = require("../test/debug.controller")


router.get("/allUser",get_alluser);
router.get("/allPost",get_allposts);

router.post("/makeFakeUser",make_fakeuser);

module.exports = router;