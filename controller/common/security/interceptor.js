angular.module('security.interceptor', [])

// This http interceptor listens for authentication failures
.factory('securityInterceptor', ['$q', '$location', '$rootScope', function($q, $location, $rootScope) {
  return {
    // optional method
    'request': function(config) {
      // do something on success
      return config || $q.when(config);
    },
 
    // optional method
   'requestError': function(rejection) {
      // do something on error
      return $q.reject(rejection);
    },
 
    // optional method
    'response': function(response) {
      // do something on success
      return response || $q.when(response);
    },
 
    // optional method
   'responseError': function(rejection) {
      // do something on error
	  if (rejection.status === 401) {					// No authorize
//        document.location = 'login.jsp';
        document.location = 'logout'+'?d='+moment().valueOf();
	  } else if (rejection.status === 599) {			// Internal application error
		$rootScope.app.addAlert('error', rejection.data);
		if (rejection.data.errCode === PIM.EVENT_ERR_VERSION) {
			$rootScope.$broadcast(PIM.EVENT_ERR_VERSION, PIM.EVENT_ERR_VERSION);	// Broadcast event ERR-VERSION
		}
	  }
      return $q.reject(rejection);
    }
  };
}])
 
// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('securityInterceptor');
}]);
