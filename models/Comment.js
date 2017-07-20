var mongoose = require("mongoose");

//创建schema
var commentSchema = mongoose.Schema({
    "email" : String , //谁发表的评论
    "content" : String , //评论内容
    "time": Date,
    "shuoshuoid" : String
});

commentSchema.statics.fabiaopinglun = function(JSON,callback){
    this.create({
        "email" : JSON.email,
        "content" : JSON.content,
        "time" : new Date(),
        "shuoshuoid" : JSON.id
    },function(){
        callback();
    });
}

commentSchema.statics.findComment = function(id,callback){
    this.find({"shuoshuoid" : id} , function(err,results){
       callback(results);
    });
}

//根据schema创建模型！
var Comment = mongoose.model("Comment",commentSchema);

//这个模型向外暴露一个Mongoose对象
module.exports = Comment;