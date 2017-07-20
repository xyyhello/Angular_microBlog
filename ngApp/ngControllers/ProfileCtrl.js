define(["myapp","jQuery"],function(myapp,$){
    myapp.controller("ProfileCtrl",["$http","loginService","$state","$scope","FileUploader","$compile",function($http,loginService,$state,$scope,FileUploader,$compile){
        //备份
        var self = this;
        this.userinfo = {"login" : true ,"email" : "" , "avtar" : "" , "brief" : "" , "nickname" : ""};
        //上传图片的地址
        this.picurl = "/static/uploads/" +  this.userinfo.email + ".jpg";
        //我们自定义的组件给我们传输回来的数据，双向数据绑定
        this.pos = {"x" : 0 , "y" : 0 , "w" : 100 , "h" : 100};
        //是否显示我们自定义的组件，注意这是一个信号量，并不是一个真正让元素显示和隐藏的量
        //我们$compile了上树了一个组件之后，要记得把这个量变为true
        //当组件被删除的时候，此时要记得把这个量变为false
        this.piccropisshow = false;

        //本页面需要登录，这里是控制器被实例化的地方，所以这里验证登录特别合适
        loginService.checkloginfromserver(function(islogin,email){
            if(!islogin){
                $state.go("login");
                return;
            }
            //设置email
            self.userinfo.email = email;

            //重新设置uploader的url
            self.uploader.url = "/up?name=" + self.userinfo.email;

            //重新设置图片地址
            self.picurl = "/static/uploads/" + self.userinfo.email + ".jpg?" + Math.random();

            //查询后台接口，获得完整userinfo包括昵称、一句话简介、现有头像
            $http.get("/user/" + self.userinfo.email).then(function(data){
                //重新改变对象，这个对象与视图双向数据绑定
                self.userinfo = data.data;

                //验证昵称
                if(!self.userinfo.nickname)  self.userinfo.nickname= "没有昵称";

                //验证简介
                if(!self.userinfo.brief)  self.userinfo.brief= "这家伙很懒，什么都没有写...";

                //验证头像
                if(!self.userinfo.avatar) self.userinfo.avatar = "/static/images/defaultAvatar.png";
            });
        });


        //点击裁切按钮之后做的事情
        this.cut = function(){
            //向服务器的cut接口发出裁剪命令，裁剪的原理是GM。
            $http.post("/cut?name=" + self.userinfo.email ,self.pos).then(function(data){

                if(data.data == "ok"){
                    //点击裁切按钮之后做的事情
                    //删除我们的自定义组件
                    $("#picbox").empty();
                    //更改信号量
                    self.piccropisshow = false;

                    //更改userinfo中的avatar字段为新的上传地址
                    self.userinfo.avatar = self.picurl + Math.random();
                }
            });
        };

        //提交
        this.submit = function(){
            console.log(self.userinfo);
            //POST请求到/user/email上，比如post到http://127.0.0.1:8088/user/shao@163.com
            //表示对shao@163.com这个用户的修改
            $http.post("/user/" + self.userinfo.email,self.userinfo).then(function(data){
                if(data.data.result == 1){
                    alert("修改成功！");

                    //跳转到首页
                    $state.go("home");
                }else{
                    alert("修改失败！");
                }
            })
        };

        //双向数据绑定，显示进度
        this.prog = 0;  //0~100
        //随机名字
        var name = Math.random();

        //实例化上传插件：
        this.uploader = new FileUploader({
            //上传文件夹
            url : "/up?name=" + self.userinfo.email,
            //队列限制
            queueLimit  : 1,
            //在上传过程中，得到进度
            onProgressAll   : function(prog){
                self.prog = prog;
                if(prog == 100){
                    this.clearQueue();
                }
            },
            filters : [{
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            }],
            //添加图片失败的时候做的事情
            onWhenAddingFileFailed : function(item /*{File|FileLikeObject}*/, filter, options) {
                alert("请选择图片格式文件，仅支持jpg|png|jpeg|bmp|gif！");
            },
            //添加成功做的事情，要验证尺寸
            onAfterAddingFile  :  function(info) {
                if(info.file.size > 9000 * 1024){
                    alert("图片尺寸不能大于9000kb！请重新选择！");
                    self.uploader.clearQueue();
                }
            },
            //上传成功
            onCompleteAll  : function(){
                setTimeout(function(){
                    //更新自己的图片路径
                    self.picurl = "/static/uploads/" + self.userinfo.email + ".jpg?" + Math.random();
                    //更改一个标记，这个piccropisshow只是一个信号量，并不能真正让指令组件显示
                    self.piccropisshow = true;
                    //动态创建一个指令
                    var el = $compile('<pic-crop-unit url="{{profilectrl.picurl}}" ng-model="profilectrl.pos"></pic-crop-unit>')($scope);
                    //上树
                    angular.element(document.getElementById("picbox")).append(el);
                },300);
            }
        });
    }]);
});