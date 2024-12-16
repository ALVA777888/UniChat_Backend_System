const iconv = require('iconv-lite'); // iconv-liteライブラリをインポート


const encodeData = (data) => {
    const latin1Encoded = iconv.encode(data, 'latin1'); // latin1エンコード
    const base64Encoded = Buffer.from(latin1Encoded).toString('base64'); // base64エンコード
    return base64Encoded;
};

module.exports = { encodeData };