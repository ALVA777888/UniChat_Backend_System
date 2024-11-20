const { UserAccount } = require("../models/user");
const { DirectMessage } = require("../models/directmessage");
const { getUserID } = require("./accountHelper");
const mongoose = require("mongoose");

const validateMembers = async (members_ObjectId, groupid, userObjectId) => {

    const err_users = [];
    try {
        const groups = await DirectMessage.findOne({ "groups.groupId": groupid });

        //メンバーがいない場合
        if(!Array.isArray(members_ObjectId) || members_ObjectId == ""){
            return{
                message: "メンバーがいません。メンバーを追加してください",
                ok: false
            };
        };
        
        // 配列内の各要素をObjectIdに変換
        const objectIds = members_ObjectId.map(id => {
            try {
                return new mongoose.Types.ObjectId(id);
            } catch (err) {
                err_users.push(id);
                return null;
            }
        }).filter(id => id !== null);

        //メンバーに対してバリデーションチェック
        for (const objectId of objectIds) {
            const user = await UserAccount.findOne({ _id : objectId });
            if (!user) { // ユーザーが存在しなかったら
                err_users.push(objectId);
                continue;
            }

            if (userObjectId == objectId) { // 招待したユーザの中に自分がいたら
                return { message: "自分を招待することはできません", err_users: [objectId], ok: false };
            }

            // すでにメンバーに存在した場合
            if(groups){
                const group = groups.groups.find(g => g.groupId === groupid);
                const IsMember = group.members.includes(objectId);
                if (IsMember) {
                    return { message: "すでに招待済みのユーザーが存在します", err_users: [objectId], ok: false };
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