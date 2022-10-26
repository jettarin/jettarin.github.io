angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/agent',{templateUrl: _.toHttpGetUrl('content/agent/manager.html'),controller: AgentManagerCtrl});
} ]);

function AgentManagerCtrl($rootScope, $scope, $http, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction) {
	$log.info('Enter AgentManagerCtrl');

	$scope.tab = 'overview'

	$scope.selectTab = function (t){

		switch (t) {
			case 'overview':
				angular.element(document.querySelector("#download")).removeClass("active");
				angular.element(document.querySelector("#overview")).addClass("active");
				break;
			case 'download':
				angular.element(document.querySelector("#overview")).removeClass("active");
				angular.element(document.querySelector("#download")).addClass("active");
				break;
			default:
				break;
		}
		
		$scope.tab = t
	}

	$scope.copyToClipboard = function(string) {
		navigator.clipboard.writeText(string)
			.then(function (){
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: 'Data Copied',
					text: string,
					showConfirmButton: true,
				
				});
			});
	}

  	if (!$rootScope.paging) {
  		$rootScope.paging = APP.DEFAULT_PAGING;
  	}
  	if (!$rootScope.criteria) {
  		$rootScope.criteria = {};
  	}
	  console.log($rootScope.app);

	  $scope.getAgent = function (){
		  $http({
			  url:APP.API_URL+'/api/agent/agent-by-hospcode',
			  method:'POST',
			  headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			  },
              data:{
                  hospcode:$rootScope.app.user.hospcode
              }
			 
		  }).then(function (resp){
			  $scope.agent = resp.data.results[0]
              $scope.agent.activedate = moment($scope.agent.lastupdate).format("Do MMM YYYY")
		  })
	  }
	  $scope.getAgent()

      $scope.getPatientTotal = function (){
        $http({
            url:APP.API_URL+'/api/allergy/patient-total',
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
            data:{
                hospcode:$rootScope.app.user.hospcode
            }
           
        }).then(function (resp){
            $scope.patientTotal = resp.data.results
            
          
        })
      }
      $scope.getPatientTotal()


      $scope.getHRList = function (){
        $scope.hrList = Array.from( Array(24).keys() )
      }
      $scope.getHRList()
      



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

    $scope.saveRepeatTime = function (t){
         myFunction.confirmSwalSaveBox().then(function (resp){
            console.log(resp);
            if (resp) {
                $http({
                    url:APP.API_URL+'/api/agent/update-repeat-time',
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },
                    data:{
                        id:$scope.agent.id,
                        time:t
                    }
                }).then(function (resp){
                    console.log(resp);
                    $scope.getAgent()
                })
            }else{
                $scope.getHRList()
            }
        })
    
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
