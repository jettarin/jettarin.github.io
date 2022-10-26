angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/pharmacogenomic/:cid',{templateUrl: _.toHttpGetUrl('content/pcm/detail.html'),controller: PharmaCogenomicCtrl});
} ]);

function PharmaCogenomicCtrl($rootScope, $scope, $http, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,$routeParams) {
	$log.info('Enter PharmaCogenomicCtrl');


  	if (!$rootScope.paging) {
  		$rootScope.paging = APP.DEFAULT_PAGING;
  	}
  	if (!$rootScope.criteria) {
  		$rootScope.criteria = {};
  	}

    $scope.cid = $routeParams.cid;

    $scope.getPatientProfile = function (){
        $http({
            url:APP.API_URL+'/api/allergy/patient-profile',
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + $rootScope.app.user.token
          },
            data:{
                
                cid: $scope.cid
            }
        }).then(function (resp){
            console.log('resp=',resp);
            $scope.patient = resp.data.results[0]
		
     
        })
    }
    $scope.getPatientProfile()

      $scope.search = function (){
        $http({
            url:APP.API_URL+'/api/pcm/pharmacogenomic/'+$scope.cid,
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
              },
           
        }).then(function (resp){
           console.log(resp);
            $scope.pcmList = resp.data.results
            console.log($scope.pcmList);
        })
    }
    $scope.search()

    $scope.searchCID = function (cid){
        $location.path('/pharmacogenomic/'+cid)
    }

    $scope.test_resultp = []
    $scope.report_datep = []
    $scope.notep = []
    

    $scope.openEdit = function (v){
        $scope.editStatus = [];
        $scope.editStatus[v.pcm_id] = true;
        console.log(v);
        $scope.test_resultp[v.pcm_id] = v.pcm_test_result
        $scope.report_datep[v.pcm_id] = v.pcm_report_date
        $scope.notep[v.pcm_id] = v.pcm_note
    }
    $scope.cancelEdit = function (){
        $scope.editStatus = [];
    }

    $scope.edit = function (id){
        $http({
            url:APP.API_URL+'/api/pcm/pharmacogenomics/'+id,
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
              },
            data:{
                pcm_pt_cid:$scope.cid,
                pcm_pt_hospcode:$rootScope.app.user.hospcode,
                pcm_test_result:$scope.test_resultp[id],
                pcm_report_date:$scope.report_datep[id],
                pcm_pt_pname:$scope.patient.patient_pname,
                pcm_pt_fname:$scope.patient.patient_fname,
                pcm_pt_lname:$scope.patient.patient_lname,
                pcm_note:$scope.notep[id],
                pcm_created_by:$rootScope.app.user.userCode,
                pcm_update_by:$rootScope.app.user.userCode
            }
        }).then(function (resp){
            console.log(resp);
            $scope.test_result = ''
            $scope.report_date = ''
            $scope.note = ''
            $scope.editStatus = [];
            $scope.search()
        })
    }


    $scope.save = function (){
        myFunction.confirmSwalSaveBox().then(function (confirm){
            if (confirm) {
                $http({
                    url:APP.API_URL+'/api/pcm/pharmacogenomics/',
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },
                    data:{
                        pcm_pt_cid:$scope.cid,
                        pcm_pt_hospcode:$rootScope.app.user.hospcode,
                        pcm_test_result:$scope.test_result,
                        pcm_report_date:$scope.report_date,
                        pcm_pt_pname:$scope.patient.patient_pname,
                        pcm_pt_fname:$scope.patient.patient_fname,
                        pcm_pt_lname:$scope.patient.patient_lname,
                        pcm_note:$scope.note,
                        pcm_created_by:$rootScope.app.user.userCode,
                        pcm_update_by:$rootScope.app.user.userCode
                    }
                }).then(function (resp){
                    console.log(resp);
                    $scope.test_result = ''
                    $scope.report_date = ''
                    $scope.note = ''
                    $scope.search()
                })
            }
        })
    }


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

    $scope.delete = function (id){
        myFunction.confirmSwalDeleteBox().then(function (ok){
            if (ok) {
                   $http({
                       url:APP.API_URL+'/api/pcm/pharmacogenomics/'+id,
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
}
