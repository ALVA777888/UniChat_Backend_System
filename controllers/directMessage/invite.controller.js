const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");
const { validateMembers } = require("../../utils/validation");


//グループに招待(API)
const invite_user = async(req, res) => {
    try{
        const { groupId } = req.params; 
        const userObjectId = req.userObjectId;
        let members_ObjectId = req.body.members;
        members_ObjectId = [...new Set(members_ObjectId)];//重複するユーザーIDを削除

        let result = await validateMembers(members_ObjectId, groupId, userObjectId);//メンバーに対してバリデーションチェック
        if(result.ok){
            result = await invite(members_ObjectId, groupId);//メンバーを招待
        };
        
        //招待中にエラーがあったら
        if(!result.ok){
            return res.status(400).json({
                message: result.message,
                err_users: result.err_users
            })
        }
    
        return res.status(200).json({
            message: "ユーザーを招待しました。承認してもらうと正式に参加されます。",
            members_ObjectId
        })

    } catch(err) {    
        console.log(err);
        return res.status(500).json({
            message: "招待中にエラーが発生しました",
        });
    }
};

//グループに招待
const invite = async(members_ObjectId, groupid) => {
    try{
        const groups = await DirectMessage.findOne({ "groups.groupId": groupid });
        const group = groups.groups.find(g => g.groupId === groupid);
        for(const id of members_ObjectId){
            const user = await UserAccount.findOne({_id : id});
            //招待先のユーザー情報にグループを追加
            user.groups.push({
                groupId: groupid,
                isApproved: false
            })
            await user.save();

            //サーバー側のグループにメンバーを追加
            group.members.push(id);
            
        };

        await groups.save();
        return { message: "全てのユーザーが招待されました", ok: true };

    } catch(err) {
        console.log(err);
        return { message: "招待中にエラーが発生しました", ok: false };
    }
};

module.exports = { invite, invite_user };
