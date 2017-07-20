define(["myapp","jQuery"],function(myapp,$){
    myapp.controller("LoginCtrl",["$http","$scope","$state","loginService",function($http,$scope,$state,loginService){
        var self = this;
        this.user = {"email" : "" , "password" : ""};

        //点击页面上的登录按钮之后做的事情，就是给/login这个接口发送用户注册信息
        //JSON不变形
        this.login = function(){
            $http.post("/login",this.user).then(function(data){
                if(data.data.result == -1 || data.data.result==-2){
                    alert("密码错误或者用户名不存在");
                }else{
                    alert("登录成功！");
                    loginService.login();
                    $state.go("home");
                }
            });
        }
    }]);
});