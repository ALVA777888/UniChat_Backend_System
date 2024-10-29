const { DirectMessage } = require("../models/directmessage");
const { v4: uuidv4 } = require('uuid');

//グループを作成
const addgroup = async(req,res) => {
    try{
        const userid = req.user.userid;
        const groupname = req.body.groupname;
        const members = req.body.members;
        const groupid = uuidv4();

        let DB = await DirectMessage.findOne({userId : userid});

        if(!DB){ //DB上にすでに同じアカウントで存在しているかを確認
            const createDB = new DirectMessage({
                userId: userid,
            });
            await createDB.save();
            DB = createDB;
        }

        DB.groups.push({
            groupId: groupid,
            groupname: groupname,
            members: [userid,...members],
            messages: []
        });
        await DB.save();

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
        const userid = req.user.userid;
        const DB = await DirectMessage.findOne({userId : userid});
        if(DB){
            return res.json(DB);
        } else {
            return res.status(400).json({
                message: "グループはまだありません",
            })
        }

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
    console.log("fed");
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