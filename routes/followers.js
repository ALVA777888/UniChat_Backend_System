const express = require('express');
const router = express.Router();
const { getFollowers } = require('../controllers/follow/followers.controller');
const checkJWT = require('../middleware/checkJWT');

router.get('/:userId/followers', checkJWT, getFollowers);

module.exports = router;