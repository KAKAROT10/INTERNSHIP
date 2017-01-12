myApp.controller('DetailsController', ['$rootScope', '$scope', '$http', '$location', '$routeParams', function($rootScope, $scope, $http, $location, $routeParams) {
	$http.get('http://'+$rootScope.global.solrURL+'/solr/getmyadvisor/select?q=id:'+$routeParams.id+'&wt=json&indent=true&rows=100').
	then(function(response) {
		if(response.data.response.numFound == 0){
			$location.path('/');
			return;
		}

		$scope.lawyer = response.data.response.docs[0];
		loadMap($scope.lawyer.locality, $scope.lawyer.city, $scope.lawyer.id);
	}, function(response) {
	});
}]);