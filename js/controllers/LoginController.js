myApp.controller('LoginController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	$scope.submitData = function(){
		// validations
		if(!$scope.email) {
			alert("Email is required!");
			return;
		}
		if(!$scope.password) {
			alert("Password is required!");
			return;
		}

		// check for admin
		if($scope.email == 'admin@getmyadvisor.com'){
			if($scope.password == 'admin'){
				// success login
				$rootScope.user = {
					'firstName' : 'Get My Advisor',
					'mode' : 'Admin'
				};
				setCookie('loggedInUserID', "admin", $scope.rememberMe?2:'');
				$location.path('/');
				return;
			} else {
				alert('Invalid login!');
				return;
			}
		}

		// now query 
		var queryString = 'mode:* AND active:true ';
		queryString += 'AND email:('+escape($scope.email)+')';
		queryString += 'AND password:('+escape($scope.password)+')';

		$http.get('http://'+$rootScope.global.solrURL+'/solr/getmyadvisor/select?q='+queryString+'&wt=json&indent=true&rows=10').
		then(function(response) {
			if(response.data.response.numFound != 1){
				alert('Invalid login!');
				return;
			}

			// success login
			$rootScope.user = response.data.response.docs[0];
			setCookie('loggedInUserID', $rootScope.user.id, $scope.rememberMe?2:'');
			$location.path('/');
		}, function(response) {
		});
	};
}]);