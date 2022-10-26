"use strict";
angular.module("myApp", [
    'ngRoute',
    'ngAnimate',
    'myApp.filters',
    'myApp.directives',
    'security',
    'services.httpRequestTracker',
    'ui.utils',
    'pascalprecht.translate',
    'ui.utils',
    'ui.select2',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.bootstrap.tooltip',
    'ui.bootstrap.pagination',
    'ui.bootstrap.progressbar',
    'services.myFunction',
    'services.service',
    'ui.bootstrap.dialog',
    'ui.tree',
    'angular.filter',
])

    .value('uiSelect2Config', {
        allowClear: true,
        placeholder: '-- Please Select --',
        formatNoMatches: function () {
            return "No matches found";
        }
    })
    .value('ui.config', {
        date: {
            format: 'dd/mm/yyyy',
            autoclose: true,
            forceParse: false
        }
    }) .factory('MyData', function($websocket) {
        // Open a WebSocket connection
        var dataStream = $websocket('ws://192.168.10.20:5555');
  
        var collection = [];
  
        dataStream.onMessage(function(message) {
            console.log(message);
          collection.push(message.data);
        });
  
        var methods = {
          collection: collection,
          get: function() {
            dataStream.send('test');
          }
        };
  
        return methods;
      })
   

function AppCtrl($rootScope, $scope, $window,$http, $compile, $timeout, $filter, $location, $route, httpRequestTracker, authorization ,$dialog,$modal,$log,service) {
    console.log('AppCtrl');
    //######################################## [START] INITIAL APPLICATION ########################################
    $rootScope.criteria = {};
    $rootScope.searchp = {};
    $rootScope.workList = {};
    $rootScope.redeem = {};
    $rootScope.app = {};
    $rootScope.hla = {};
    $rootScope.isBackProfile = true;
    $rootScope.document = document;
    $scope.httpRequestTracker = httpRequestTracker;
    $scope.authorization = authorization;


    $rootScope.app.apipath = APP.API_URL;

    $rootScope.criteria.notify = false



    $scope.randomItem = Math.floor(Math.random() * 26) + 1;
   
 
  
     $rootScope.socket = io('http://192.168.10.4:3000/');
     $rootScope.socket.on('chat message', function(msg) {
        console.log(msg);
        $scope.jobList = []
        $rootScope.search()
    })

    var session = JSON.parse($window.localStorage.getItem('session'))
    console.log(session);

    if (session) {
        $scope.$on('$routeChangeStart', function($event, newUrl, oldUrl) { 
            console.log(newUrl);
            // console.log(newUrl.$$route.originalPath);
    
            $scope.pyscRoute = newUrl.$$route.originalPath
            // $scope.authorization.requestCurrentUser(JSON.parse($window.localStorage.getItem('session')));

            // service.logActivityModel()
            // Check Authen
            
    
            $rootScope.app.user = {
                userCode:session.userid
               
              }
    
          });
    }else{
        // $scope.authorization.requestCurrentUser()
    }


    $scope.signout = function (){
        $window.localStorage.clear();
        $scope.authorization.requestCurrentUser()
    }


  





    // $routeChangeSuccess event handler
    $rootScope.$on("$routeChangeSuccess", function () {
        // clear search criteria when click menu
        if ($scope.isMenuClick || $scope.isMenuClick == "undefined") {
            $rootScope.criteria = {};
            $scope.isMenuClick = false;
        }
        // trigger jquery-lang
        $timeout(function () {
        }, 0);
    });

    $scope.aaa = []
    $scope.gotoPage = function (p){
        $location.path('/'+p)
        $scope.aaa[0] = 0


        console.log( $scope.aaa);
    }

    $scope.setMenuClick = function () {
        $scope.isMenuClick = true;
    };
    //######################################## [ END ] INITIAL APPLICATION ########################################

    //######################################## [START] SWITCH LANGUAGE ########################################

    $rootScope.app.switchLang = function (changeLang) {
        $rootScope.app.lang.change(changeLang);
        var url = $location.url();
        if (url.indexOf("?") > -1) {
            url = url + "&lang=" + $rootScope.app.lang.currentLang;
        } else {
            url = url + "?lang=" + $rootScope.app.lang.currentLang;
        }
        $location.url(url);
    };
    //######################################## [ END ] SWITCH LANGUAGE ########################################

    //######################################## [ START ] CHANGE PASSWORD ######################################
    $scope.app.openChangePasswordModal = function (p) {
        $scope.isSubmit = false;
        $('#changePass').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });

        $scope.changePass = {};
        $scope.confirm = {};

        if (p == 'C')
            $scope.closeBtn = 'Y';
        else
            $scope.closeBtn = 'N';
    };
    //######################################## [ END ] CHANGE PASSWORD ########################################



    $rootScope.app.oLanguage = function () {
        return {
            "sEmptyTable": $scope.app.lang.convert("No data available in table"),
            "sLengthMenu": $scope.app.lang.convert("Show _MENU_ records per page"),
            "sInfo": $scope.app.lang.convert("Showing _START_ to _END_ of _TOTAL_ entries"),
            "sInfoEmpty": $scope.app.lang.convert("Showing 0 to 0 of 0 entries")
        };
    };
    //######################################## [ END ] DATATABLES ########################################

    //######################################## [START] ALERT #############################################
    $rootScope.app.addAlert = function (type, msg, isCovertTxt) {
        var title = "";
        if (type == "gritter-info")
            title = "Information";
        else if (type == "gritter-success")
            title = "Success";
        else if (type == "gritter-warning")
            title = "Warning!";
        else if (type == "gritter-error")
            title = "Error!";

        var message = '';
        if (angular.isString(msg)) {
            if (isCovertTxt) {
                message = $scope.app.lang.convert(msg);
                if (!message) {
                    message = msg;
                }
            } else {
                message = msg;
            }
        } else if (angular.isObject(msg)) {
            message = msg['errName' + $scope.app.lang.currentLang];
        }

        $.gritter.add({
            title: $scope.app.lang.convert(title),
            text: message,
            class_name: type
        });
        return false;
    };
    //######################################## [ END ] ALERT #############################################

    //######################################## [START] DIALOG ########################################
    $scope.app.confirmBox = function (msg, negativeBtn, positiveBtn) {
        msg = $rootScope.app.lang.convert(msg);
        negativeBtn = $rootScope.app.lang.convert(negativeBtn);
        positiveBtn = $rootScope.app.lang.convert(positiveBtn);
        return $dialog.dialog({
            templateUrl: "template/modal/confirm.html"
            , dialogFade: true
            , backdropClick: false
            , keyboard: false
            , controller: "MessageBoxController"
            , resolve: {
                model: function () {
                    return {
                        title: null,
                        message: msg,
                        buttons: [{result: false, label: negativeBtn, cssClass: "btn-grey"}, {
                            result: true,
                            label: positiveBtn,
                            cssClass: "btn-primary"
                        }]
                    };
                }
            }
        });
    };

    $scope.app.confirmDeleteBox = function () {
        return $rootScope.app.confirmBox("Are you sure you want to delete?", "Cancel", "Delete");
    };
    $scope.app.confirmActionBox = function () {
        return $rootScope.app.confirmBox("Are you sure you want to Submit?", "Cancel", "Yes");
    };
    //######################################## [ END ] DIALOG ########################################

    //######################################## [ END ] GLOBAL SERVICES ########################################

    $scope.app.lovActiveStatus = [{
        "groupName": "ACTIVE_STATUS",
        "seqNo": 1,
        "listOfValueNameLc": "Active",
        "listOfValueNameEn": "Active",
        "value1": "A",
        "value2": null,
        "description": "Active",
        "status": null,
        "createdBy": null,
        "createdDate": null,
        "modifiedBy": null,
        "modifiedDate": null,
        "statusNameLc": null,
        "statusNameEn": null,
        "createdByNameLc": null,
        "createdByNameEn": null,
        "modifiedByNameLc": null,
        "modifiedByNameEn": null
    }, {
        "groupName": "ACTIVE_STATUS",
        "seqNo": 2,
        "listOfValueNameLc": "Inactive",
        "listOfValueNameEn": "Inactive",
        "value1": "I",
        "value2": null,
        "description": "Inactive",
        "status": null,
        "createdBy": null,
        "createdDate": null,
        "modifiedBy": null,
        "modifiedDate": null,
        "statusNameLc": null,
        "statusNameEn": null,
        "createdByNameLc": null,
        "createdByNameEn": null,
        "modifiedByNameLc": null,
        "modifiedByNameEn": null
    }];

    
    $rootScope.app.reload = function () {
        // $route.reload();
    };

}
