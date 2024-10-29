const router = require("express").Router();
const {get_alluser,get_allposts} = require("../test/debug.controller")


router.get("/allUser",get_alluser);
router.get("/allPost",get_allposts);

module.exports = router;