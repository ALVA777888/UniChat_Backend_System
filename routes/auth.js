const jwt = require("jsonwebtoken");
const config = require("../config");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const UserAccount = require("../db/User");


//ユーザー新規登録API
router.post("/singup", body("email").isEmail(), body("password").isLength({min: 6 }), async(req, res) => 
    {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;

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
        });
        try{
            await UserID.save();
        } catch {
            res.status(500).json(
            {
                message: errors,
            });
        }
   
        
        //※テスト設計
        // User.push(
        //     {
        //         email,
        //         password: hashedPassword,
        //     }
        // );

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



//FakeDBにあるユーザーの確認
router.get("/allUser", async(req, res) => {
    const Users = await UserAccount.find({})
    res.send(Users);
});

module.exports = router;