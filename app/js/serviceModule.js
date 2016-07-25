/**
 * Created by Administrator on 2016/06/17.
 */
angular.module("serviceModule",[])
.factory("searchService", function () {
    return{
        /*
        * search 函数用于根据特定值查找相应项
        * 参数：
        * @ key 表示 搜索时使用的属性
        * @ value 表示 搜索时使用的值
        * @ searchArray 表示 目标搜索数组
        * @ resultArray 表示 搜索到的结果数组
        *
        * 返回值：
        * resultObj是一个对象：
        * @ resultArray 表示本次搜索后得到的新搜索结果属性
        * @ flag 表示本次搜索是否搜索到相关项。
        * */
        search: function (key,value,searchArray ,resultArray ) {   //不允许在结果数组中出现重复的项，如果重复就加亮显示！
            //先清除之前搜索时的颜色样式
            for( var x=0;x<resultArray.length;x++){
                resultArray[x].tipFlag=false;
            }
            var resultFlag = false;  //用于标识本次搜索是否搜到了相关项
            for(var i=0;i<searchArray.length;i++){
                if(searchArray[i][key]===value){
                    resultFlag = true;
                    for(var j=0;j<resultArray.length;j++){
                        if(resultArray[j].ID===searchArray[i].ID){
                            resultArray[j].tipFlag=true;  //发现，之前有搜到过此结果，就给此给元素加一个颜色样式提醒用户，之前搜到过这个结果，但是不push它进入结果数组，避免重复
                            break;
                        }
                    }
                    if(j === resultArray.length){ //说明，遍历完了resultArray,之前没有找到过本搜索项
                        var newObj = jQuery.extend({},searchArray[i]);  //防止在修改resultArray时，会修改到原始数据
                        newObj.index=i;  //记录本项数据在原始数据的位置，备用
                        newObj.tipFlag=true;  //根据这属性的值给当前项加颜色样式提醒用户搜到到本项
                        newObj.Average=((newObj.Chinese + newObj.Math + newObj.English)/3).toFixed(1); //本项学生的平均值，备用
                        resultArray.push(newObj);
                    }
                }
            }
            return {
                resultArray:resultArray,
                flag : resultFlag
            };
        }
    }
});