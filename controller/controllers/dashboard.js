angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/',{templateUrl: _.toHttpGetUrl('content/dashboard/detail.html'),controller: DashBoardCtrl});
} ]);

function DashBoardCtrl($rootScope, $scope, $http, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction) {
	$log.info('Enter DashBoardCtrl');



  	if (!$rootScope.paging) {
  		$rootScope.paging = APP.DEFAULT_PAGING;
  	}
  	if (!$rootScope.criteria) {
  		$rootScope.criteria = {};
  	}


	$scope.gotoJob = function (){
		$location.path('/job')
	}
	



    // table
    $scope.search = function (){
  		console.log($rootScope.paging.pageNumber);
  		if($rootScope.criteria.preName == undefined){
  			$rootScope.criteria.preName = ''
  		}
  		if ($rootScope.criteria.firstName == undefined){
  			$rootScope.criteria.firstName = ''
  		}
  		if($rootScope.criteria.lastName == undefined){
  			$rootScope.criteria.lastName = ''
  		}
      if($rootScope.criteria.costID == undefined){
  			$rootScope.criteria.costID = ''
  		}
      if($rootScope.criteria.positionName == undefined){
  			$rootScope.criteria.positionName = ''
  		}
			if($rootScope.criteria.role == undefined){
  			$rootScope.criteria.role = ''
  		}


  		angular.extend($rootScope.criteria, $rootScope.paging);

      
    }

    $scope.search()




  	$scope.selectPage = function(page) {
  		$rootScope.paging.pageNumber = page;
  		$scope.search();
  	};
  	$scope.gotoCreate = function (){
  		$location.path('/position/create')
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


	$scope.back = function (){
		window.history.back()
	}
}
