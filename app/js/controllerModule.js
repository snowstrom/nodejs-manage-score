/**
 * Created by Administrator on 2016/06/13.  定义一个服务执行搜索操作，因为有查找、修改、删除成绩均用到了这个操作，另外定义一个指令修改元素样式（均未完成！）。
 */
angular.module("controllerModule",['serviceModule'])
    .controller("homeCtrl", function ($scope) {
		$scope.myData=[];	
		$.get("http://127.0.0.1:3000/getScore",function(data,status){
			$scope.$apply(function(){
				$scope.myData = data;
				$scope.pageNum = Math.floor($scope.myData.length/10)+ ($scope.myData.length % 10 > 0 ? 1:0);
			});
		})
    })
    .controller("loginCtrl", function ($scope,$state) {
        $scope.userName="";
        $scope.password="";
        $scope.userNameFlag=true;  //用户名不存在标志位，一开始没有输入，空用户名不存在  ,没有成功实现，重新输入用户名使提示信息消失
        $scope.passwordFlag=true;  //密码错误标志位,一开始没有收入所以错误，
        $scope.clickFlag=false;
        $scope.login= function () {
			$.post("http://127.0.0.1:3000/login",{name:$scope.userName,password:$scope.password},function(data,status){
				$scope.$apply(function(){
					$scope.clickFlag=true;
					if(data.name){
						$scope.userNameFlag=false;
						if(data.password){
							$scope.clickFlag=false;
							$scope.userNameFlag=true;
							$scope.$parent.currentUser = $scope.userName;  //要使用$parent获取父作用域中的currentUser后赋值，否则会赋值失败
							$state.go("^.home");
						}else{
							$scope.passwordFlag=true;
						}
					}
				});
			});	
        };
        $scope.$watch("password",function(){
            $scope.passwordFlag=false;
        });
		$scope.$watch("userName",function(){
			$scope.clickFlag=false;
		});
    })
    .controller("registerCtrl", function ($scope,$state) {
        $scope.registerInfo={
            userName:"",
            password:""
        };
		$scope.tip="";
        $scope.confirmPW="";
        $scope.register= function () {
            if($scope.myForm.name.$valid && $scope.myForm.pw.$valid){
                if($scope.confirmPW != $scope.registerInfo.password){
                    $scope.tip="确认密码与密码必须相同!";
                }else {//注册成功处理
					$scope.tip="";
					$.post("http://127.0.0.1:3000/register",$scope.registerInfo,function(data,status){
						if(data.status) {
							alert("注册成功，请登录！");
							$state.go("content.login");
						}else{
							alert("注册失败，用户名已存在");
						}
					})
			
                   // $scope.userInfo.push($scope.registerInfo);
                  
                }
            }else {
                if($scope.myForm.name.$invalid){
                    $scope.myForm.name.$dirty=true;
                }
                if($scope.myForm.pw.$invalid){
                    $scope.myForm.pw.$dirty=true;
                }
            }
        };
        $scope.$watch("confirmPW", function (newValue) {
            if(newValue==$scope.registerInfo.password){
                $scope.tip="";
            }
        });
    })
    .controller("contentCtrl", function ($scope,$state) {
        $scope.currentUser="";  //存放当前用户名
    })
    .controller("header2Ctrl", function ($scope,$state) {
        $scope.$on("$viewContentLoaded", function () {
            if($scope.currentUser == ""){   //如果没有登录就直接来到主页面，则强制回调登录页面
                $state.go("content.login");
            }
        });
        $scope.logoff= function () {
            $scope.$parent.currentUser="";
            $state.go("content.login");
        }
    })
    .controller("allScoreCtrl", function ($scope) {
        $scope.start=0;
        $scope.end=10;
        $scope.previousFlag = true;
        $scope.nextFlag = false ;
        $scope.previous= function () { //修正尾页时的不足、当前为首页时，禁用上一页按钮
            $scope.start -=10;
            $scope.end -=10;
            $scope.nextFlag=false;  //启用下一页（如果是尾页呢）
            if($scope.start===0){//来到首页禁用上一页按钮
                $scope.previousFlag = true;
            }
        };
        $scope.next= function () { //到最后一页时禁用下一页按钮
            $scope.start +=10;
            $scope.end +=10;
            $scope.previousFlag = false; //启用上一页（如果此时是首页呢！！）
            if($scope.start === ($scope.pageNum-1)*10){ //来到尾页，禁用下一页按钮
                $scope.nextFlag=true;
            }
        };
        $scope.first= function () { //禁用上一页，启用下一页（如果下一页是尾页呢！！）
            $scope.start=0;
            $scope.end=10;
            $scope.previousFlag =true;
            $scope.nextFlag=false;
        };
        $scope.last= function () {  //禁用下一页，解放上一页（如果上一页是首页呢！！）
            $scope.nextFlag= true;
            $scope.start= ($scope.pageNum-1)*10;
            $scope.end=$scope.start +10;
            $scope.previousFlag=false;
        };
        $scope.$watch("previousFlag", function (newvalue) {
            if(newvalue===false){
                if($scope.start===0){  //如果是首页则禁用上一页
                    $scope.previousFlag=true;
                }
            }
        });
        $scope.$watch("nextFlag", function (newValue) {
            if(newValue==false){
                if($scope.start=== ($scope.pageNum-1)*5){ //如果是尾页则禁用下一页
                    $scope.nextFlag=true;
                }
            }
        })
    })
    .controller("addScoreCtrl", function ($scope) {
        $scope.infoArray=[{
            "addResult":"待添加",//给用户提示添加的结果，初始显示待添加，单击添加按钮后改变它的值提示该项是否添加成功
            "addFlag":false, //单击添加按钮时使该项为true，以便验证用户输入信息
            "addSuccessFlag":false,
            "idConflictFlag":false,
            "ID":"",
            "Name":"",
            "Chinese":"",
            "Math":"",
            "English":""
        }];
        $scope.addLine= function () {
            $scope.infoArray.push({
                "addResult":"待添加",
                "addFlag":false, //单击添加按钮时使该项为true，以便验证用户输入信息
                "addSuccessFlag":false,
                "idConflictFlag":false,
                "ID":"",
                "Name":"",
                "Chinese":"",
                "Math":"",
                "English":""
            });
        };
        $scope.deleteLine= function (index) {
            $scope.infoArray.splice(index,1);
        };
        $scope.addScore= function () {
			var ajaxArr=[];
            for(var i=0;i<$scope.infoArray.length;i++){
                $scope.infoArray[i].addFlag=true;
                //"判断每组数据的合法性，将合法的数据添加到总分数信息数组"
                if($scope.infoArray[i].ID !== "" && $scope.infoArray[i].Name !== "" && $scope.infoArray[i].Chinese !== "" && $scope.infoArray[i].Math !== "" && $scope.infoArray[i].English !== ""){
                    for(var j=0; j<$scope.myData.length;j++){
                        if($scope.myData[j].ID == $scope.infoArray[i].ID){
                            $scope.infoArray[i].idConflictFlag=true;
                            break;
                        }
                    }
                    if($scope.infoArray[i].idConflictFlag===false) {    //判断当前待添加的学生的id是否与表中已有的学生的id相同，保证id是唯一的
                        var newObject=jQuery.extend({},$scope.infoArray[i]);
                        delete newObject.addResult;
                        delete newObject.addFlag;
                        delete newObject.addSuccessFlag;
                        delete newObject.idConflictFlag;
						delete newObject.$$hashKey;
						
						$scope.myData.push(newObject);
						ajaxArr.push(newObject);
						$scope.infoArray[i].addResult="添加成功";
						$scope.infoArray[i].addSuccessFlag=true;
					 
                    }else{//id冲突，提示用户不能添加此项
                        $scope.infoArray[i].addResult="ID冲突";
                        $scope.infoArray[i].addSuccessFlag=false;
                    }
                }else {//输入的学生信息有的项为空，不合法，给非法项设置红色边框提示用户
                    $scope.infoArray[i].addResult="有非法项";
                }
            }
			if(ajaxArr.length>0){
				var obj=JSON.stringify(ajaxArr);
				$.ajax({
					type:"POST",
					url:"http://127.0.0.1:3000/addScore",
					data:obj,
					dataType:"json",
					contentType:"application/json",
					success:function(data,status){
						if(data){
							console.log("添加成功");
						}
					}
				});
			}
        }
    })
    .controller("searchScoreCtrl", function ($scope,searchService) { //利用表单联动，选择一个查询方式，则显示一个相应的搜索框
        $scope.optionItem="ID"; //设置默认选择项为ID
        $scope.keyword="";
        $scope.searchResult=[];
        $scope.searchFlag={
            "head":false,
            "noResult":false
        };
        $scope.search= function () {
            if($scope.optionItem=="Chinese" || $scope.optionItem=="Math" || $scope.optionItem=="English"){ //将string形式的分数值转换为number形式
                $scope.keyword=parseFloat($scope.keyword);
            }
            var result= searchService.search($scope.optionItem,$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult=result.resultArray;
            $scope.searchFlag.noResult= !result.flag;
            if($scope.searchResult.length>0){  //显示表头信息
                $scope.searchFlag.head=true;
            }
        }
    })
    .controller("deleteScoreCtrl",function($scope,searchService){
        $scope.optionItem="ID"; //设置默认选择项为ID
        $scope.keyword="";
        $scope.searchResult=[];//可能有重名的情况，所以设置为数组形式
        $scope.searchFlag={
            "head":false,
            "noResult":false,
            "clickFlag":false
        };
        $scope.delete= function () {
            $scope.searchFlag.noResult=false;
            $scope.searchFlag.clickFlag=true;
            var result= searchService.search($scope.optionItem,$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult = result.resultArray;
            $scope.searchFlag.noResult = !result.flag;
            for(var index=0;index <$scope.searchResult.length;index++){ //初始化每项的选中状态位false
                $scope.searchResult[index].state=false;
            }
            if($scope.searchResult.length>0){ //显示搜索结果表格的表头
                $scope.searchFlag.head=true;
            }
        };
        $scope.tip="确定删除?";
        $scope.selectAll=false;
        $scope.all= function (m) {
            for(var index=0; index<$scope.searchResult.length;index++){
                $scope.searchResult[index].state=m;
            }
        };
        $scope.cancel= function () {
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
            $scope.searchFlag.noResult=false;
			$scope.selectAll=false;
        };
        $scope.confirmDelete= function () {
            var stateFlag=true;
            var ajaxObj = [];
			for(var i=0;i<$scope.searchResult.length;i++){
                if($scope.searchResult[i].state){
                    stateFlag=false;
					ajaxObj.push($scope.searchResult[i].ID);
				
					$scope.myData.splice($scope.searchResult[i].index,1);
                    for(var j=i+1;j<$scope.searchResult.length;j++){
                        $scope.searchResult[j].index--;   //修正待删除项在myData数组中的下标值
                    }
                    $scope.searchResult.splice(i,1);
                    i--;   //删除searchResult数组中的项，会改变数组长度，即之后项的相应下标，这里修正一下！
                }
            }
            if(stateFlag){
                $scope.tip="请勾选要删除的项!";
            }else {
				var obj = JSON.stringify(ajaxObj);
				$.ajax({
					type:"POST",
					url:"http://127.0.0.1:3000/deleteScore",
					data:obj,
					dataType:"json",
					contentType:"application/json",
					success:function(data,status){
						if(data){
							//console.log("添加成功");
						}
					}
				});
				
                alert("删除成功!");
                $scope.selectAll=false;
                $scope.tip="确定删除?";
            }
            if($scope.searchResult.length==0){
                $scope.searchFlag.head=false;
                $scope.searchFlag.clickFlag=false;
            }
        }
    })
    .controller("modifyScoreCtrl", function ($scope,searchService) {
        $scope.keyword="";
        $scope.searchResult=[];
        $scope.searchFlag={
            "head":false,
            "noResult":false,
            "clickFlag":false
        };
		var searchID='';
        $scope.search= function () {
            $scope.searchResult=[];
			$scope.searchFlag.head=false;
            $scope.searchFlag.noResult=false;
            $scope.searchFlag.clickFlag=true;
            var result= searchService.search("ID",$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult = result.resultArray;
            $scope.searchFlag.noResult = !result.flag;
            if($scope.searchResult.length > 0){ //显示搜索结果表格的表头
                $scope.searchFlag.head=true;
				searchID = $scope.searchResult[0].ID;
            }
        };
        $scope.tip="确定保存修改?";
        $scope.cancel= function () {
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
            $scope.searchFlag.noResult=false;
            $scope.tip="确定保存修改?";
        };
        $scope.save= function () {
            //判断是否合法，ID 是否冲入等(考虑使用服务里的方法好了)然后在修改
            $scope.idConflictFlag=false;
            $scope.wrongTip=false;
            if($scope.searchResult[0].ID!=="" && $scope.searchResult[0].Name!=="" && $scope.searchResult[0].Chinese!==null && $scope.searchResult[0].Math!==null && $scope.searchResult[0].English!==null){
                for(var i=0; i<$scope.myData.length;i++){
                    if($scope.myData[i].ID == $scope.searchResult[0].ID && $scope.myData[i].ID != searchID){
                        $scope.idConflictFlag=true;
                        break;
                    }
                }
                if(!$scope.idConflictFlag) {    //没有id冲突
					var ajaxObj = JSON.stringify({
						ID:searchID,
						newID:$scope.searchResult[0].ID,
						newName:$scope.searchResult[0].Name,
						newChinese:Chinese=$scope.searchResult[0].Chinese,
						newMath:$scope.searchResult[0].Math,
						newEnglish:$scope.searchResult[0].English
					});
					$.ajax({
						type:"POST",
						url:"http://127.0.0.1:3000/modifyScore",
						data:ajaxObj,
						dataType:"json",
						contentType:"application/json",
						success:function(data,status){
							if(data){
								alert("修改成功!");
								$scope.$apply(function(){
									$scope.myData[$scope.searchResult[0].index].ID=$scope.searchResult[0].ID;
									$scope.myData[$scope.searchResult[0].index].Name=$scope.searchResult[0].Name;
									$scope.myData[$scope.searchResult[0].index].Chinese=$scope.searchResult[0].Chinese;
									$scope.myData[$scope.searchResult[0].index].Math=$scope.searchResult[0].Math;
									$scope.myData[$scope.searchResult[0].index].English=$scope.searchResult[0].English;
									
									$scope.searchResult=[];
									$scope.searchFlag.head=false;
									$scope.searchFlag.clickFlag=false;
									$scope.searchFlag.noResult=false;
									$scope.tip="确定保存修改?";
									$scope.wrongTip=false;
								});
							}else{
								alert("修改失败，数据库异常!");
							}
						}
					});
                }else{//id冲突，提示用户不能添加此项
                    $scope.tip="ID冲突";
                    $scope.wrongTip=true;
                }
            }else {
                $scope.tip="有非法项";
                $scope.wrongTip=true;
            }
        };
    })
    .controller("countScoreCtrl", function ($scope) {
        var total=[0,0,0];//依次是Chinese、Math、English的全班的和
        $scope.m_m_a={//  记录各个科目的最小值、最大值、平均值，各个属性值数组依次为 Chinese、Math、English
            min:[0,0,0],
            max:[0,0,0],
            average:[0,0,0]
        };
        $scope.count={ // 统计各科目在各个分数段的数量，分数段依次为：0-60、60-80、80-90、90-100，各分数段包含左值，不包含右值但包含100
            Chinese:[0,0,0,0],
            Math:[0,0,0,0],
            English:[0,0,0,0]
        };
        $scope.m_m_a.min[0] = $scope.m_m_a.max[0] = total[0] = $scope.myData[0].Chinese;
        $scope.m_m_a.min[1] = $scope.m_m_a.max[1] = total[1] = $scope.myData[0].Math;
        $scope.m_m_a.min[2] = $scope.m_m_a.max[2] = total[2] = $scope.myData[0].English;

        for(var i=1; i<$scope.myData.length;i++){

            if($scope.myData[i].Chinese < $scope.m_m_a.min[0]){
                $scope.m_m_a.min[0]=$scope.myData[i].Chinese;
            }
            if($scope.myData[i].Chinese > $scope.m_m_a.max[0]){
                $scope.m_m_a.max[0]=$scope.myData[i].Chinese;
            }
            if($scope.myData[i].Math < $scope.m_m_a.min[1]){
                $scope.m_m_a.min[1]=$scope.myData[i].Math;
            }
            if($scope.myData[i].Math > $scope.m_m_a.max[1]){
                $scope.m_m_a.max[1]=$scope.myData[i].Math;
            }
            if($scope.myData[i].English < $scope.m_m_a.min[2]){
                $scope.m_m_a.min[2]=$scope.myData[i].English;
            }
            if($scope.myData[i].English > $scope.m_m_a.max[2]){
                $scope.m_m_a.max[2]=$scope.myData[i].English;
            }
            //各科成绩的分数段统计
            if($scope.myData[i].Chinese < 60){
                $scope.count.Chinese[0]++;
            }else if($scope.myData[i].Chinese >= 60 && $scope.myData[i].Chinese < 80 ){
                $scope.count.Chinese[1]++;
            }else if($scope.myData[i].Chinese >= 80 && $scope.myData[i].Chinese < 90 ){
                $scope.count.Chinese[2]++;
            }else if($scope.myData[i].Chinese >= 90 && $scope.myData[i].Chinese <= 100 ){
                $scope.count.Chinese[3]++;
            }

            if($scope.myData[i].Math < 60){
                $scope.count.Math[0]++;
            }else if($scope.myData[i].Math >= 60 && $scope.myData[i].Math < 80 ){
                $scope.count.Math[1]++;
            }else if($scope.myData[i].Math >= 80 && $scope.myData[i].Math < 90 ){
                $scope.count.Math[2]++;
            }else if($scope.myData[i].Math >= 90 && $scope.myData[i].Math <= 100 ){
                $scope.count.Math[3]++;
            }

            if($scope.myData[i].English < 60){
                $scope.count.English[0]++;
            }else if($scope.myData[i].English >= 60 && $scope.myData[i].English < 80 ){
                $scope.count.English[1]++;
            }else if($scope.myData[i].English >= 80 && $scope.myData[i].English < 90 ){
                $scope.count.English[2]++;
            }else if($scope.myData[i].English >= 90 && $scope.myData[i].English <= 100 ){
                $scope.count.English[3]++;
            }

            total[0] += $scope.myData[i].Chinese;
            total[1] += $scope.myData[i].Math;
            total[2] += $scope.myData[i].English;
        }

        $scope.m_m_a.average[0]=(total[0]/$scope.myData.length).toFixed(1);
        $scope.m_m_a.average[1]=(total[1]/$scope.myData.length).toFixed(1);
        $scope.m_m_a.average[2]=(total[2]/$scope.myData.length).toFixed(1);

        $scope.$on("$viewContentLoaded", function () {
            var dataChinese = [['0～60',$scope.count.Chinese[0]], ['60～80',$scope.count.Chinese[1] ], ['80～90',$scope.count.Chinese[2]], ['90～100',$scope.count.Chinese[3]]];
            var dataMath = [['0～60',$scope.count.Math[0]], ['60～80',$scope.count.Math[1] ], ['80～90',$scope.count.Math[2]], ['90～100',$scope.count.Math[3]]];
            var dataEnglish = [['0～60',$scope.count.English[0]], ['60～80',$scope.count.English[1] ], ['80～90',$scope.count.English[2]], ['90～100',$scope.count.English[3]]];

            var data = [dataChinese,dataMath,dataEnglish];
            var title = ["Chinese 成绩分布图","Math 成绩分布图","English 成绩分布图"];
            var chartId =["chartChinese","chartMath","chartEnglish"];
            for(var i=0;i< 3;i++){
                $.jqplot(chartId[i], [data[i]], {
                    title:title[i],//设置饼状图的标题
                    seriesDefaults: {
                        fill: true,
                        showMarker: false,
                        shadow: false,
                        renderer:$.jqplot.PieRenderer,
                        rendererOptions:{
                            padding: 10, // 饼距离其分类名称框或者图表边框的距离，变相设置该表饼的直径
                            sliceMargin: 5, // 饼的每个部分之间的距离
                            fill:true, // 设置饼的每部分被填充的状态
                            shadow:true, //为饼的每个部分的边框设置阴影，以突出其立体效果
                            shadowOffset: 4, //设置阴影区域偏移出饼的每部分边框的距离
                            shadowDepth: 2, // 设置阴影区域的深度
                            shadowAlpha: 0.07, // 设置阴影区域的透明度
                            showDataLabels: true  //显示比例数据
                        }
                    },
                    gridPadding: {top:30, bottom:20, left:0, right:0}, //设置图的四周外部空出的距离，注意上部的值设置足够到以便放置标题
                    legend:{
                        show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
                        location: 'ne', // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
                        xoffset:10 , // 分类名称框距图表区域上边框的距离（单位px）
                        yoffset:10  // 分类名称框距图表区域左边框的距离(单位px)
                    }
                });
            }
        })

    });