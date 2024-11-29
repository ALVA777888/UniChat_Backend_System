const router = require("express").Router();
const { getFiles, uploadFiles } = require('../controllers/ContentsController/contentsFiles.controller');
const checkJWT = require('../middleware/checkJWT');
const Storage = require('../middleware/storage');

router.post("/upload/:filename?", checkJWT, Storage, uploadFiles);
router.get("/files/:userID/:filename",  getFiles);

module.exports = router;