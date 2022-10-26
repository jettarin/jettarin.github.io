angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/search',{templateUrl: _.toHttpGetUrl('content/search/horizontal.html'),controller: SearchListCtrl});
} ]);

function SearchListCtrl($rootScope, $scope, $http, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service) {
	$log.info('Enter SearchListCtrl');



  	if (!$rootScope.paging) {
  		$rootScope.paging = APP.DEFAULT_PAGING;
  	}
  	if (!$rootScope.criteria) {
  		$rootScope.criteria = {};
  	}

	$scope.showlog = true;  


	$scope.save = function (){
                $http({
                    url:APP.API_URL+'/api/allergy/create/',
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },
                    data:{
                        cid:$rootScope.hla.cid,
                        pname:$rootScope.hla.pname,
                        fname:$rootScope.hla.fname,
                        lname:$rootScope.hla.lname,
                        hn:$rootScope.hla.hn,
						drugname:'HLA Generator',
                    }
                }).then(function (){
					$rootScope.searchp.CID = $rootScope.hla.cid
                    $scope.search()
                })
    }


    // table
    $scope.search = function (){
		$scope.showlog = false;  		
  		angular.extend($rootScope.criteria, $rootScope.paging);
		  console.log($rootScope.searchp);
		  
		



		  $http({
			  url:APP.API_URL+'/api/allergy/patient-profile',
			  method:'POST',
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			},
			  data:{
				cid : $rootScope.searchp.CID,
				fname : $rootScope.searchp.NAME,
				lname : $rootScope.searchp.LNAME
			  }

		  }).then(function (resp){
			  console.log(resp);
			  $scope.patientList = resp.data.results
			  console.log($scope.patientList);
			  angular.forEach($scope.patientList,function (item){
				  console.log(item);
				  item.st_fname = (item.NAME).substring(0, 2);
				  item.patient_fname = item.NAME
				  item.patient_lname = item.LNAME
				  item.patient_cid = item.CID
			  })
		  })
    }

	$scope.searchLog = function (){
		$http({
			url:APP.API_URL+'/api/log/patient-log',
			method:'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': 'Bearer ' + $rootScope.app.user.token
		  },
		  data:{
		
			  userid:$rootScope.app.user.userCode
		  }
		}).then(function (resp){
			$scope.patientLogList = resp.data.results
			console.log($scope.patientLogList);
		})
	}


	$scope.loadMore = function() {
		var increamented = $rootScope.paging.limit + 6;
		$rootScope.paging.limit = increamented > $scope.patientLogList.length ? $scope.patientLogList.length : increamented;

		console.log($rootScope.paging.limit);
	  };

	$scope.searchLog()
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
  		location.reload();
  	}

	$scope.profile = function (id){
		$location.path('/patient/'+id)
	}

	$scope.back = function (){
		window.history.back()
	}


}
