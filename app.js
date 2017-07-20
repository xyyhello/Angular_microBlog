var express = require("express");
var mongoose = require("mongoose");
var router = require("./routes/router.js");
var session = require('express-session')
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

//mongoose的链接业务，非常精简，没有什么难度
mongoose.connect('mongodb://localhost:27017/shuoshuo');

//设置session
//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'kaola', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

//两个东西需要静态化，一个是static文件夹，如果项目上线的时候，使用其他服务器，此时就不需要静态这个文件夹了。另一个就是ngApp文件夹
app.get("/" , router.showIndex);
app.use("/static",express.static("static"));
app.use("/app",express.static("ngApp"));
app.get("/checkuser",router.checkuser);         //判断用户是否存在
app.post("/user",router.addUser);               //添加用户
app.post("/login",router.login)                 //登录
app.get("/checklogin",router.checklogin);       //检查是否已经登录
app.get("/logout",router.logout);               //退出登录
app.get("/user/:email",router.getuser);         //查询某个用户的资料
app.post("/user/:email",router.updateuser);     //查询某个用户的资料
app.post("/up",router.up);                      //上传头像
app.post("/cut",router.cut);                    //裁切头像
app.post("/posts/",function(req,res){
    router.fabiao(req,res,io);
});                                             //发表说说
app.get("/posts/",router.getAllPost);           //得到所有说说
app.get("/posts/:id",router.getthepost);         //得到某一个说说
app.post("/comment/:id",router.postcomment);     //评论某一个帖子


http.listen(8088,function(err){
    if(err){
        console.log("服务器打开失败");
    }else{
        console.log("服务器开启成功，端口号8088");
    }
});