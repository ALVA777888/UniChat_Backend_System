const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("./config");
const auth = require("./routes/auth");

const PORT = 3000; //ローカルで使用するPORTを指定


app.use(express.json());//サーバーでJsonを使えるように設定
app.use("/auth", auth);//authを指定してWebAPIを構築できるようにする


app.listen(PORT, () => {
    console.log("Running");
});

app.get("/", (req, res) => {
    res.send("Hello UniChat Server");
});
    
