const express = require('express');
const router = express.Router();
const { getFollowers } = require('../controllers/followers.controller');

router.get('/:userId/followers', checkJWT, getFollowers);

module.exports = router;