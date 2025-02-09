const mongoose = require("mongoose");

//DMのモデル

const directmessageSchema = new mongoose.Schema(
    {
        ID:String,
        groups:[  
            {            
                groupId: String,
                groupname: String,
                Inviter: String,
                members: [String],
                messages: [
                    {
                        id: String,
                        sender: String,
                        contents: String,
                        timeStamp: Date
                    }
                ]
            }      

        ]

   },
   { timestamps: true },
);

const DirectMessage = mongoose.model("DirectMessage", directmessageSchema);
module.exports = { DirectMessage };