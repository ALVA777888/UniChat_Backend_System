const express = require("express");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const config = require("./config");

const auth = require("./routes/auth");
const post = require("./routes/post");
const dm = require("./routes/directmessage");
const follow = require('./routes/follow');
const contents = require("./routes/contents");
const UserAccount = require("./routes/account");

const debug = require("./routes/debug")//デバッグ用のルート

const server = http.createServer(app);
const mongoose = require("mongoose");
const PORT = 3000; //ローカルで使用するPORTを指定

// CORS設定
app.use(cors({
    origin: 'https://ff-debug-service-frontend-free-ygxkweukma-uc.a.run.app', // FlutterFlowのデバッグ環境のURLを指定
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

mongoose.connect(config.database.url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));//DB接続

    
app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする
app.use("/dm", dm);
app.use("/post", post);
app.use("/follow", follow);
app.use("/contents", contents);
app.use("/account", UserAccount);

app.use("/debug", debug);



app.listen(PORT, () => {
    console.log("Running");
});