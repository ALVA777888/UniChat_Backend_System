const express = require("express");
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");
const config = require("./config");
const dm = require("./routes/directmessage");
const debug = require("./routes/debug")

const mongoose = require("mongoose");

const PORT = 3000; //ローカルで使用するPORTを指定
mongoose.connect(config.database.url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));//DB接続

    
app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする

app.use("/post", post);

app.use("/debug", debug);


app.listen(PORT, () => {
    console.log("Running");
});