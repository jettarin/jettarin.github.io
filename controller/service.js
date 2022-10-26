angular.module('services.service', [])

    .service('service', ['$rootScope', '$route', '$translate', '$modal', '$http', function ($rootScope, $route, $translate, $modal, $http) {




        this.pagination = function (total,limit){
            console.log(total);
            console.log(limit);
            let mypage = total/limit
            console.log(mypage);
        }

        this.logActivity = function (v){
            console.log(v);
            $http({
                url:APP.API_URL+'/api/log/create',
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $rootScope.app.user.token
                },
                data:v
            })
        }

        this.hospname = function (v){
          return $http({
                url:APP.API_URL+'/api/hosp/hospcode',
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $rootScope.app.user.token
                },
                data:{
                    hospcode : v
                }
            }).then(function (resp){
                return  resp
            })
            
        }


    }]);
