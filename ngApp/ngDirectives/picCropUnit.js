define(["myapp","jQuery","jQuery-ui"],function(myapp,$){
    //$location是系统内置服务，能够得到absUrl绝对地址
    myapp.directive("picCropUnit",["$location",function($location){
        //返回一个自定义指令设置对象
        return {
            "restrict" : "E",
            "templateUrl" : "/app/views/components/picCropUnit.html",
            "scope" : {
                "url" : "@",
                "ngModel" : "="  //双向数据绑定  profilectrl.pos ←→  这里的$scope.ngModel
            },
            "link" : function($scope,$elem,$attr){
                //jQuery程序在这里书写
                //让盒子依着图片的尺寸
                var image = new Image();
                image.src = $attr.url;

                image.onload = function(){
                    var $image = $(image);
                    $image.appendTo(".picCropUnitBox");

                    $(".picCropUnitBox").css("width",$image.width());
                    $(".picCropUnitBox").css("height",$image.height());
                    $(".piccut").css("background-image","url(" + $image.attr("src") + ")");
                }

                move();
                function move(){
                    $("span.t").animate({"left" : -1000},10000,"linear",function(){
                        $(this).css("left",0);
                        move();
                    });

                    $("span.b").animate({"left" : 0},10000,"linear",function(){
                        $(this).css("left",-1000);
                    });

                    $("span.l").animate({"top" : 0},10000,"linear",function(){
                        $(this).css("top",-1000);
                    });

                    $("span.r").animate({"top" : -1000},10000,"linear",function(){
                        $(this).css("top",0);
                    });
                }

                //拖拽
                $(".piccut").draggable({
                    "containment" : "parent",
                    "drag" : function(event,ui){
                        var x = ui.position.left;
                        var y = ui.position.top;
                        $scope.ngModel.x = x;
                        $scope.ngModel.y = y;
                        $(".piccut").css("background-position",-x +"px " + -y + "px");
                    }
                });

                //改变尺寸
                $(".piccut").resizable({
                    aspectRatio: 1 / 1,
                    containment: "parent",
                    resize : function(event,ui){
                        var h = ui.size.height;
                        var w = ui.size.width;
                         $scope.ngModel.h = h
                         $scope.ngModel.w = w
                    }
                });
            }
        }
    }]);
});