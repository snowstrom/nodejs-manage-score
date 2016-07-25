/**
 * Created by Administrator on 2016/06/20.
 */
angular.module("filterModule",[])
.filter("pagination", function () {
    return function (input,start,end) {
        if(!input || !input.length){return;}
        return input.slice(start,end);
    }
});