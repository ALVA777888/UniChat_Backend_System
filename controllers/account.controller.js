const { UserAccount } = require('../models/user');
const bcrypt = require("bcrypt");
const { validateAlphanumeric } = require('../utils/utils');


const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const userObjectId = req.userObjectId;
    try {
        const user = await UserAccount.findOne({ _id: userObjectId });
        if (!user) {
            return res.status(400).json({
                message: "ユーザーが見つかりませんでした"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "パスワードが一致しません"
            });
        }

        //パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //DBを更新
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "パスワードを変更しました"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "パスワードの変更に失敗しました"
        });
    }
}

const changeAccountProfile = async (req, res) => {
    const userObjectId = req.userObjectId;
    try {
        const user = await UserAccount.findOne({ _id: userObjectId });
        if (!user) {
            return res.status(400).json({
                message: "ユーザーが見つかりませんでした"
            });
        }

        const CollegeName = req.body.collegename;
        const userid = req.body.userid;
        const username = req.body.username;
        const userBio = req.body.userbio;

        //半角英数のバリデーションチェック
        if (!validateAlphanumeric(userid)) {
            return res.status(400).json(
                {   
                    message: "UserIDは半角英数のみ有効です",
                });
        }

        //UserIDが空白かチェック
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

        //DBを更新
        user.collegeName = CollegeName || user.collegeName;
        user.userid = userid || user.userid;
        user.username = username || user.username;
        user.userBio = userBio || user.userBio;
        await user.save();

        return res.status(200).json({
            message: "プロフィールを更新しました"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "プロフィールの変更に失敗しました"
        });
    }
}

module.exports = { changePassword, changeAccountProfile };