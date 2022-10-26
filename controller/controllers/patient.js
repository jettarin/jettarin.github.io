angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/patient/:cid',{templateUrl: _.toHttpGetUrl('content/patient/profile.html'),controller: PatientProfileCtrl});
} ]);

function PatientProfileCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service) {
	$log.info('Enter PatientProfileCtrl');



  	if (!$rootScope.paging) {
  		$rootScope.paging = APP.DEFAULT_PAGING;
  	}
  	if (!$rootScope.criteria) {
  		$rootScope.criteria = {};
  	}

      $scope.cid = $routeParams.cid;
      $scope.hospname = []
      service.hospname($rootScope.app.user.hospcode).then(function (resp){ 
          console.log(resp); 
          $scope.hospname = resp.data.results
        })
        console.log($scope.hospname);

      console.log('$scope.pyscRoute=',$scope.pyscRoute);
     
    $scope.getHospitalList = function (){
        $http({
            url:APP.API_URL+'/api/allergy/hospital-list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
              data:{
                  
                  cid: $scope.cid
              }
        }).then(function (resp){
            $scope.hospitalList = resp.data.results
            console.log('hospitalList=',$scope.hospitalList);
            $scope.hospitalSelect($scope.hospitalList[0].hospcode)
        })
    }
    $scope.getHospitalList()

    $scope.hospitalSelect = function (hc){
        console.log(hc);
        $scope.hospitalname = _.findWhere($scope.hospitalList, { hospcode : hc }).name
        $scope.getDrugAllergy(hc)
    }

    $scope.hdcHospitalSelect = function (hc,k){
        console.log($scope.drugHDCList);
        console.log(hc);
        $scope.selecthdchospname = k
        $scope.drugHDCByHcodeList = _.where($scope.drugHDCList, {HOSPCODE: hc});
        console.log($scope.drugHDCByHcodeList);
    }

    $scope.hlaHospitalSelect = function (hc){
        console.log($scope.hlaHospitalList);
        $scope.hlahospitalname = _.findWhere($scope.hlaHospitalList, { hospcode : hc }).name
        console.log('$scope.hlahospitalname=',$scope.hlahospitalname);
        $scope.getDrugAllergyHLA(hc)
    }


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
            $scope.patient.st_fname = ($scope.patient.patient_fname).substring(0, 2);
		
            // $scope.patient.patient_age = Math.floor(moment(new Date()).diff(moment($scope.patient.BIRTH,"YYYY-MM-DD"),'years',true))
            // moment($scope.patient.BIRTH) 
            var log = { 
                route:$scope.pyscRoute,
                patient_cid:$scope.cid,
                userid:$rootScope.app.user.userCode,
                patient_fullname:$scope.patient.patient_pname+$scope.patient.patient_fname+' '+$scope.patient.patient_lname
           }
     
           service.logActivity(log);
        })
    }
    $scope.getPatientProfile()

    // table
    $scope.getDrugAllergy = function (hcode){
        $http({
            url:APP.API_URL+'/api/allergy/drug-list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
              data:{
                  
                  cid: $scope.cid,
                  hospcode: hcode
              }
        }).then(function (resp){
            $scope.drugList = resp.data.results
            
            angular.forEach($scope.drugList,function (item){
                item.ssly = (item.allergy_seriousness_name).substring(0,7)
            })
            console.log($scope.drugList);
        })
		  
    }
    $scope.tab = 'HOSXP'
    $scope.selectedTab = function (v){
        console.log(v);
        $scope.tab = v
       if (v == 'HDC') {
        $scope.getHDCHospitalList();
        $scope.hdcHospitalSelect($scope.hdrugHDCList[0].HOSPCODE)

       }
    }

    
    $scope.getHDCHospitalList = function (){
        $http({
            url:APP.API_URL+'/api/allergy-hdc/drug-hdc-list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
            data:{
                // hospcode:$rootScope.app.user.hospcode,
                cid:$scope.cid
            }
        }).then(function (resp){
            $scope.hdrugHDCList = resp.data.results
            angular.forEach(_.sortBy($scope.hdrugHDCList, "hospname") ,function (item){
                item.hospname = item.informanthosp.name
            })
            $scope.hdcHospitalList = _.groupBy( _.sortBy($scope.hdrugHDCList, 'HOSPCODE') , 'hospname');
            angular.forEach($scope.hdcHospitalList,function (item){
                console.log(item);
            })
        })
    }
    $scope.getHDCHospitalList()

    $scope.getDrugAllergyHDC = function (){
        $http({
            url:APP.API_URL+'/api/allergy-hdc/drug-hdc-list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
            data:{
                // hospcode:$rootScope.app.user.hospcode,
                cid:$scope.cid
            }
        }).then(function (resp){
            $scope.drugHDCList = resp.data.results
            console.log($scope.drugHDCList);
            angular.forEach($scope.drugHDCList,function (item){
                item.hospname = item.informanthosp.name
            })
            
            console.log($scope.hospitalList);
        })
    }
    $scope.getDrugAllergyHDC();

    $scope.getHLAHospitalList = function (){
        $http({
            url:APP.API_URL+'/api/pcm/pharmacogenomics/hospital-list/'+$scope.cid,
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
              
        }).then(function (resp){
            $scope.hlaHospitalList = resp.data.results
            console.log('hlaHospitalList=',$scope.hlaHospitalList);
            $scope.hlaHospitalSelect($scope.hlaHospitalList[0].hospcode)
        })
    }
    $scope.getHLAHospitalList()

    $scope.getDrugAllergyHLA = function (hcode){

        $http({
            url:APP.API_URL+'/api/pcm/pharmacogenomic/drug-list',
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
            },
              data:{
                  
                  cid: $scope.cid,
                  hospcode: hcode
              }
        }).then(function (resp){
            $scope.drugAllergyHLAList = resp.data.results
            
            console.log('$scope.drugAllergyHLAList=',$scope.drugAllergyHLAList);

        })

       
    }
    $scope.getDrugAllergyHLA();
    

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
    $scope.gotPCM = function (){
        $location.path('/pharmacogenomic/'+$scope.cid)
    }
}
