const { UserAccount } = require("../models/user");


const searchUser = async (req, res) => {
    try {
        const searchWord = req.body.searchWord;
        const searchResult = await UserAccount.find({ username: { $regex: searchWord } });

        if (searchResult.length === 0) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }

        return res.json(searchResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "サーバーエラーが発生しました" });
    }
};

