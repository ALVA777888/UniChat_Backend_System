const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");
const { approval_permission, fetchMembers } = require("../../controller/directMessage/group.controller");
const { v4: uuidv4 } = require('uuid');


//メッセージを送信
const sendMessage = async(req,res) =>{
    try{
        const UniqueID = req.UniqueID;
        const contents = req.body.contents;
        const isApproved = req.body.isApproved;
        const groupId = req.params.groupId;
        const ID = process.env.DMDBID;


        const user = await UserAccount.findOne({ UniqueID });
        const userGroup = user.groups.find(group => group.groupId === groupId); 

        //招待を承諾する
        if(isApproved == "OK" && userGroup.isApproved == false){
            const result = await approval_permission(UniqueID, groupId);
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
                sender: UniqueID, 
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
const getMessages = async(req,res) =>{
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

module.exports = { sendMessage, getMessages };