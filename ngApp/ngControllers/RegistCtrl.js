define(["myapp"],function(myapp){
    //控制器是等view都load之后然后被实例化，刚是jQuery运行实际
    myapp.controller("RegistCtrl",["$http","$scope","$state",function($http,$scope,$state){
        var self = this;

        this.tip = {"show":false , "info":"" , "class" : ""};      //第1个提示框
        this.tip2 = {"show":false , "info":""};//第2个提示框
        this.user = {"email":"","mima1":"","mima2":""}; //用户要提交的信息
        this.userisavalible = true; //用户名是否可用

        //检查email是否合法，是否被占用
        this.checkEmail = function(isInvaild){
            //现在不符合要求
            if(isInvaild){
                return;
            }

            $http.get("/checkuser?email=" + self.user.email).then(function(data){
                //接口是反着的，result如果是true表示用户名被占用。
                if(data.data.result){
                     self.tip.show = true;          //显示一个tip
                     self.tip.info = "用户名被占用！"; //内容就是用户名被占用
                     self.userisavalible = false;   //标记用户名不可用
                     self.tip.class = "danger";
                 }else{
                    //用户名可用
                    self.tip.info = "恭喜，用户名可以使用！"; //内容就是用户名被占用
                    self.userisavalible = true;   //标记用户名不可用
                    self.tip.show = true;          //显示一个tip
                    self.tip.class = "success";
                }
            });
        }

        //得到tip的类名，返回第一个为true的key
        this.gettipclass = function(){
            return {
                "alert alert-danger" : !self.userisavalible,
                "alert alert-success" : self.userisavalible
            }
        }

        //检查两次写的密码是否相同
        this.checkpassword = function(){
            if(self.user.mima1 == self.user.mima2){
                self.tip2.show = false;
            }else{
                self.tip2.show = true;
            }
        }

        //email框得到焦点
        this.emailFocus = function(){
            self.tip.show = false;
        }

        //检查提交按钮是否可用,返回值true表示不可用，false是可用
        this.isBtnDisabled = function(invalid){
            //检查表单本身是否有错
            if(invalid){
                return true;
            }
            //检查用户名是否可以用
            if(self.userisavalible == false){
                return true;
            }
            return false;
        }

        //提交表单
        this.regist = function(){
            $http.post("/user",self.user).then(function(data){
                if(data.data.result){
                    alert("注册成功！");
                    //切换状态，ui-router是描述状态的，
                    $state.go("login");
                }else{
                    alert("注册失败！");
                }
            },function(data){
                alert("服务器错误！")
            })
        }
    }]);
});