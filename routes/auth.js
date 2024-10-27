const jwt = require("jsonwebtoken");
const config = require("../config");
const router = require("express").Router();
const checkJWT = require("../middleware/checkJWT");
const destroyJWT = require("../middleware/destroyJWT");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcrypt");
const {UserAccount,InvalidToken} = require("../db/User");
const { Collection } = require("mongoose");

//ここではログイン関係を管理しているスクリプトになる

//ユーザー新規登録API
router.post("/signup", body("email").isEmail(), body("password").isLength({ min: 6 }), async (req, res) => {
    try {
        // Postされたbodyの内容を各変数に入れている
        const email = req.body.email;
        const password = req.body.password;
        const userid = req.body.userid; // ここで正しく取得できているか確認

        // useridがundefinedまたは空文字列でないかチェック
        if (!userid) {
            return res.status(400).json({
                message: "ユーザIDが提供されていません",
            });
        }

        // パスワードの暗号化など残りのコード...
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "サーバーエラーが発生しました",
        });
    }
});



//ログインAPI
router.post("/login", body("email").isEmail(), body("password").isLength({min: 6 }), async (req, res) => {
    
    
    //バリデーションのリザルト
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(
        {   
            errors: errors.array(),
            message: "パスワードまたは、メールアアドレスの要件を満たしていません",
        });
    }

    const {email, password} = req.body;
    //ユーザーのメールアドレス登録状況参照
    const user = await UserAccount.findOne({ mail: email });
    if(!user){
        return res.status(400).json(
            {
                message: "そのユーザーは登録されていません",
            }
        );
    }

    //パスワードの複合、参照
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json(
            {
                message: "パスワードが違います",
            },
        );
    }


    const { userid } = user;  // これはDBからメールアドレスをもとにUserIDを取得している
    const token = await jwt.sign(
        { email, userid },
        config.jwt.secret,
        config.jwt.options
    );
    
    //トークンを返す
    return res.json({
        token: token,
        message: "ログイン成功",
    });
})

//オートログインAPI
router.post("/autologin",checkJWT, async (req,res) =>{
    //トークンによる自動的なログイン　TODO:いずれはloginと統合したい
    return res.json({
        message: "オートログイン完了",
    });
})

//ログアウトAPI
router.post("/logout", checkJWT,destroyJWT,async(req,res) => {
    return res.json({
        message: "ログアウト完了。現在のトークンを破棄しました",
    });
});


//DBにあるユーザーの確認※削除予定
router.get("/allUser", async(req, res) => {
    const Users = await UserAccount.find({})
    res.send(Users);
});

module.exports = router;