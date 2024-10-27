const express = require("express");
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");
const config = require("./config");
const mongoose = require("mongoose");
const home = require("./routes/home");

//大元のサーバー部分

const PORT = 3000; //ローカルで使用するPORTを指定
mongoose.connect(config.database.url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));//DB接続

app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする
app.use("/post", post);
app.use("/home", home);


app.listen(PORT, () => {
    console.log("Running");
});
