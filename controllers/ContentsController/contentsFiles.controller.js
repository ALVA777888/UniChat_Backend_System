const path = require('path');
const fs = require('fs');

const uploadFiles = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'ファイルのアップロードに失敗しました' });
    }
    res.status(201).json({ file: req.file });
};

const getFiles = async (req, res, filedir) => {
    const userFileDir =  req.params.userID || req.userObjectId;
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', userFileDir, fileName);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ err: 'ファイルが見つかりません' });
    }
};

module.exports = { getFiles, uploadFiles };