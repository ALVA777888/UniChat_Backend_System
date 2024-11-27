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
        const ext = path.extname(file.originalname)//拡張子取得
        if(req.params.filename){
            filepath = req.params.filename+ext
        }
        const setFilename = filepath // ここでsetFilenameを定義
        cb(null, setFilename);
        
    }
});

const upload = multer({ 
    
    storage,
    limits: {
        fieldSize: Infinity, // フィールドの値の長さを無制限に設定
        fileSize: Infinity, // ファイルサイズの制限を無制限に設定
        fields: Infinity, // フィールドの数を無制限に設定
        files: Infinity // ファイルの数を無制限に設定
    }
});

module.exports = upload.single('file');