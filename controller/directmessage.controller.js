const { UserAccount } = require("../models/user");
const { DirectMessage } = require("../models/directmessage");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const DMDBID = process.env.DMDBID;

const findOrCreateDirectMessageDB = async() => {
    
    let DB = await DirectMessage.findOne({ID:DMDBID});
    if(!DB){
        const createDB = new DirectMessage({
            ID: ID,
        });
        await createDB.save();
        DB = createDB;
    };
    return DB;
}

//グループを作成
const creategroup = async (req,res) => {

    try{
        const userid = req.user.userid;
        const groupname = req.body.groupname;
        let members = req.body.members;
        const groupid = uuidv4();
        const user = await UserAccount.findOne({userid : userid});

        members = [...new Set(members)];//同じメンバーIDがある場合は消す

        
        let DB = await findOrCreateDirectMessageDB();
        //仮でつけてるID、スキーマを何かしらの形で分けたいなと思っている
        
                
        //これもスキーマをとりあえず一つにするための仮設コード


        //修正する箇所
        DB.groups.push({
            groupId: groupid,
            groupname: groupname,
            members: [userid],
            messages: []
        });
        await DB.save();
        //修正する箇所

      
        if(members.length != 0){
            const err_users = await invite(members, groupid, userid);
            if(err_users.length != 0){
                return res.status(400).json({
                    message: err_users.message,
                    err_users: err_users.err_users

                })
            }
        };

        user.groups.push({
            groupId: groupid,
            isApproved: true
        });

        
        await user.save();
        
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

//グループに招待(API)
const invite_user = async(req, res) => {
    const { groupId } = req.params; 
    let { members } = req.body;
    const userid = req.user.userid;

    members = [...new Set(members)];

    const err_users = await invite(members, groupId, userid);
    if(err_users.length != 0){
        return res.status(400).json({
            message: err_users
        })
    }
    return res.status(200).json({
        message: "ユーザーを招待しました。承認してもらうと正式に参加されます。",
        members
    })
    
}

//グループに招待
const invite = async(members, groupid, userid) => {
    const err_users = [];
    const groups = await DirectMessage.findOne({ "groups.groupId": groupid });
    

    try{
        for(const id of members){
            const user = await UserAccount.findOne({userid : id});
            if(!user){ //ユーザーが存在しなかったら
                err_users.push(id);
                continue;
            }

            if(userid == id){//招待したユーザの中に自分がいたら
                return { message: "自分を招待することはできません", err_users: [id] };
            }
           

            //すでにメンバーに存在した場合
            const group = groups.groups.find(g => g.groupId === groupid);
            const IsMember = group.members.includes(id);
            if(IsMember){
                return { message: "すでに招待済みのユーザーが存在します", err_users: [id] };
            }  

         
        }

        //エラーユーザーが一人でもいたら
        if(err_users.length != 0){ 
            return { 
                message: "招待したユーザーが見つかりませんでした",
                err_users 
            };
        }

        //エラーユーザーが誰もいなかったら
        for(const id of members){
            
            const user = await UserAccount.findOne({userid : id});
            const group = groups.groups.find(g => g.groupId === groupid);
            user.groups.push({
                groupId: groupid,
                isApproved: false
            })

            group.members.push(id)

            await user.save();
            await groups.save();
        };

        return err_users;

    } catch(err) {
        console.log(err);
        return { message: "招待中にエラーが発生しました" };
    }
}

//グループを取得
const getgroups = async (req, res) => {
    try {
        const getgroupsName = [];
        const userid = req.user.userid;
        const user = await UserAccount.findOne({ userid: userid });

        if (!user) {
            return res.status(400).json({
                message: "ユーザーが見つかりませんでした。削除されている可能性があります"
            });
        }

        const user_groupIds = user.groups.map(group => group.groupId);
        if (!user_groupIds) {
            return res.status(400).json({
                message: "グループはありません。追加、または招待してもらいましょう"
            });
        }
        for (const id of user_groupIds) {
            const group = await DirectMessage.findOne({ "groups.groupId": id });
            if (group) {
                const matchingGroup = group.groups.find(g => g.groupId === id);
                const userGroup = user.groups.find(group => group.groupId === id); 
                if (matchingGroup) {
                    getgroupsName.push({
                        groups: matchingGroup.groupname,
                        url: matchingGroup.groupId,
                        isApproved: userGroup.isApproved
                    });
                }
            }
        }
        return res.json(getgroupsName);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "グループの取得に失敗しました",
        });
    }
};

//メンバーを確認
const getmembers = async(req,res) => {
    try{
        const { groupId } = req.params;
        const NotApproval = [];

        const groups = await DirectMessage.findOne({ "groups.groupId": groupId });
        const group = groups.groups.find(g => g.groupId === groupId);
        
        for(const userid of group.members){
            const user = await UserAccount.findOne({ userid: userid });
            const Approved = user.groups.find(group => group.groupId === groupId); 
            if(!Approved.isApproved){
                NotApproval.push(userid)
            }

        }
        
        
        return res.status(200).json({
            message: "メンバー取得成功",
            members: group.members,
            NotApproval: NotApproval
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "メンバーの取得に失敗しました"
        })
    }

}

//グループ参加に承諾
const approval_permission = async(userid, groupId) => {
    try{
        const user = await UserAccount.findOne({ userid: userid });
        const userGroup = user.groups.find(group => group.groupId === groupId); 
              
        userGroup.isApproved = true;
        await user.save();
        return { message: "グループに参加しました" }

    } catch(err) { 
        return { error: "参加中にエラーが発生しました" };
    }

}


//メッセージを送信
const sendmessage = async(req,res) =>{
    try{
        const userid = req.user.userid;
        const contents = req.body.contents;
        const isApproved = req.body.isApproved;
        const groupId = req.params.groupId;
        const ID = process.env.DMDBID;


        const user = await UserAccount.findOne({ userid: userid });
        const userGroup = user.groups.find(group => group.groupId === groupId); 

        //招待を承諾する
        if(isApproved == "OK" && userGroup.isApproved == false){
            const result = await approval_permission(userid, groupId);
            return res.status(200).json({
                result: result
            })
        }

        //招待の承諾がされていない場合は承認を促す。それまでメッセージの送信をできないようにする
        if(userGroup.isApproved == false){
            return res.status(400).json({
                message: "送信するにはグループに参加する必要があります。参加しますか？"
            })
        }

        //メッセージが空の場合は送信できないようにする
        if(!contents){
            return res.status(400).json({
                message: "送信するメッセージが空です",
            })
        }

        const DB = await DirectMessage.findOne({ID : ID});
        const group = DB.groups.find(g => g.groupId === groupId);
        
        if(group){
            const newMessage = {
                id: uuidv4(), 
                sender: userid, 
                contents: contents, 
                timeStamp: Date.now()
            };
            group.messages.push(newMessage);
            await DB.save();
            return res.json({
                message: "送信完了",
            });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "メッセージの送信に失敗しました",
        })
    }
};



//メッセージを取得
const getmessages = async(req,res) =>{
    try{
        const groupId = req.params.groupId;
        const ID = process.env.DMDBID;
        
    
        const DB = await DirectMessage.findOne({ID : ID});
        const group = DB.groups.find(g => g.groupId === groupId);
        if(group)
        {
            const contents = group.messages;
            return res.json({
                contents,
            })
        }else{
            return res.status(400).json({
                message: "グループが見つかりませんでした",
            });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "メッセージの取得に失敗しました",
        })
    }
};

module.exports = { creategroup, getgroups, getmessages, sendmessage, invite_user, getmembers };