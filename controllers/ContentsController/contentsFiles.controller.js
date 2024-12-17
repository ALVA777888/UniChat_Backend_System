const path = require('path');
const fs = require('fs');
const upload = require('../../middleware/storage'); // storage.jsからミドルウェアをインポート
// const { encodeData } = require('../../utils/encodeUtils'); // encodeUtils.jsからエンコード関数をインポート

const uploadFiles = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err); // エラーメッセージをログに出力
            return res.status(400).json({ message: 'ファイルのアップロードに失敗しました', details: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'ファイルのアップロードに失敗しました' ,details: 'ファイル名の指定がありません' });
        }
        const timestamp = new Date().getTime();
        res.status(201).json({ 
            message: 'ファイルのアップロードに成功しました',
            filename: req.file.filename,
            url: `http://localhost:3000/contents/files/${req.userObjectId}/${req.file.filename}/?timestamp=${timestamp}`
        });
        console.log(req.file.filename);
    });
};

const getFiles = async (req, res) => {
    const userFileDir = req.params.userID;
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', userFileDir, filename);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        // const base64Data = encodeData(filePath);
        // res.status(200).json({ base64Data });
        res.sendFile(filePath);
    } else {
        res.status(404).json({ err: 'ファイルが見つかりません' });
    }
};


// const processData = (req, res) => {
//     const rawData = req.body.data; // リクエストボディからデータを取得
//     const base64Data = encodeData(rawData); // データをエンコード
//     res.status(200).json({ base64Data });
// };

module.exports = { getFiles, uploadFiles };