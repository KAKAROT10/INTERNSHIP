myApp.controller('HomeController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	$rootScope.global.locality = null;
	$rootScope.global.caseType = null;
    $rootScope.global.newCaseType = availableCaseTypes;
    $scope.function1 = function(){
        $rootScope.global.newCaseType = availableCaseTypes;
    };    
    $scope.function2 = function(){
        $rootScope.global.newCaseType = availableCACaseTypes;
    };
	
	$scope.goButtonClicked = function(){
		$location.url('/search');
	}
}]);