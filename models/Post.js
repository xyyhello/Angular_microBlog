var mongoose = require("mongoose");
var crypto = require("crypto");
var User = require("./User.js");


//创建schema
var postSchema = mongoose.Schema({
    "email" : String,   //帖子是谁发表的
    "content" : String, //帖子的内容是什么
    "time" : Date,  //帖子的时间
    "like" : [String]   //帖子的点赞
});

//发表方法
postSchema.statics.fabiao = function(JSON,callback){
    //创建
    this.create(JSON,function(err,results){
        callback(err,results);
    });
}

//得到所有说说
postSchema.statics.getAll = function(JSON,callback){
    var pagesize = JSON.pagesize || 10;
    var page = JSON.page || 10;
    var until = JSON.until;
    var self = this;

    //这个接口很复杂，如果有until这个参数，此时就不分页。而是去寻找until这个id之前的所有帖子
    //
    if(until){
        this.find({"_id" : {$gt : until}}).sort({'_id':-1}).exec(function(err,results){
            var RESULTS = [];   //要返回的数组
            iterator(0);
            function iterator(i){
                if(i == results.length){
                    //迭代结束了
                    callback(RESULTS);
                    return;
                }
                //查询发这个帖子的人的昵称和头像
                User.find({"email" : results[i].email} ,function(err,users){
                    var theuser = users[0];
                    RESULTS.push({
                        "email" : results[i].email,
                        "_id" : results[i]._id,
                        "date" : results[i].time,
                        "content" : results[i].content,
                        "nickname" : theuser.nickname,
                        "avatar" : theuser.avatar
                    });
                    iterator(++i);
                });
            }
        });
        return;
    }

    //没有until参数的时候才分页
    //limit和skip共同制作了分页的接口，limit表示限制多少条目，skip表示越过多少条目。
    this.find({}).sort({'_id':-1}).limit(pagesize).skip(page * pagesize).exec(function(err,results){
        var users = {}; //查询过的所有信息，都存在这个对象中。key是email，v是JSON。简单的机器学习。面试的时候问你，怎么样提高查询的效率？大白话，查询过的你记住，不要老查询。这就是最最最最简单的机器学习。
        var RESULTS = [];   //要返回的数组

        iterator(0);
        function iterator(i){
            if(i == results.length){
                //迭代结束了
                callback(RESULTS);
                return;
            }
            //如果对象中已经有这项，说明之前已经查询过了
            if(users.hasOwnProperty(results[i].email)){
                //补充nickname和avatar两项推入数组

                RESULTS.push({
                    "email" : results[i].email,
                    "_id" : results[i]._id,
                    "date" : results[i].time,
                    "content" : results[i].content,
                    "nickname" : users[results[i].email].nickname,
                    "avatar" : users[results[i].email].avatar
                });

                iterator(++i);
            }else{
                //查询发这个帖子的人的昵称和头像
                User.find({"email" : results[i].email} ,function(err,users){
                    var theuser = users[0];
                    RESULTS.push({
                        "email" : results[i].email,
                        "_id" : results[i]._id,
                        "date" : results[i].time,
                        "content" : results[i].content,
                        "nickname" : theuser.nickname,
                        "avatar" : theuser.avatar
                    });
                    //机器学习一下
                    users[results[i].email] = results[i];

                    iterator(++i);
                });
            }
        }
    });
}

//得到某一条说说
postSchema.statics.gettheshuoshuo = function(_id , callback){
    this.find({"_id" : _id} , function(err,results){
        callback(results[0]);
    });
}
//根据schema创建模型！
var Post = mongoose.model("Post",postSchema);

//这个模型向外暴露一个Mongoose对象
module.exports = Post;