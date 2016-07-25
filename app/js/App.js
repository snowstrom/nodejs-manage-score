/**
 * Created by Administrator on 2016/06/12.
 */
angular.module("myApp",['ui.router','filterModule','controllerModule'])
    .controller("myCtrl",["$scope", function ($scope) {
        
    }])
    .config(function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state("content", {
                url: "/",
                views: {
                    "content": {
                        templateUrl: "template/content.html",
                        controller: "contentCtrl"
                    },
                    "header@content": {templateUrl: "template/header-1.html"},
                    "body@content": {templateUrl: "template/welcome.html"}
                }
            })
            .state("content.login",{
                url:"login",
                views:{
                    "body@content":{
                        templateUrl:"template/login.html",
                        controller:"loginCtrl"
                    }
                }
            })
            .state("content.register",{
                url:"register",
                views:{
                    "body@content":{
                        templateUrl:"template/register.html",
                        controller:"registerCtrl"
                    }
                }
            })
            .state("content.home",{
                url:"home",
                views:{
                    "header@content":{
                        templateUrl:"template/header-2.html",
                        controller: "header2Ctrl"
                    },
                    "body@content":{
                        templateUrl:"template/home.html",
                        controller:"homeCtrl"
                    },
                    "nav@content.home":{templateUrl:"template/nav.html"},
                    "main@content.home":{
                        templateUrl:"template/allScore.html",
                        controller:"allScoreCtrl"
                    }
                }
            })
            .state("content.home.allScore",{
                url:"/allScore",
                views:{
                    "main@content.home":{
                        templateUrl:"template/allScore.html",
                        controller:"allScoreCtrl"
                    }
                }
            })
            .state("content.home.addScore",{
                url:"/addScore",
                views: {
                    "main@content.home": {
                        templateUrl: "template/addScore.html",
                        controller:"addScoreCtrl"
                    }
                }
            })
            .state("content.home.searchScore",{
                url:"/searchScore",
                views:{
                    "main@content.home":{
                        templateUrl:"template/searchScore.html",
                        controller:"searchScoreCtrl"

                    }
                }
            })
            .state("content.home.modifyScore",{
                url:"/modifyScore",
                views:{
                    "main@content.home":{
                        templateUrl:"template/modifyScore.html",
                        controller:"modifyScoreCtrl"
                    }
                }
            })
            .state("content.home.deleteScore",{
                url:"/deleteScore",
                views:{
                    "main@content.home":{
                        templateUrl:"template/deleteScore.html",
                        controller:"deleteScoreCtrl"
                    }
                }
            })
            .state("content.home.countScore",{
                url:"/countScore",
                views:{
                    "main@content.home":{
                        templateUrl:"template/countScore.html",
                        controller:"countScoreCtrl"
                    }
                }
            })
    });
