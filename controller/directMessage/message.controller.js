const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");
const { approval_permission, fetchMembers } = require("../../controller/directMessage/group.controller");
const { v4: uuidv4 } = require('uuid');
const { io } = require('../../server');


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

            // // 新しいメッセージをクライアントに通知
            // io.to(groupId).emit('newMessage', newMessage);
           
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
        const { limit, offset } = req.query;
        const DB = await DirectMessage.findOne({ID : ID});
        const group = DB.groups.find(g => g.groupId === groupId);

        // クエリパラメータを数値に変換
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);

        if(group)
        {
            // 最新のメッセージから指定された数を取得
            const contents = group.messages.reverse().slice(offsetNum, limitNum+offsetNum).reverse();
            return res.json({
                contents: contents,
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