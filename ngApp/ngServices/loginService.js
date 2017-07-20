define(["myapp"],function(myapp){
    myapp.factory("loginService",["$http",function($http){
        var islogin = false;
        var email = "";
        var userinfo = {};

        return {
            "checklogin" : function(){
                return islogin;
            },
            "getEmail" : function(){
                return email;
            },
            "login" : function(){
                islogin = true;
            },
            "logout" : function(){
                $http.get("/logout").then(function(){
                    islogin = false;
                    email = "";
                });
            },
            "setUserinfo" : function(json){
                userinfo = json;
            },
            "getUserinfo" : function(){
                return userinfo;
            },
            //从服务器上检查是否已经登录
            "checkloginfromserver" : function(callback){
                $http.get("/checklogin").then(function(data){
                    islogin = data.data.login;
                    email = data.data.email;
                    callback(islogin,email);
                });
            }
        }
    }]);
});