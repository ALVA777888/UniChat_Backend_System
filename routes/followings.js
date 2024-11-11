const express = require('express');
const router = express.Router();
const { getFollowings } = require('../controllers/followings.controller');

router.get('/:userId/followings', checkJWT, getFollowings);

module.exports = router;
