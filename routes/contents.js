const router = require("express").Router();
const { getFiles, uploadFiles } = require('../controllers/ContentsController/contentsFiles.controller');
const checkJWT = require('../middleware/checkJWT');

router.post("/upload/:filename?", checkJWT, uploadFiles);
router.get("/files/:userID/:filename/", getFiles);
// router.post("/process-data",  processData); // 新しいルートを追加

module.exports = router;