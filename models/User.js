var mongoose = require("mongoose");
var crypto = require("crypto");


//创建schema
var userSchema = mongoose.Schema({
    "email" : String,
    "password" : String,
    "avatar" : String,
    "brief" : String,
    "nickname" : String
});

// 在userSchema上面创建静态方法，
// 检查用户名是否存在
userSchema.statics.checkexist = function(email,callback){
    //this就表示这个表
    this.find({"email" : email},function(err,results){
        if(results.length == 0){
            callback(false);
        }else{
            callback(true);
        }
    });
}

//创建用户
userSchema.statics.addUser = function(JSON,callback){
    //存入数据库的密码是用sha256加密之后的密码，绝对不能用明码存密码！
    var sha256 = crypto.createHash("sha256");
    JSON.password = sha256.update(JSON.password).digest("hex");

    var self = this;
    this.checkexist(JSON.email,function(trueorfalse){
        if(trueorfalse == false){
            //this表示自己这个表，就是users这个collection
            self.create(JSON,function(err,results){
                if(err){
                    callback(false);
                }else{
                    callback(true);
                }
            });
        }else{
            callback(false);
        }
    });
}

//检查密码是否一样，这个方法一定能够保证用户名存在
userSchema.statics.checkpassword = function(email,password,callback){
    this.find({"email" : email},function(err,results){
        var theuser = results[0];
        if(!theuser){
            callback(false);
        }
        var pwd = theuser.password;  //数据库存储的加密之后的密码

        var sha256 = crypto.createHash("sha256");
        password = sha256.update(password).digest("hex");

        //验证密码是否相同
        if(password === pwd){
            callback(true);
        }else{
            callback(false);
        }
    })
}

//查询
userSchema.statics.FindByEmail = function(email,callback){
    this.find({"email" : email},function(err,results){
       callback(results[0]);
    });
}

//更新学生
userSchema.statics.updateByEmail = function(email,JSON,callback){
    User.find({"email" : email},function(err,results){
        var user = results[0];
        //修改
        if(JSON.nickname){
            user.nickname = JSON.nickname;
        }
        if(JSON.brief){
            user.brief = JSON.brief;
        }

        if(JSON.avatar){
            user.avatar = JSON.avatar;
        }
        user.save(callback);
    });
}

//根据schema创建模型！
var User = mongoose.model("User",userSchema);

//这个模型向外暴露一个Mongoose对象
module.exports = User;