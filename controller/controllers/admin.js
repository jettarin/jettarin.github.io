angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/user-list',{templateUrl: _.toHttpGetUrl('content/admin/user-list.html'),controller: UserListCtrl});
    $routeProvider.when('/user/:mode/:id',{templateUrl: _.toHttpGetUrl('content/admin/user-detail.html'),controller: UserDetailCtrl});
    $routeProvider.when('/user/:mode/',{templateUrl: _.toHttpGetUrl('content/admin/user-detail.html'),controller: UserDetailCtrl});
} ])


function UserListCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service,Upload,myFunction) {
	$log.info('Enter UserListCtrl');

    
  

  
   

    

    $scope.search = function (v){
        $http({
            url:APP.API_URL+'/api/users/',
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.app.user.token
              },
           
        }).then(function (resp){
            console.log(resp);
            $scope.userList = resp.data.results.rows
            if (v) {
                $scope.userList = $filter('filter')($scope.userList, function(value){return (value.role == v);});
            }
            
        })
    }
    $scope.search()
    $scope.userFilter = function (r){
        $scope.search(r)
        
    }

    
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

function UserDetailCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service,Upload,myFunction) {
	$log.info('Enter UserDetailCtrl');


    $scope.id = $routeParams.id;
    $scope.mode = $routeParams.mode;
    
    $scope.save = function (){

        $scope.step = 'submit';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('UserRegisterCtrl save ');
        console.log($scope.hospital);
        console.log('role=',$scope.role);
       
        
        myFunction.confirmSwalSaveBox().then(function (confirm){
            let hospObj = _.where($scope.hospitalList, {hospcode: $scope.hospital})
            console.log(_.where($scope.hospitalList, {hospcode: $scope.hospital}));
            
            if (confirm) {
                console.log('confirm=',confirm);
                $http({
                    url:APP.API_URL+'/api/users/'+$scope.id,
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },
                    data:{
                        firstname:$scope.firstname,
                        lastname:$scope.lastname,
                        prename:$scope.prename,
                        cid:$scope.cid,
                        tell:$scope.tell,
                        email:$scope.email,
                        hospname:hospObj[0].name,
                        hospcode:hospObj[0].hospcode,
                        positionname:$scope.position,
                        license_exp_date:$scope.expdate,
                        role: $scope.role
                    }
                }).then(function (resp){
                    console.log(resp);
                    if (resp.data.ok) {
                        $scope.back()
                    }
                })
            }
        })
        
    }

    $rootScope.criteria.getImage = function (){
        $http({
            url:APP.API_URL+'/api/user/'+$scope.id,
            method:'GET',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			},

        }).then(function (resp){
            console.log(resp);
            $scope.userList = resp.data.results
            $scope.prename = $scope.userList[0].prename
            $scope.firstname = $scope.userList[0].firstname
            $scope.lastname = $scope.userList[0].lastname
            $scope.cid = $scope.userList[0].cid
            $scope.licenseno = $scope.userList[0].licenseno
            $scope.tell = $scope.userList[0].tell
            $scope.email = $scope.userList[0].email
            $scope.position = $scope.userList[0].positionname
            $scope.hospital = $scope.userList[0].hospcode
            $scope.expdate = $scope.userList[0].license_exp_date
            $scope.role =  $scope.userList[0].role
        })
    }
   


    if ($scope.mode == 'edit') {
        $rootScope.criteria.getImage()
    }
    
    // step 1
    $scope.$watch('prename', function (){
        $scope.prename = !$scope.prename ? null : $scope.prename
    });
    $scope.$watch('firstname', function (){
        $scope.firstname = !$scope.firstname ? null : $scope.firstname
    });
    $scope.$watch('lastname', function (){
        $scope.lastname = !$scope.lastname ? null : $scope.lastname
    });
    $scope.$watch('cid', function (){
        $scope.cid = !$scope.cid ? null : $scope.cid
    });
    $scope.$watch('tell', function (){
        console.log('tell');
        $scope.tell = !$scope.tell ? null : $scope.tell
    });
    $scope.$watch('email', function (){
        $scope.email = !$scope.email ? null : $scope.email
    });
    $scope.getAllHospital = function (){
        $http({
            url:APP.API_URL+'/api/hosp/hospital',
            method:'GET',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			},

        }).then(function (resp){
            $scope.hospitalList = resp.data.results
            console.log($scope.hospitalList);
        })
    }
    $scope.getAllHospital()

    $scope.nextstep = function (step){
        if (step == 'submit') {
            return;
        }
        $scope.step = step
        $scope.stepText =  step < 3 ? 'next' : 'submit'
        
        console.log('step=',$scope.step);
        if (step == 4 ) {
            $scope.save()
        }

    }
    $scope.nextstep(1)

    
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