const { UserAccount } = require("../db/User");
const { DirectMessage } = require("../models/directmessage");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();


//グループを作成
const addgroup = async(req,res) => {
    try{
        const userid = req.user.userid;
        const groupname = req.body.groupname;
        const members = req.body.members;
        const groupid = uuidv4();
        const ID = process.env.DMDBID;

        const user = await UserAccount.findOne({userid : userid});
        let DB = await DirectMessage.findOne({ID:ID});
        

        if(!DB){
            const createDB = new DirectMessage({
                ID: ID,
            });
            await createDB.save();
            DB = createDB;
        }
        

        const new_group = {
            groupId: groupid,
            groupname: groupname,
            members: [userid,...members],
            messages: []
        };

        DB.groups.push(new_group);
        await DB.save();
        user.groupId.push(groupid);
        await user.save();
        
        res.json({
            message: "グループチャットが作成されました",
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "グループチャットの作成に失敗しました",
        })
    }

};

//グループを取得
const getgroups = async(req,res) => {
    try{
        const getgroupsName = [];
        const userid = req.user.userid;
        const user = await UserAccount.findOne({userid : userid})
        const user_groupIds = user ? user.groupId : [];
        

        for(const id of user_groupIds){
            const directMessageUser = await DirectMessage.findOne({ "groups.groupId": id });

            if(directMessageUser){
                const group = directMessageUser.groups.find(group => group.groupId === id);
                if(user){
                    if(group){
                        getgroupsName.push(group.groupname);
                    }
    
                }
            }


        }

        return res.json(getgroupsName);

        // let DB = await DirectMessage.findOne({ID:ID});


        // if(DB){
        //     return res.json(DB);
        // } else {
        //     return res.status(400).json({
        //         message: "グループはまだありません",
        //     })
        // }

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "グループの取得に失敗しました",
        })
    }
    
};

//メッセージを送信
const sendmessage = async(req,res) =>{
    try{
        const userid = req.user.userid;
        const contents = req.body.contents;
        const groupId = req.params.groupId;
        if(!contents){
            return res.status(400).json({
                message: "送信するメッセージが空です",
            })
        }

        const DB = await DirectMessage.findOne({userId : userid});
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
        const userid = req.user.userid;
        const groupId = req.params.groupId;
    
        const DB = await DirectMessage.findOne({userId : userid});
        const group = DB.groups.find(g => g.groupId === groupId);
        if(group)
        {
            return res.json(group.messages)
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

module.exports = { addgroup, getgroups, getmessages, sendmessage };