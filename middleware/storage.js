const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ファイルの保存先を設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join('uploads', req.userObjectId);
        // ディレクトリが存在しない場合は作成
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let filepath = Date.now() + path.extname(file.originalname);
        const ext = path.extname(file.originalname); // 拡張子取得
        if (req.params.filename) {
            filepath = req.params.filename + ext;
        }
        const setFilename = filepath; // ここでsetFilenameを定義
        cb(null, setFilename);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // ファイルサイズの制限を10MBに設定
        fields: 10, // フィールドの数を制限
        files: 1 // ファイルの数を制限
    }
});

module.exports = upload.single('file');