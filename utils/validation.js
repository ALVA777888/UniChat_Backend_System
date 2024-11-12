const { UserAccount } = require("../models/user");
const { DirectMessage } = require("../models/directmessage");

const validateMembers = async (members, groupid, userid) => {

    const err_users = [];
    try {
        const groups = await DirectMessage.findOne({ "groups.groupId": groupid });

        //メンバーがいない場合
        if(!Array.isArray(members) || members == ""){
            return{
                message: "メンバーがいません。メンバーを追加してください",
                ok: false
            };
        };

        //メンバーに対してバリデーションチェック
        for (const id of members) {
            const user = await UserAccount.findOne({ userid: id });
            if (!user) { // ユーザーが存在しなかったら
                err_users.push(id);
                continue;
            }

            if (userid == id) { // 招待したユーザの中に自分がいたら
                return { message: "自分を招待することはできません", err_users: [id], ok: false };
            }

            // すでにメンバーに存在した場合
            if(groups){
                const group = groups.groups.find(g => g.groupId === groupid);
                const IsMember = group.members.includes(id);
                if (IsMember) {
                    return { message: "すでに招待済みのユーザーが存在します", err_users: [id], ok: false };
                }
            }
        }

        // 存在しないユーザが一人でもいたら
        if (err_users.length != 0) {
            return {
                message: "招待したユーザーが見つかりませんでした",
                err_users,
                ok: false 
            };
        }

        // 全てのユーザーが有効だったら
        return { message: "招待されたすべてのユーザーが有効です", ok: true };

    } catch (err) {
        console.log(err);
        return { message: "アカウント参照中にエラー", err_users: [], ok: false };
    }

};

module.exports = { validateMembers };