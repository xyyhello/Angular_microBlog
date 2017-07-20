define(["myapp"],function(myapp){
    myapp.controller("HeaderCtrl",["loginService","$http",function(loginService,$http){
        //header被实例化的时候，从服务器上检查是否登录
        this.islogin = false;
        this.email = "";
        this.avatar = "http://127.0.0.1:8088/static/images/defaultAvatar.png";
        this.userinfo = {};

        //通过服务器检查是否登录
        var self = this;
        loginService.checkloginfromserver(function(torf,email){
            //torf表示是否登录
            //email表示用户的用户名
            self.islogin = torf;
            self.email = email;

            if(!self.islogin) return;

            //再次检查一下详细信息
            //查询后台接口，获得完整userinfo包括昵称、一句话简介、现有头像
            $http.get("/user/" + self.email).then(function(data){
                console.log(data);
                //重新改变对象，这个对象与视图双向数据绑定
                self.userinfo = data.data;

                //更改服务中的那个对象，目的是为了让其他控制器也得到用户信息
                loginService.setUserinfo(self.userinfo);

                //验证昵称
                if(!self.userinfo.nickname)  self.userinfo.nickname= "没有昵称";

                //验证简介
                if(!self.userinfo.brief)  self.userinfo.brief= "这家伙很懒，什么都没有写...";

                //验证头像
                if(!self.userinfo.avatar) self.userinfo.avatar = "/static/images/defaultAvatar.png";
            });
        });


        //退出登录
        this.logout = function(){
            alert("退出成功");
            loginService.logout();
        }
    }]);
});