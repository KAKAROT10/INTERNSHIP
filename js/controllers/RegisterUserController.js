myApp.controller('RegisterUserController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	$scope.mode="register";
	$scope.person = {};
	$scope.person.mode = 'User';

	$scope.submitData = function(){
		// validations
		if(!$scope.person.email) {
			alert("Email is required!");
			return;
		}
		if(!$scope.person.password) {
			alert("Password is required!");
			return;
		}
		
		// now add record
		$scope.person.id = $scope.person.firstName+$scope.person.lastName+$scope.person.mode+(new Date().getTime());
		
		// keep him active by default
		$scope.person.active = true;

		$http.post('http://'+$rootScope.global.solrURL+'/solr/getmyadvisor/update?wt=json', 
			{
				'add' : {
					'boost': 1,
					'commitWithin': 1000,
					'overwrite' : true,
					'doc' : $scope.person
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