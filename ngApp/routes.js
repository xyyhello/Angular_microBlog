//前端的路由，所有有#符号的路由都是这个页面负责定义
define(["myapp"] , function (myapp) {
    myapp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //如果用户输入了不能识别的URL，此时跳转到/home
        $urlRouterProvider.otherwise('/home');

        //定义路由，实际上定义的是状态，切换的时候使用ng-sref切换的是状态。
        $stateProvider
            .state('home', {
                url: '/home',  //实际上是#/home
                views : {
                    "header" : {  //section ui-view="header"这个容器用的模板
                        "templateUrl" : "/app/views/header.html",
                        "controllerUrl" : "/app/ngControllers/HeaderCtrl.js",
                        "controller" : "HeaderCtrl as headerctrl",
                        "dependencies" : ["isActive","loginService"]
                    },
                    "content" : {  //section ui-view="content"这个容器用的模板
                        "templateUrl" : "/app/views/home.html",
                        "controllerUrl" : "/app/ngControllers/HomeCtrl.js",
                        "controller" : "HomeCtrl as homectrl",
                        "dependencies" : "jQuery"
                    },
                    "footer" : {
                            //section ui-view="footer"这个容器用的模板

                    }
                },
                dependencies : ["jQuery"]
            })
            .state('login', {
                url: '/login',
                views : {
                    "header" : {
                        "templateUrl" : "/app/views/header.html",
                        "controllerUrl" : "/app/ngControllers/HeaderCtrl.js",
                        "controller" : "HeaderCtrl as headerctrl",
                        "dependencies" : ["isActive","loginService"]
                    },
                    "content" : {
                        "templateUrl" : "/app/views/login.html",
                        "controllerUrl" : "/app/ngControllers/LoginCtrl.js",
                        "controller" : "LoginCtrl as loginctrl",
                        "dependencies" : ["loginService"]
                    },
                    "footer" : {

                    }
                },
                dependencies : ["jQuery"]
            })
            .state('regist', {
                url: '/regist',
                views : {
                    "header" : {
                        "templateUrl" : "/app/views/header.html",
                        "controllerUrl" : "/app/ngControllers/HeaderCtrl.js",
                        "controller" : "HeaderCtrl as headerctrl",
                        "dependencies" : ["isActive","loginService"]
                    },
                    "content" : {
                        "templateUrl" : "/app/views/regist.html",
                        "controllerUrl" : "/app/ngControllers/RegistCtrl.js",
                        "controller" : "RegistCtrl as registctrl"
                    },
                    "footer" : {

                    }
                },
                dependencies : ["jQuery"]
            })
            .state('profile', {
                url: '/profile',
                views : {
                    "header" : {
                        "templateUrl" : "/app/views/header.html",
                        "controllerUrl" : "/app/ngControllers/HeaderCtrl.js",
                        "controller" : "HeaderCtrl as headerctrl",
                        "dependencies" : ["isActive","loginService"]
                    },
                    "content" : {
                        "templateUrl" : "/app/views/profile.html",
                        "controllerUrl" : "/app/ngControllers/ProfileCtrl.js",
                        "controller" : "ProfileCtrl as profilectrl",
                        "dependencies" : ["picCropUnit"]
                    },
                    "footer" : {

                    }
                },
                dependencies : ["jQuery"]
            })
            .state("shuoshuo",{
                url : "/shuoshuo/:id",
                views : {
                    "header" : {
                        "templateUrl" : "/app/views/header.html",
                        "controllerUrl" : "/app/ngControllers/HeaderCtrl.js",
                        "controller" : "HeaderCtrl as headerctrl",
                        "dependencies" : ["isActive","loginService"]
                    },
                    "content" : {
                        "templateUrl" : "/app/views/shuoshuo.html",
                        "controllerUrl" : "/app/ngControllers/ShuoshuoCtrl.js",
                        "controller" : "ShuoshuoCtrl as shuoshuoctrl",
                        "dependencies" : ["jQuery"]
                    },
                    "footer" : {

                    }
                }
            })
    }]);
});