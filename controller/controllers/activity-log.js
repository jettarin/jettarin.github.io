angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/activity-log-list',{templateUrl: _.toHttpGetUrl('content/activity-log/activity-log-list.html'),controller: LogListCtrl});
    
} ])


function LogListCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service,Upload,myFunction) {
	$log.info('Enter LogListCtrl');


    






    $scope.search = function (){
        $http({
            url:APP.API_URL+'/api/log/list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
              },
           
        }).then(function (resp){
            console.log(resp);
            $scope.logList = resp.data.results
            angular.forEach($scope.logList,function (item){
                item.dateactivity = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss')
            })
            
        })
    }
    $scope.search()

  	$scope.selectPage = function(page) {
  		$rootScope.paging.pageNumber = page;
  		$scope.search();
  	};
  	$scope.gotoCreate = function (){
  		$location.path('/user/create')
  	}
  	$scope.gotoEdit = function (id){
  		$location.path('/position/edit/'+id)
  	}
  	$scope.clear = function (){
  		$rootScope.criteria = {};
  		$scope.search()
  	}
      $scope.createJob = function (){
          console.log('save');
      }
	$scope.gotoEdit = function (id){
		$location.path('/user/edit/'+id)
	}
    $scope.delete = function (id){
        myFunction.confirmSwalDeleteBox().then(function (ok){
            if (ok) {
                   $http({
                       url:APP.API_URL+'/api/users/'+id,
                       method:'DELETE',
                       headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },

                   }).then(function (resp){
                       console.log(resp);
                       $scope.deleted = resp.data.ok
                       if ($scope.deleted) {
                           $scope.search()
                       }
                   })
            }
        })
    }

	$scope.back = function (){
		window.history.back()
	}
}

