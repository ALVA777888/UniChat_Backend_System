const express = require("express");
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");
const config = require("./config");
const mongoose = require("mongoose");

const PORT = 3000; //ローカルで使用するPORTを指定
mongoose.connect("mongodb://localhost:27017/UniChat"
    // "mongodb+srv://UniChat:"+config.database.passkey+"@cluster0.ndoak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ).then(() => console.log("Database connected"))
    .catch((err) => console.log(err)
);

app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする
app.use("/post", post);


app.listen(PORT, () => {
    console.log("Running");
});
