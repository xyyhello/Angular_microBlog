define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');
    require("angular-file-upload");

    //创建myapp模型
    var myapp = angular.module('myapp', ['ui.router','angularFileUpload']);

    // initialze app module for angular-async-loader
    asyncLoader.configure(myapp);

    //暴露myapp对象，这是一个angular的module
    module.exports = myapp;
});