define(["myapp","jQuery"],function(myapp,$){
    //控制器是等view都load之后然后被实例化，刚是jQuery运行实际
    myapp.controller("ShuoshuoCtrl",["loginService","$http","$stateParams",function(loginService,$http,$stateParams){
        //得到帖子ID，从URL地址栏中识别出来的
        this.id = $stateParams.id;

        var self = this;

        this.getUserInfo = function(){
            return loginService.getUserinfo()
        }

        this.info = {};

        //请求这个帖子的细节。还记得京东商城的API么？？
        $http.get("/posts/" + this.id).then(function(data){
           self.info = data.data;
        });


        //给提交评论按钮添加事件监听
        $("#submitbtn").click(function(){
           $http.post("/comment/" + self.id , {
               "content" : $("textarea").val()
           }).then(function(){
               alert("提交成功");
           })
        });
    }]);
});