const jwt = require("jsonwebtoken");
const config = require("../config");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {UserAccount} = require("../db/User");

//ここではログイン関係を管理しているスクリプトになる

//ユーザー新規登録API
router.post("/signup", body("email").isEmail(), body("password").isLength({min: 6 }), async(req, res) => 
    {
        //Postされたbodyの内容を各変数に入れている
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
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

        //DBにユーザが居るかのチェック
        const user = await UserAccount.findOne({ mail: email });
        if(user){
            return res.status(400).json(
            {
                message: "すでにそのユーザは存在しています",
            });
        }

        //パスワードの暗号化
        let hashedPassword = await bcrypt.hash(password, 10);

        //データベースに保存
        const UserID = new UserAccount({
            username: username,
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
            },
            config.jwt.secret,
            config.jwt.options,
        );

        //トークンを返す、これは、将来的にはcookieにあるトークンと照合する
        return res.json({
            token: token,
            message: "アカウント作成完了",
        });

    }
);


//ログインAPI
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    //ユーザーの登録状況参照
    const user = await UserAccount.findOne({ mail: email });
    if(!user){
        return res.status(400).json([
            {
                message: "そのユーザーは登録されていません",
            },
        ]);
    }

    //パスワードの複合、参照
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json([
            {
                message: "パスワードが違います",
            },
        ]);
    }
    
    const token = await jwt.sign(
        {
            email,
        },
        config.jwt.secret,
        config.jwt.options,
    );
    
    //トークンを返す、これは、将来的にはcookieにあるトークンと照合する
    return res.json({
        token: token,
        message: "ログイン成功",
    });
})



//DBにあるユーザーの確認※削除予定
router.get("/allUser", async(req, res) => {
    const Users = await UserAccount.find({})
    res.send(Users);
});

module.exports = router;