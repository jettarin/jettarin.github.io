angular.module('myApp').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/job', { templateUrl: _.toHttpGetUrl('content/job/detail.html'), controller: JobCtrl });
}]);

function JobCtrl($rootScope, $scope, $http, $compile, $timeout, $filter, $location, $log, $route, $modal, myFunction) {
    $log.info('Enter JobCtrl');




    if (!$rootScope.paging) {
        $rootScope.paging = APP.DEFAULT_PAGING;
    }
    if (!$rootScope.criteria) {
        $rootScope.criteria = {};
    }

    $scope.getAllDepartment = function () {

        $http({
            url: APP.API_URL+'api/getDepartment.php',
            method: 'POST',

        }).then(function (resp) {
            console.log(resp);
            $scope.departmentList = resp.data

        })







    }
    $scope.getAllDepartment()


    $scope.getCostCenterByTell = function (t) {
        console.log(t);


        $http({
            url: APP.API_URL+'api/getDepartmentByPhone',
            method: 'POST',
            data: {
                msg: t
            }
        }).then(function (resp) {
            console.log(resp);
            $scope.depList = resp.data
        })
    }





    // table
    $rootScope.search = function () {

        console.log($rootScope.paging.pageNumber);
        if ($rootScope.criteria.preName == undefined) {
            $rootScope.criteria.preName = ''
        }
        if ($rootScope.criteria.firstName == undefined) {
            $rootScope.criteria.firstName = ''
        }
        if ($rootScope.criteria.lastName == undefined) {
            $rootScope.criteria.lastName = ''
        }
        if ($rootScope.criteria.costID == undefined) {
            $rootScope.criteria.costID = ''
        }
        if ($rootScope.criteria.positionName == undefined) {
            $rootScope.criteria.positionName = ''
        }
        if ($rootScope.criteria.role == undefined) {
            $rootScope.criteria.role = ''
        }


        angular.extend($rootScope.criteria, $rootScope.paging);


        $http.get(APP.API_URL+'api/getJobByDate.php').then(function (resp) {
            console.log(resp);

            $scope.jobList = resp.data
            angular.forEach($scope.jobList,function (item){
                item.jobdatetime = moment(item.job_last_update.date).format('HH:mm')
            })
        })

    }
    $rootScope.search()


    $scope.createJob = function () {
        $http({
            url: APP.API_URL+'api/createJob',
            method: 'POST',
            data: {
                user_id: $rootScope.app.user.userCode,
                header: $scope.jobheader,
                description: $scope.jobdesc,
                depid: $scope.depid,
                tell: $scope.tell
            }
        }).then(function (resp) {
            console.log('resp=', resp);
            $scope.createdJob = resp.data
            if ($scope.createdJob == '1') {
                $rootScope.socket.emit('chat message', $scope.userid + ' save success');
                $rootScope.search()
            }
        })
    }

    $scope.updatePhoneNumber = function (id) {
        $http({
            url: APP.API_URL+'api/createDepartmentPhone',
            method: 'POST',
            data: {
                costid: $scope.costid,
                phonenumber: $scope.phonenumber
            }
        }).then(function (resp) {
            console.log('resp=', resp);
            $scope.updateCostCenter = resp.data
            if ($scope.updateCostCenter == '1') {
                $rootScope.search()
            }
        })
    }

    $scope.newjob = function (d) {
        console.log(d);
        $scope.depid = d.Cost_SKTHM
    }

    $scope.selectPage = function (page) {
        $rootScope.paging.pageNumber = page;
        $scope.search();
    };
    $scope.gotoCreate = function () {
        $location.path('/position/create')
    }
    $scope.gotoEdit = function (id) {
        $location.path('/position/edit/' + id)
    }
    $scope.clear = function () {
        $rootScope.criteria = {};
        $scope.search()
    }

    $scope.gotoEdit = function (id) {
        $location.path('/user/edit/' + id)
    }

    $scope.delete = function (id) {
        $http({
            url: APP.API_URL+'api/delete',
            method: 'POST',
            data: {
                id: id
            }
        }).then(function (resp) {
            console.log('resp=', resp);
            $scope.deleteJob = resp.data
            if ($scope.deleteJob == '1') {
                $rootScope.socket.emit('chat message', $scope.userid + ' save success');
                $rootScope.search()
            }
        })
    }

    $scope.back = function () {
        window.history.back()
    }
}
