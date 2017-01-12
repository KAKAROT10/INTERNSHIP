myApp.controller('SubmitQueryController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	$scope.query = {};

	$scope.submitData = function(){
		// now add record
		$http.post('http://'+$rootScope.global.solrURL+'/solr/getmyadvisor/update?wt=json', 
			{
				'add' : {
					'boost': 1,
					'commitWithin': 1000,
					'overwrite' : true,
					'doc' : $scope.query
				}
			}
		).
		then(function(response) {
			alert("Record Added successfully!");
		}, function(response) {
			alert("Error Adding Record!");
		});
	}
}]);