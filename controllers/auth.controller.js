const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const {UserAccount} = require("../models/user");
const { validateAlphanumeric } = require("../utils/utils")
const { v4: uuidv4 } = require('uuid');


//ここではログイン関係を管理しているスクリプトになる

//ユーザー新規登録API
const signup = async(req, res) => 
    {
        try{
            //Postされたbodyの内容を各変数に入れている
            const email = req.body.email;
            const password = req.body.password;
            const CollegeName = req.body.collegename;
            const userid = req.body.userid;
            let username = req.body.username;
            const statuscode = "0000"; 

            //半角英数のバリデーションチェック
            if (!validateAlphanumeric(userid)) {
                return res.status(400).json(
                    {   
                        message: "UserIDは半角英数のみ有効です",
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
    
            //クライアントへJWTの発行
            const token = await jwt.sign(
                {
                    email,
                    userObjectId: UserID._id,
                },
                config.jwt.secret,
                config.jwt.options,
            );

            //トークンを返す、これは、将来的にはcookieにあるトークンと照合する
            return res.json({
                token: token,
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




module.exports = { signup, login, auto_login, logout };