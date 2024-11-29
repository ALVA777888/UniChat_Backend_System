const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const {UserAccount} = require("../models/user");
const {TempUser} = require("../models/user");
const { validateAlphanumeric } = require("../utils/utils")
const crypto = require('crypto');
const nodemailer = require('nodemailer');


//ここではログイン関係を管理しているスクリプトになる

// メール送信設定
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.mail.provider_address, // ここに自分のGmailアドレスを入力
        pass: config.mail.provider_address_key, // ここに生成したアプリパスワードを入力
    }
});

// 確認コードの生成
const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex'); // 6桁の確認コードを生成
};

const signup = async (req, res) => {
    try {
        const email = req.body.email;
        const verificationCode = generateVerificationCode();// 確認コードの生成と送信

        // DBに同じユーザが居るかのチェック
        const userObj = await UserAccount.findOne({ mail: email });
        if (userObj) {
                return res.status(400).json({
                    message: "すでにそのメールアドレスは存在しています",
            })
        };

        // 仮アカウントの作成
        let tempUserObj = await TempUser.findOne({ mail : email });
        if(tempUserObj){
            if(tempUserObj.result === true){
                return res.status(400).json({
                    message: "すでにそのメールアドレスは存在しています",
                });
            }else{
                tempUserObj.verificationCode = verificationCode;
            }
        } else {
            tempUserObj = await new TempUser({
                mail: email,
                verificationCode: verificationCode,
                result: false,
            });
        }
        await tempUserObj.save();

        await transporter.sendMail({
            from: config.mail.provider_address,
            to: email,
            subject: '確認コード',
            text: `あなたの確認コードは ${verificationCode} です。`
        });


        return res.status(200).json({
            url: tempUserObj._id,
            message: "確認コードを送信しました。メールを確認してください。",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバー側で何かしらのエラーが発生しました" });
    }
};

// 確認コードの検証関数
const verifyCode = async (req, res) => {
    try {
        const tempUserObjID = req.params.url;
        const verificationCode = req.body.verificationCode;

        const tempUserObj = await TempUser.findOne({ _id: tempUserObjID });
        if(tempUserObj.verificationCode === verificationCode){
            tempUserObj.result = true; 
            await tempUserObj.save();
            return res.status(200).json({
                message: "確認コードが正しいです",
                url: tempUserObjID,
            });
        }else{
            return res.status(400).json({
                message: "確認コードが正しくありません",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "認証中にエラーが発生しました" });
    }
};


//ユーザー新規登録API
const createAccount = async(req, res) => 
    {
        try{
            //Postされたbodyの内容を各変数に入れている
            const tempUserObjID = req.params.url;

            const password = req.body.password;
            let CollegeName = req.body.collegename;
            const userid = req.body.userid;
            let username = req.body.username;
            const statuscode = "0000"; 

            const tempUserObj = await TempUser.findOne({ _id: tempUserObjID });
            const email = tempUserObj.mail;

            if(tempUserObj.result === false){
                return res.status(400).json(
                    {
                        message: "仮登録が完了していません",
                    });
            }

            
            //半角英数のバリデーションチェック
            if (!validateAlphanumeric(userid)) {
                return res.status(400).json(
                    {   
                        message: "UserIDは半角英数のみ有効です",
                    });
            }
            if(userid === ""){
                return res.status(400).json(
                    {
                        message: "UserIDが空白です",
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
            const hashedPassword = await bcrypt.hash(password, 10);

            // データベースに保存
            const UserID = new UserAccount({
                userid: userid,
                username: username = username || userid,//usernameが登録されていなかったらuseridにする
                mail: email,
                CollegeName: CollegeName = CollegeName || "Unaffiliated",
                password: hashedPassword,
                statuscode: statuscode
            });

            try{
                await UserID.save();
            } catch (errors) {
                return res.status(500).json(
                {
                    message: errors,
                });
            }

            const test = await TempUser.findOneAndDelete({ _id: tempUserObjID });

            //クライアントへJWTの発行
            const token = await jwt.sign(
                {
                    email: email,
                    userObjectId: UserID._id,
                },
                config.jwt.secret,
                config.jwt.options,
            );

            //トークンを返す、これは、将来的にはcookieにあるトークンと照合する
            return res.json({
                token: token,
                myuserid: UserID._id,
                message: "アカウント作成完了"
            });

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: "アカウント作成中にサーバー側でエラーが発生しました。"                
            });
        }
    };



//ログインAPI
const login = async (req, res) => {
    
    try{
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


        const token = await jwt.sign(
            { 
                email, 
                userObjectId: user._id,
            },
            config.jwt.secret,
            config.jwt.options
        );
        
        //トークンを返す
        return res.json({
            token: token,
            myuserid: user._id,
            message: "ログイン成功",
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "ログイン中にサーバー側でエラーが発生しました。"                
        });
    }

};

//オートログインAPI
const auto_login = async (req,res) =>{
    //トークンによる自動的なログイン　TODO:いずれはloginと統合したい
    const userObjectId = req.userObjectId;
    const user = await UserAccount.findOne({ _id: userObjectId });
    if(user.isTemporaryAccount === true){
        return res.status(400).json(
            {
                message: "仮登録のユーザーです",
            }
        );
    }
    return res.json({
        message: "オートログイン完了",
    });
};

//ログアウトAPI
const logout = async(req,res) => {
    return res.json({
        message: "ログアウト完了。現在のトークンを破棄しました",
    });
};




module.exports = { signup, verifyCode, createAccount, login, auto_login, logout };