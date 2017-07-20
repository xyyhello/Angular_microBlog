require.config({
    baseUrl: '/',
    paths: {
        'angular': '/static/js/lib/angular.min',        //框架
        'angular-ui-router': '/static/js/lib/angular-ui-router.min', //框架插件UI路由
        'angular-async-loader': '/static/js/lib/angular-async-loader.min', //requirejs和Angular的粘合剂
        'routes' : "/app/routes",
        "myapp" : "/app/myapp",
        "jQuery" : "/static/js/lib/jquery.min",
        "jQuery-ui" : "/static/js/lib/jquery-ui.min",
        "isActive" : "/app/ngDirectives/isActive",
        "loginService" : "/app/ngServices/loginService",
        "config" : "/app/config",
        "angular-file-upload" : "/static/js/lib/angular-file-upload", //插件
        "picCropUnit" : "/app/ngDirectives/picCropUnit",
        "mysocketio" : "/socket.io/socket.io.js"  //socketio对象
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-ui-router': {deps: ['angular']},
        'angular-file-upload': {deps: ['angular']},
        'jQuery' : {exports: '$'},
        "jQuery-ui" : {deps: ['jQuery']}
    }
});

//按顺序加载angular、routes两个东西
require(['angular',"routes"], function (angular) {
    angular.element(document).ready(function () {
        //开启angular程序，这些都是RequreJS的angular-async-loader的API上的
        //API网页：https://github.com/subchen/angular-async-loader
        angular.bootstrap(document, ['myapp']);
        angular.element(document).find('html').addClass('ng-app');
    });
});