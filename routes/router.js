var path = require("path");
var User = require("../models/User.js");
var Post = require("../models/Post.js");
var Comment = require("../models/Comment.js");
var formidable = require('formidable');
var fs = require("fs");
var gm = require('gm');

//显示首页
exports.showIndex = function(req,res){
    res.sendFile(path.join(__dirname , "../index.html"));
}

//查看用户名是否被占用，JSON接口
exports.checkuser = function(req,res){
    //得到get请求
    var email = req.query.email;

    User.checkexist(email,function(trueorfalse){
        res.json({"result" : trueorfalse});
    });
}

//增加用户
exports.addUser = function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        //创建学生，业务不要写在路由里面，要写在Model里面
        User.addUser({
            "email" : fields.email,
            "password" : fields.mima1
        },function(isSuccess){
            if(isSuccess){
                res.json({"result" : true});
            }else{
                res.json({"result" : false});
            }
        });
    });
}

//检查用户登录
exports.login = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
         //调用方法，验证用户名是否存在
        User.checkexist(fields.email,function(trueorfalse){
            if(trueorfalse == false){
                res.json({"result" : -1});  //-1表示用户名不存在
            }else{
                //在存在的基础上，验证密码
                User.checkpassword(fields.email , fields.password , function(torf){
                    if(torf){
                        //密码通过，下发session
                        req.session.login = true;
                        req.session.email = fields.email;
                        res.json({"result" : 1});
                    }else{
                        //密码错误
                        req.session.login = false;
                        res.json({"result" : -2});
                    }
                });
            }
        });
    });
}


exports.checklogin = function(req,res){
     if(!req.session.login){
        req.session.login = false;
    }
    if(!req.session.email){
        req.session.email = "";
    }
    res.json({"login" : req.session.login , "email" : req.session.email});
}

exports.logout = function(req,res){
    req.session.login = false;
    req.session.email = "";
    res.send("ok");
}

//查询某个用户资料
exports.getuser = function(req,res){
    var email = req.params.email;
    //通过模型来查询
    User.FindByEmail(email,function(user){
         if(user){
            //不能显示密码，删除键
            user.password = "";
            res.json(user);
        }else{
            res.json({});
        }
    });
}

//更改学生
exports.updateuser = function(req,res){
    var email = req.params.email;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //表单内容
        //调用方法
        User.updateByEmail(fields.email,fields,function(err,results){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}


//上传
exports.up = function(req,res){
    //① 拿到用户要求的名字，是用户的email
    var name = req.query.name;
    var form = new formidable.IncomingForm();
    //上传文件夹
    form.uploadDir = path.join(__dirname , "../static/uploads");
    // ② 上传
    form.parse(req, function(err, fields, files) {
        var xinlujing = path.join(__dirname , "../static/uploads/" + name + ".jpg");

        if(!files.file) return;
        //③ 改名
        fs.rename(files.file.path , xinlujing ,function(){
            //④ 检测图片尺寸是否符合规则
            gm(xinlujing).size(function(err,size){
                // ⑤ 修正不符合宽高尺寸限制的图片
                gm(xinlujing).resize("600>","350>").write(xinlujing, function (err) {
                    if (!err) console.log("改变尺寸成功");
                    res.send("ok");
                });
            });
        });
    });
}


//裁切图片API接口
exports.cut = function(req,res){
    //① 拿到用户要求的名字，是用户的email
    var name = req.query.name;

    //② 拿到whxy四个参数
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var w = fields.w;
        var h = fields.h;
        var x = fields.x;
        var y = fields.y;

        console.log("接口已经获得参数" , w , h , x ,y);

        //裁切用户的头像
        var xinlujing = path.join(__dirname , "../static/uploads/" + name + ".jpg");
        gm(xinlujing).crop(w,h,x,y).resize(100,100,"!").write(xinlujing, function (err) {
            res.send("ok");
        });
    });
}

//发表说说
exports.fabiao = function(req,res,io){
    //得到用户的信息，email和帖子内容。
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //修正
        fields.time = new Date();
        //创建一个Post对象，然后保存。
        Post.fabiao(fields,function(err,results){
            //广播出去，有人发帖成功这个事儿！！
            io.emit("fatiechenggong",{"username" : req.session.email});
            res.send("ok");
        });
    });
};


//得到所有说说
exports.getAllPost = function(req,res){
    //得到用户传入的GET请求的参数，pagesize和page
    var pagesize = req.query.pagesize;
    var page = req.query.page;
    //until参数表示试图读取某一个id之后的所有新帖子
    var until = req.query.until;

    Post.getAll({"pagesize":pagesize , "page" : page , "until" : until},function(results){
        res.json({"results" : results});
    });
}

//得到某一个说说
exports.getthepost = function(req,res){
    var _id = req.params.id;


    //检索数据库，检查这个说说的细节
    Post.gettheshuoshuo(_id,function(data){
        //再次请求对这个说说的评论
        Comment.findComment(_id,function(data2){
            var r = {
                "email" : data.email,
                "content" : data.content,
                "time" : data.time,
                "comment" : []
            }
            //再次对人发出请求
            iterater(0);
            function iterater(i){
                if(i == data2.length){
                    res.json(r);
                    return;
                }

                var rr = {
                    "email" : data2[i].email,
                    "content" : data2[i].content,
                    "time" : data2[i].time
                }

                User.FindByEmail(data2[i].email,function(theuser){
                    console.log(theuser)
                    rr.nickname = theuser.nickname;
                    rr.avatar = theuser.avatar;

                    r.comment.push(rr);

                    iterater(++i);
                });
            }
        });
    });
}

//评论某一个说说
exports.postcomment = function(req,res){
    //得到帖子的id
    var id = req.params.id;
    //得到表单内容
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var email = req.session.email;
        var content = fields.content;

        Comment.fabiaopinglun({
            "email" : email,
            "content" : content,
            "id" : id
        },function(){
            res.send("号");
        })
    });
}
