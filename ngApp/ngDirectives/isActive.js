define(["myapp"],function(myapp){
    //$location是系统内置服务，能够得到absUrl绝对地址
    myapp.directive("isActive",["$location",function($location){
        //返回一个自定义指令设置对象
        return {
            "restrice" : "A",
            "link" : function($scope,$elem,$attr){
                //如果当前的指令携带的值和访问的页面的url一样，此时就加上current
                if($location.url() === $attr.isActive){
                    $elem.addClass("active");
                }else{
                    $elem.removeClass("active");
                }
            }
        }
    }]);
});