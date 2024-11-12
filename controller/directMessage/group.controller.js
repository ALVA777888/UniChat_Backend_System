const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");


//グループを取得
const getGroups = async (req, res) => {
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
const getMembers = async(req,res) => {
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
};

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

module.exports = { getGroups, getMembers, approval_permission };