var myApp = angular.module('myApp', ['ngRoute','autocomplete','angulartics','angulartics.google.analytics']);

myApp
.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', 							{templateUrl: 'partials/welcome.html?version=1', controller: 'HomeController'})
		.when('/login', 					{templateUrl: 'partials/login.html?version=1', controller: 'LoginController'})
		.when('/register', 					{templateUrl: 'partials/register.html?version=1', controller: 'RegisterController'})
		.when('/registerCA',				{templateUrl: 'partials/register.html?version=1', controller: 'RegisterController'})
		.when('/registerUser',				{templateUrl: 'partials/registerUser.html?version=1', controller: 'RegisterUserController'})
		.when('/submitQuery', 				{templateUrl: 'partials/submitQuery.html?version=1', controller: 'SubmitQueryController'})
		.when('/search', 					{templateUrl: 'partials/search.html?version=1', controller: 'SearchController'})
		.when('/details/:id', 				{templateUrl: 'partials/details.html?version=1', controller: 'DetailsController'})
		.when('/order/:id', 				{templateUrl: 'partials/order.html?version=1', controller: 'OrderController'})
		.when('/orderSuccess', 				{templateUrl: 'partials/orderSuccess.html?version=1'})
		.when('/legalWisdom',				{templateUrl: 'partials/legalWisdom.html?version=1', controller: 'StaticController'})
		.when('/contactus',					{templateUrl: 'partials/contactUs.html?version=1', controller: 'StaticController'})
		.when('/aboutus',					{templateUrl: 'partials/aboutUs.html?version=1', controller: 'StaticController'})
		.when('/disclaimer',				{templateUrl: 'partials/disclaimer.html?version=1', controller: 'StaticController'})
		.when('/editLawyerProfile/:id',		{templateUrl: 'partials/register.html?version=1', controller: 'EditLawyerProfileController'})
		.when('/editUserProfile/:id',		{templateUrl: 'partials/registerUser.html?version=1', controller: 'EditUserProfileController'})
		.when('/manageUsers',				{templateUrl: 'partials/manageUsers.html?version=1', controller: 'ManageUsersController'})
		.when('/manageQueries',				{templateUrl: 'partials/manageQueries.html?version=1', controller: 'ManageQueriesController'})
		.otherwise({ redirectTo: '/' });
	
	// use the HTML5 History API
	$locationProvider.html5Mode(false);

}).run(['$rootScope','$location','$http',function($rootScope, $location, $http){
	$rootScope.global = {
		'location' : null,
		'caseType' : null,
		'allLanguages' : availableLanguages,
		'availableLocalities' : availableLocalities,
		'selectedCities' : Object.keys(availableLocalities),
		'allCaseTypes' : getUniqueArray(availableCaseTypes.concat(availableCACaseTypes)).sort(),
		'allLawyerCaseTypes' : availableCaseTypes,
		'allCACaseTypes' : availableCACaseTypes,
		'allCities' : availableCities,
		'city' : 'Bangalore',
		'solrURL' : 'www.getmyadvisor.com'
	};

	/*$rootScope.buttonHighlight = {};

	$rootScope.$on('$locationChangeStart', function(event, next, current) {
		$rootScope.buttonHighlight = {};
		if($location.path() != '/'){
			$rootScope.buttonHighlight[$location.path().substr(1)] = true;
		}
	});*/

	$rootScope.go = function(location){
		$location.path(location);
	}

	var storedCookieVal = getCookie('loggedInUserID');
	if(storedCookieVal){
		if(storedCookieVal == "admin"){
			// success login
			$rootScope.user = {
				'firstName' : 'Get My Advisor',
				'mode' : 'Admin'
			};
		} else {
			$http.get('http://'+$rootScope.global.solrURL+'/solr/getmyadvisor/select?q=id:'+storedCookieVal+'&wt=json&indent=true&rows=100').
			then(function(response) {
				if(response.data.response.numFound == 0){
					$rootScope.logout();
					return;
				}

				$rootScope.user = response.data.response.docs[0];
			}, function(response) {
			});
		}
	}

	$rootScope.logout = function(){
		setCookie('loggedInUserID', '', -2);
		delete $rootScope.user;
		$location.path('/');
	}
	
	// to open sub-menu items in navbar when hover on menu items
	$(".dropdown")
    .mouseenter(function() {
        $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
        $(this).toggleClass('open');
        $('b', this).toggleClass("caret caret-up");                
    })
    .mouseleave(function() {
        $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
        $(this).toggleClass('open');
        $('b', this).toggleClass("caret caret-up");                
	});

	// to close the collapse menu of navbar when a link inside it is clicked; copied from "http://stackoverflow.com/a/22917099"
    $(document).on('click','.navbar-collapse.in',function(e) {
	    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
	        $(this).collapse('hide');
	    }
	});
}]);