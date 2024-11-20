const { UserAccount } = require("../../models/user");
const { DirectMessage } = require("../../models/directmessage");
const { getUserID, getUserMap } = require("../../utils/accountHelper");
const { get } = require("mongoose");


//グループを取得
const getGroups = async (req, res) => {
    try {
        const getgroupsName = [];
        const userid = await getUserID(req.userObjectId);
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

//メンバーを削除
// const delUser_fromGroup = async (UniqueID, groupId) => {
//     try{
//         const user = await UserAccount.findOne({ UniqueID });
//         user.groups =  user.groups.filter(group => group.groupId !== groupId);
//         await user.save();

//         const groups = await DirectMessage.findOne({ "groups.groupId": groupId });
//         const group = groups.groups.find(g => g.groupId === groupId);


//         group.members = group.members.filter(member => member !== UniqueID);
//         await groups.save();
//     } catch(err) {
//         console.log(err);
//     };
// };



//メンバーを確認
const fetchMembers = async (groupId) => {
    try{
        const NotApproval = [];
        const members = [];
        const retiredMembers = [];

        const groups = await DirectMessage.findOne({ "groups.groupId": groupId });
        const group = groups.groups.find(g => g.groupId === groupId);
        
        for(const userObjectId of group.members){
            const user = await UserAccount.findOne({ _id:userObjectId });
            // console.log(user.groups);
            // if (!user) {
            //     // ユーザーが存在しない場合は退会したユーザーとして扱う
            //     retiredMembers.push(userObjectId);
            //     continue;
            // }

            // ユーザーがグループに参加しているか確認
            const Approved = user.groups.find(group => group.groupId === groupId); 
            if(!Approved){
                const result = await delUser_fromGroup(userObjectId, groupId);
                continue; //ユーザー側のDBで退出していればDMDBからも削除しコンテニューする
            };

            members.push(user._id);//メンバーのユーザーIDを格納
            if(!Approved.isApproved){
                NotApproval.push(user._id);//未加入メンバーのユーザーIDを格納
            }
        }

        console.log(members);
        const usernames = await getUserMap(members);
        const NotApproval_usernames = await getUserMap(NotApproval);
        retiredMembers.forEach(id => {
            usernames[id] = "退会したユーザー";
        });

        

        const result = {
            usernames,
            NotApproval: NotApproval_usernames,
        }
        
        return result;

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "メンバー情報の取得に失敗しました"
        })
    }
};

//メンバーを確認,API
const getMembers = async(req,res) => {
    try{
        const groupId = req.params.groupId;
        const result = await fetchMembers(groupId);

        return res.status(200).json({
            message: "メンバー取得成功",
            me: req.userObjectId,
            members: result.usernames,
            NotApproval: result.NotApproval,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "メンバー情報の取得に失敗しました"
        })
    }
};

//グループ参加に承諾
const approval_permission = async(userObjectId, groupId) => {
    try{
        const user = await UserAccount.findOne({ _id:userObjectId });
        const userGroup = user.groups.find(group => group.groupId === groupId); 
              
        userGroup.isApproved = true;
        await user.save();
        return { message: "グループに参加しました" }

    } catch(err) { 
        return { error: "参加中にエラーが発生しました" };
    }

}

module.exports = { getGroups, getMembers, fetchMembers, approval_permission };