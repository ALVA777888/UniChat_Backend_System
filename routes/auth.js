const jwt = require("jsonwebtoken");
const config = require("../config");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../db/User");//疑似データベース！削除または無効化するように！

router.get("/", (req, res) => {
    res.send("Hello Auth");
});



//ユーザー新規登録API
router.post("/singup", body("email").isEmail(), body("password").isLength({min: 6 }), async(req, res) => 
    {
        const email = req.body.email;
        const password = req.body.password;
        // const Username = req.body.username;

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
        const user = User.find((user) => user.email === email);
        if(user){
            return res.status(400).json(
            {
                message: "すでにそのユーザは存在しています",
            });
        }

        //パスワードの暗号化
        let hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        //データベースに保存※テスト設計
        User.push(
            {
                email,
                password: hashedPassword,
            }
        );

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
    const user = User.find((user) => user.email === email);
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





// function auth(req, res, next){
//     try{
//         const token = req.headers.token;
//         if (!token) {
//             throw new Error("トークンがありません");
//         }
//         const decoded = jwt.verify(token, config.jwt.secret);
//         console.log(decoded);
//         next();
//     } catch (err){
//         console.log("Ye");
//         return res.send(401).json({
//             msg: "認証できません"
//         });
//     }
// }

//FakeDBにあるユーザーの確認
router.get("/allUser", (req, res) => {
    return res.json(User);
});

module.exports = router;