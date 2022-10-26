angular.module('myApp').config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/user',{templateUrl: _.toHttpGetUrl('content/user/register.html'),controller: UserRegisterCtrl});
    $routeProvider.when('/user-reset-password',{templateUrl: _.toHttpGetUrl('content/user/reset.html'),controller: UserResetPasswordCtrl});
} ])
.controller('MyCtrl',['Upload','$window','$scope','$rootScope',function(Upload,$window,$scope,$rootScope){
    var vm = this;
    console.log('MyCtrl');

    vm.progressText = '0%'
    vm.submit = function (){
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.file.name = $rootScope.app.user.userCode+'_'+vm.file.name
            vm.file.userid = 1
            vm.upload(vm.file); //call upload function
        }

       


    }

    vm.submit_consent = function (){
       
console.log(vm.upload_consent_form);
        if (vm.upload_consent_form.consent_file.$valid && vm.consent_file) {
            vm.consent_file.name = $rootScope.app.user.userCode+'_'+vm.consent_file.name
            vm.consent_file.userid = 1
            vm.upload_consent(vm.consent_file); //call upload function
        }


    }
    console.log($rootScope);
    

    
    
    vm.upload = function (file) {
        console.log(file);
        

        Upload.upload({
            url: APP.API_URL+'/upload/'+$rootScope.app.user.userCode, //webAPI exposed to upload the file
            data:{
                file:file,
               
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log(resp);
                
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progressText = 'progress: ' + progressPercentage + '% '; // capture upload progress
            vm.progress = progressPercentage ; // capture upload progress
            $rootScope.criteria.getImage()

        });
    };

    vm.upload_consent = function (file) {
        
        Upload.upload({
            url: APP.API_URL+'/upload/consent/'+$rootScope.app.user.userCode, //webAPI exposed to upload the file
            data:{
                file:file,
               
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log(resp);
                
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progressText = 'progress: ' + progressPercentage + '% '; // capture upload progress
            vm.progress = progressPercentage ; // capture upload progress
            $rootScope.criteria.getImage()

        });
    };

}]);


function UserRegisterCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service,Upload,myFunction) {
	$log.info('Enter UserRegisterCtrl');

    
    $scope.save = function (){

        $scope.step = 'submit';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('UserRegisterCtrl save ');
        console.log($scope.hospital);
        console.log('$scope.tell=',$scope.tell);
        if ($scope.userList[0].certicate_file_path != null && $scope.userList[0].consent_file_path != null && $scope.tell != null) {
            myFunction.confirmSwalSaveBox().then(function (confirm){
            
                if (confirm) {
                    console.log('confirm=',confirm);
                    $http({
                        url:APP.API_URL+'/api/users/'+$rootScope.app.user.userCode,
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
                            hospname: _.findWhere($scope.hospitalList, {hospcode:$scope.hospital}).name ,
                            hospcode:_.findWhere($scope.hospitalList, {hospcode:$scope.hospital}).hospcode,
                            positionname:$scope.position,
                            license_exp_date:$scope.expdate,
                            
    
                        }
                    }).then(function (resp){
                        console.log(resp);
                        if (resp.data.ok) {
                            $scope.authorization.requestCurrentUser({tk:'Logout'});
                        }
                    })
                }else{
                    location.reload();
                 }
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วนทั้ง 3 ส่วน',
                footer: '<a href="">Why do I have this issue?</a>'
              })
        }

     
        
    }

    $scope.getData = function (){
        console.log($scope.hospital);
    }

    $rootScope.criteria.getImage = function (){
        $http({
            url:APP.API_URL+'/api/user/'+$rootScope.app.user.userCode,
            method:'GET',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			},

        }).then(function (resp){
            
            $scope.userList = resp.data.results
            console.log($scope.userList);
            $scope.prename = $scope.userList[0].prename
            $scope.firstname = $scope.userList[0].firstname
            $scope.lastname = $scope.userList[0].lastname
            $scope.cid = $scope.userList[0].cid
            $scope.tell = $scope.userList[0].tell
            $scope.email = $scope.userList[0].email
            $scope.hospital = $scope.userList[0].hospcode
            $scope.position = $scope.userList[0].positionname
            $scope.expdate = moment().format("YYYY-MM-") + moment().daysInMonth()
            // $scope.userList[0].hospcode
        })
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
        $rootScope.criteria.getImage()

    }
    $scope.getAllHospital()

    $scope.nextstep = function (step){
        if (step == 'submit') {
            return;
        }
        $scope.step = step
        $scope.stepText =  step < 4 ? 'next' : 'submit'
        
        console.log('step=',$scope.step);
        if (step == 5 ) {
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




function UserResetPasswordCtrl($rootScope, $scope, $http,$routeParams, $compile, $timeout, $filter, $location, $log, $route,$modal,myFunction,service,Upload,myFunction) {
	$log.info('Enter UserResetPasswordCtrl');

    
    $scope.save = function (p){

       

        myFunction.confirmSwalSaveBox().then(function (confirm){
            if (confirm) {
                $http({
                    url:APP.API_URL+'/api/users/'+$rootScope.app.user.userCode,
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $rootScope.app.user.token
                      },
                    data:{
                        password:$rootScope.criteria.password,
                        resetpassword:0

                    }
                }).then(function (resp){
                    console.log(resp);
                    if (resp.data.ok) {
                        $scope.authorization.requestCurrentUser({tk:'Logout'});
                    }
                })
            }
        })
        
    }

    $rootScope.criteria.getImage = function (){
        $http({
            url:APP.API_URL+'/api/user/'+$rootScope.app.user.userCode,
            method:'GET',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $rootScope.app.user.token
			},

        }).then(function (resp){
            
            $scope.userList = resp.data.results
            console.log($scope.userList);
            $scope.prename = $scope.userList[0].prename
            $scope.firstname = $scope.userList[0].firstname
            $scope.lastname = $scope.userList[0].lastname
            $scope.cid = $scope.userList[0].cid
            $scope.tell = $scope.userList[0].tell
            $scope.email = $scope.userList[0].email
        })
    }
   
    $rootScope.criteria.getImage()

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


    var KTSignupGeneral = (function () {
        var e,
            t,
            a,
            s,
            r = function () {
                return 100 === s.getScore();
            };
        return {
            init: function () {
                console.log('teset');
                (e = document.querySelector("#kt_sign_up_form")),
                    (t = document.querySelector("#kt_sign_up_submit")),
                    (s = KTPasswordMeter.getInstance(e.querySelector('[data-kt-password-meter="true"]'))),
                    (a = FormValidation.formValidation(e, {
                        fields: {                            
                            password: {
                                validators: {
                                    notEmpty: { message: "The password is required1111" },
                                    callback: {
                                        message: "Please enter valid password",
                                        callback: function (e) {
                                            console.log('e=',e);
                                            if (e.value.length > 0){
                                                
                                                return r();
                                            }
                                             
                                        },
                                    },
                                },
                            },
                            "confirm-password": {
                                validators: {
                                    notEmpty: { message: "The password confirmation is required" },
                                    identical: {
                                        compare: function () {
                                            console.log('compare');
                                            console.log(e.querySelector('[name="password"]').value);
                                            return e.querySelector('[name="password"]').value;
                                        },
                                        message: "The password and its confirm are not the same",
                                    },
                                },
                            },
                            toc: { validators: { notEmpty: { message: "You must accept the terms and conditions" } } },
                        },
                        plugins: { trigger: new FormValidation.plugins.Trigger({ event: { password: !1 } }), bootstrap: new FormValidation.plugins.Bootstrap5({ rowSelector: ".fv-row", eleInvalidClass: "", eleValidClass: "" }) },
                    })),
                    t.addEventListener("click", function (r) {
                        r.preventDefault(),
                            a.revalidateField("password"),
                            a.validate().then(function (a) {
                                "Valid" == a
                                    ? (t.setAttribute("data-kt-indicator", "on"),
                                        (t.disabled = !0),
                                        setTimeout(function () {
                                            t.removeAttribute("data-kt-indicator"),
                                                (t.disabled = !1),
                                                Swal.fire({ 
                                                    text: "You have successfully reset your password!", 
                                                    icon: "success", 
                                                    buttonsStyling: !1, 
                                                    showCancelButton: false,
                                                    confirmButtonText: "Ok, got it!", 
                                                    customClass: { confirmButton: "btn btn-primary" } }).then(
                                                    function (t) {


                                                        console.log('t=', t);
                                                        $scope.save();

                                                    }
                                                );
                                        }, 1500))
                                    : Swal.fire({
                                        text: "Sorry, looks like there are some errors detected, please try again.",
                                        icon: "error",
                                        buttonsStyling: !1,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: { confirmButton: "btn btn-primary" },
                                    });
                            });
                    }),
                    e.querySelector('input[name="password"]').addEventListener("input", function () {
                        this.value.length > 0 && a.updateFieldStatus("password", "NotValidated");
                    });
            },
        };
    })();

    KTUtil.onDOMContentLoaded(function () {
        KTSignupGeneral.init();
    });
}