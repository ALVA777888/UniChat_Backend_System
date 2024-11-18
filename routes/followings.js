const express = require('express');
const router = express.Router();
const { getFollowers } = require('../controllers/follow/followings.controller');
const checkJWT = require('../middleware/checkJWT');

router.get('/:userId/followings', checkJWT, getFollowers);

module.exports = router;
