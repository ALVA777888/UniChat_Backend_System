const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");
const config = require("./config");
const dm = require("./routes/directmessage");

const follow = require('./routes/follow');


const debug = require("./routes/debug")

const server = http.createServer(app);
const io = socketIo(server);
const mongoose = require("mongoose");
const followUser = require("./controllers/follow/following.controller");

const PORT = 3000; //ローカルで使用するPORTを指定

mongoose.connect(config.database.url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));//DB接続

    
app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする
app.use("/dm", dm);
app.use("/post", post);
app.use("/follow", follow);

app.use("/debug", debug);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Client joined group ${groupId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.listen(PORT, () => {
    console.log("Running");
});

module.exports = { io };