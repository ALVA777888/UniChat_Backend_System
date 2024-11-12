const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");
const { validateMembers } = require("../../utils/validation");
const { invite } = require("./invite.controller");

const { v4: uuidv4 } = require('uuid');
require("dotenv").config();



const DMDBID = process.env.DMDBID;

const findOrCreateDirectMessageDB = async() => {
    
    let DB = await DirectMessage.findOne({ID:DMDBID});
    if(!DB){
        const createDB = new DirectMessage({
            ID: DMDBID,
        });
        await createDB.save();
        DB = createDB;
    };
    return DB;
}

//グループを作成
const createGroup = async (req,res) => {

    try{
        const userid = req.user.userid;
        const groupname = req.body.groupname;
        const members = [...new Set(req.body.members)];//同じメンバーIDがある場合は消す
        const groupid = uuidv4();
        
           
        //グループ名、jsonが空の場合
        if (!req.body || Object.keys(req.body).length === 0 || !groupname) {
            return res.status(400).json({
                message: "何も入力されていません"
            });
        };

        //メンバーが存在する場合
        if(members.length != 0){
            //招待するメンバーのバリデーションチェック
            const result = await validateMembers(members, groupid, userid);

            if(result.ok == false){
                return res.status(400).json({
                    message: result.message,
                    err_users: result.err_users
                });
            };
        };
        

        //仮でつけてるID、スキーマを何かしらの形で分けたいなと思っている
        let DB = await findOrCreateDirectMessageDB();

        //グループを作成
        DB.groups.push({
            groupId: groupid,
            groupname: groupname,
            members: [userid],
            messages: []
        });
        await DB.save();
      
        //メンバーを招待する
        const result = await invite(members, groupid);
        if(result.ok == false){//招待中にエラーがあったら
            return res.status(400).json({
                message: result.message,
            }
        )};

        
        //招待主のユーザー情報にグループを追加
        const user = await UserAccount.findOne({userid : userid});
        user.groups.push({
            groupId: groupid,
            isApproved: true
        });
        await user.save();
        
        //完了
        res.status(200).json({
            message: "グループチャットが作成され、ユーザーを招待しました。承認してもらうと正式に参加されます。",
            Invited_user: members,
            link: groupid,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "グループチャットの作成に失敗しました",
        })
    }

};

module.exports = { createGroup };