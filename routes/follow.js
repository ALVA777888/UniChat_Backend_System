const express = require('express');
const router = express.Router();
const { followUser } = require('../controllers/follow/follow.controller');
const { unfollowUser } = require('../controllers/follow/unfollow.controller');
const checkJWT = require('../middleware/checkJWT');

router.post('/:userId/follow', checkJWT, followUser);
router.delete('/:userid/unfollow', checkJWT, unfollowUser);

module.exports = router;