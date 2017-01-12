myApp.controller('SearchController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	$scope.facets = [
		{name: 'Profession', fieldName:'mode'}, 
		{name: 'Case Types', fieldName:'caseTypes'}, 
		{name: 'Locality', fieldName:'locality'}, 
		{name: 'City', fieldName:'city'}, 
		/*{name: 'State', fieldName:'state'}, */
		{name: 'Gender', fieldName:'sex'}, 
		/*{name: 'Experience (in Years)', fieldName:'experience'}, */
		{name: 'Spoken Languages', fieldName:'languages'},
        {name: 'Distance', fieldName:'distance'}
	];
	$scope.selectedFacet = null;

	function getFacetArray(facetFields, facetName){
		var facetArray = [];
		var facet = facetFields[facetName];
		for (var i = 0; i < facet.length; i++) {
			var facetName = facet[i];
			var count = facet[++i];
			facetArray.push({'facetName' : facetName, "count" : count});
		}
		return facetArray;
	}

	$scope.refresh = function(){
		var queryString = 'mode:("Lawyer", "CA") AND active:true';
		if($rootScope.global.city != 'All Cities'){
			queryString += ' AND city:("'+$rootScope.global.city+'")';
		}
		if($rootScope.global.caseType && $rootScope.global.locality){
			queryString += ' AND locality:"'+escape($rootScope.global.locality)+'" AND caseTypes:"'+escape($rootScope.global.caseType)+'"';
		} else if($rootScope.global.caseType){
			queryString += ' AND caseTypes:"'+escape($rootScope.global.caseType)+'"';
		} else if($rootScope.global.locality){
			queryString += ' AND locality:"'+escape($rootScope.global.locality)+'"';
		} else if($scope.selectedFacet) {
			queryString += ' AND '+ escape($scope.selectedFacet.name)+':'+escape($scope.selectedFacet.value);
		}

		var facetQuery = '';
		for (var i = 0; i < $scope.facets.length; i++) {
			var facet = $scope.facets[i];
			facetQuery+='&facet.field='+facet.fieldName;
		};

        $rootScope.global.solrURL2 = '127.0.0.1:8983';
        $http.get('http://'+$rootScope.global.solrURL2+'/solr/getmyadvisor/select?q='+queryString+'&wt=json&indent=true&facet=true'+facetQuery+'&rows=100').
		then(function(response) {
			$scope.result = response.data;
            
			// load maps for each lawyer
			for (var i = 0; i < $scope.result.response.docs.length; i++) {
				var lawyer = $scope.result.response.docs[i];                
                var adrs = lawyer.locality + ', ' + lawyer.city;
                var alpha = $scope.distanceQuery(adrs);
                lawyer.distance = (alpha/1000);
                if((alpha/1000) <= $rootScope.global.distance){
				loadMap(lawyer.locality, lawyer.city, lawyer.id);
                }
			};

			var facetFields = $scope.result.facet_counts.facet_fields;
			
			for (var i = 0; i < $scope.facets.length; i++) {
				var facet = $scope.facets[i];
				facet.data = getFacetArray(facetFields, facet.fieldName);
			};
		}, function(response) {
		});
	};
	$scope.refresh();

	$scope.selectFacet = function(facet, facetData){
		if(facet.fieldName == 'locality'){
			$rootScope.global.locality = facetData.facetName;
		} else if(facet.fieldName == 'caseTypes'){
			$rootScope.global.caseType = facetData.facetName;
		} else {
			$scope.selectedFacet = {name : facet.fieldName, value : facetData.facetName};
		}
		$scope.refresh();
	}
    
    function toRadian(num){
            return num*(3.14/180);
    }
    function distanceQuery(adrs){
        var geocoder = new google.maps.Geocoder();
        var address = $rootScope.global.locality + ', ' + $rootScope.global.city;
        geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat1 = results[0].geometry.location.lat();
                    var lon1 = results[0].geometry.location.lng();
                    alert("Latitude: " + lat1 + "\nLongitude: " + lon1);
                } else {
                    alert("Request to pull lat and lon of enetered locality failed.")
                }
            });
        
        var address2 = adrs;
        geocoder.geocode({ 'address': address2 }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat2 = results[0].geometry.location.lat();
                    var lon2 = results[0].geometry.location.lng();
//                    alert("Latitude: " + lat1 + "\nLongitude: " + lon1);
                } else {
//                    alert("Request failed.")
                }
            });
            
            var R = 6371e3; // metres
            var a1 = toRadian(lat1);
            var a2 = toRadian(lat2);
            var b1 = toRadian(lon1);
            var b2 = toRadian(lon2);
            var newa = a2-a1;
            var newb = b2-b1;

            var a = Math.sin(newa/2) * Math.sin(newa/2) +
            Math.cos(a1) * Math.cos(a2) *
            Math.sin(newb/2) * Math.sin(newb/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
        
        return d;   
    }

	$scope.goButtonClicked = function(){
		$scope.selectedFacet = null;
		$scope.refresh();        
    }
    
    $rootScope.global.newCaseType = availableCaseTypes;
    
    $scope.function1 = function(){
        $rootScope.global.newCaseType = availableCaseTypes;
    };
    
    $scope.function2 = function(){
        $rootScope.global.newCaseType = availableCACaseTypes;
    };

	$scope.onFiltersClick = function(){
		var filterElems = document.getElementsByClassName('filtersClass');
		if(!filterElems[0].style.display || filterElems[0].style.display == 'none'){
			filterElems[0].style.display='block';
			filterElems[1].style.display='block';
		} else {
			filterElems[0].style.display='none';
			filterElems[1].style.display='none';
		}
        
	}

}]);