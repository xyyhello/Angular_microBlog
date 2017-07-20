define(["myapp","jQuery","mysocketio"],function(myapp,$,io){
    //控制器是等view都load之后然后被实例化，刚是jQuery运行实际
    myapp.controller("HomeCtrl",["loginService","$http",function(loginService,$http){
        //被实例化之后的语句
        var self = this;
        //分页
        var pagesize = 10;
        var page = 0;
        //socket对象
        var socket = io();
        //自己的最新帖子编号
        var mylatestshuoshuoid = "";
        //更新的帖子的数量，就是比我加载之后又发出的帖子，这个数量被广播更改
        var nsn = 0;

        //监听服务器的广播，这是fatiechenggong事件。
        socket.on("fatiechenggong",function(data){
            nsn++;
            $("#nsn").html(nsn);

            if(nsn > 0){
                $("#newtip").fadeIn();
            }

            notifyMe(data.username + "发了新消息！");
        });

        //所有的帖子列表
        this.allPosts = [];

        //得到用户信息，得到的用户信息是从服务中来的。
        this.getUserInfo = function(){
            return loginService.getUserinfo()
        }

        //提交表单
        this.fabiao = function(){
            $http.post("/posts",{
                //这个JSON要和Post的schema一致，因为JSON不变形直接数据库
                "email" : loginService.getUserinfo().email,
                "content" : self.content
            }).then(function(data){
                if(data.data == "ok"){
                    //直接给我们的数组增加一项，增加一个动态的感觉
                    self.allPosts.unshift({
                        //这个JSON要和Post的schema一致，因为JSON不变形直接数据库
                        "email" : loginService.getUserinfo().email,
                        "content" : self.content,
                        "avatar" : loginService.getUserinfo().avatar,
                        "date" : new Date(),
                        "nickname" : loginService.getUserinfo().nickname
                    });
                }
            });
        }

        //读取接口得到所有帖子
        this.getAllpost = function(callback){
            $http.get("/posts?pagesize=" + pagesize + "&page=" + page).then(function(data){
                //如果有回调函数，执行回调函数
                if(callback){
                    callback(data.data);
                }
            });
        }

        //页面开始的时候就要发出请求，请求数据
        this.getAllpost(function(data){
            self.allPosts = data.results;
            //同时我们要记录此时数据首条记录的_id，作为自己mylatestshuoshuoid
            mylatestshuoshuoid = data.results[0]["_id"];

            console.log(mylatestshuoshuoid);
        });

        //jQuery的业务：
        var lock = true;
        //瀑布流
        $(window).scroll(function(){
            if(!lock) return;
            var A = $(window).scrollTop();
            var B = $(document).height();
            var C = $(window).height();
            if(( A + C ) / B > 0.7){
                lock = false;

                //加载更多的了
                page++;
                self.getAllpost(function(data){
                    if(data.results.length != 0){
                        lock = true;
                    }
                    //和现有帖子结合一下
                    self.allPosts = self.allPosts.concat(data.results);
                });
            }
        });

        //点击更新的那个#newtip做的事情，就是发出请求，请求更新的这些帖子
        $("#newtip").click(function(){
            //请求更多的数据
            $http.get("/posts?until="+ mylatestshuoshuoid).then(function(data){

                //和现有帖子结合一下
                self.allPosts = data.data.results.concat(self.allPosts);
                //把现在这个更新最为我们的更新
                mylatestshuoshuoid = data.data.results[0]["_id"];
                //数量清零
                nsn = 0;
                //隐藏
                $("#newtip").fadeOut();
            });
        });


        //这个函数来自https://developer.mozilla.org/en-US/docs/Web/API/notification
        //这是HTML5的新特性，notification，桌面提醒特性
        function notifyMe(infotext) {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                var notification = new Notification(infotext);
            }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification(infotext);
                    }
                });
            }

            // At last, if the user has denied notifications, and you
            // want to be respectful there is no need to bother them any more.
        }

    }]);
});