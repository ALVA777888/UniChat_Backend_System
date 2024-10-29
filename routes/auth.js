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
router.post("/signup", body("email").isEmail(), body("password").isLength({min: 6 }), async(req, res) => 
    {
        //Postされたbodyの内容を各変数に入れている
        const email = req.body.email;
        const password = req.body.password;
        const userid = req.body.userid;
        const statuscode = "0000"; 

        //バリデーションのリザルト
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(
            {   
                errors: errors.array(),
                message: "パスワードまたは、メールアアドレスの要件を満たしていません",
            });
        }

        //DBに同じユーザが居るかのチェック
        const user_email = await UserAccount.findOne({ mail: email });
        if(user_email){
            return res.status(400).json(
            {
                message: "すでにそのメールアドレスは存在しています",
            });
        }

        //DBに同じユーザネームが居るかチェック
        const user_id = await UserAccount.findOne({ userid: userid });
        if(user_id){
            return res.status(400).json(
            {
                message: "すでにそのユーザネームは存在しています",
            });
        }  

        //パスワードの暗号化
        let hashedPassword = await bcrypt.hash(password, 10);

        //データベースに保存
        const UserID = new UserAccount({
            userid: userid,
            mail: email,
            password: hashedPassword,
            statuscode: statuscode
        });
        try{
            await UserID.save();
        } catch {
            res.status(500).json(
            {
                message: errors,
            });
        }
 
        //クライアントへJWTの発行
        const token = await jwt.sign(
            {
                email,
                userid,
            },
            config.jwt.secret,
            config.jwt.options,
        );

        //トークンを返す、これは、将来的にはcookieにあるトークンと照合する
        return res.json({
            token: token,
            message: "アカウント作成完了"
        });

    }
);



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