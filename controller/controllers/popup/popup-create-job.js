function createJobPopupCtrl($rootScope, $scope, $modalInstance, $http, $compile, $timeout, $filter, $location, $log, $route, $routeParams, $translate, myFunction, $modal, $window
    ,params_schd_id,params_invest_user,params_head_user) {
      $log.info('Enter createJobPopupCtrl');
  
      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  }
  