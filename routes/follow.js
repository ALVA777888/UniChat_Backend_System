const express = require('express');
const router = express.Router();
const { followUser } = require('../controllers/follow.controller');
const { unfollowUser } = require('../controllers/unfollow.controller');

router.post('/:userId/follow', checkJWT, followUser);
router.delete('/:userid/unfollow', checkJWT, unfollowUser);

module.exports = router;