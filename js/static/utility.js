function getUniqueArray(arr){
	var uniqueNames = [];
	$.each(arr, function(i, el){
	    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
	});
	return uniqueNames;
}

function prepareCaseTypeSelect($rootScope, mode, sizeVar) {
	$('#caseTypeSelectID').multiselect({
		maxHeight: 200,
		buttonClass: 'form-control input-'+(sizeVar=='small'?'md':'lg')+' backGroundColorWhiteSmoke',
		buttonWidth: '250px',
		nonSelectedText : "Case Types",
		enableFiltering : true,
		enableCaseInsensitiveFiltering : true,
		numberDisplayed: 0,
		includeSelectAllOption : true,
		selectAllValue: 'select-all-value',
		selectAllName: 'select-all-name',
		includeSelectAllOption : false,
		onChange: function (element) {
			// copied from "http://stackoverflow.com/questions/19476888/bootstrap-multiselect-plugin-and-disabling-enabling-checkboxes-on-the-change-eve"
		    var me = $(element), // is an <option/>
		        parent = me.parent(),// is a <select/>
		        max = parent.data('max'), // defined on <select/>
		        options, // will contain all <option/> within <select/>
		        selected, // will contain all <option(::selected)/> within <select/>
		        multiselect; // will contain the generated ".multiselect-container"

		    if (!max) { // don't have a max setting so ignore the rest
		        return;
		    }

		    // get all options
		    options = me.parent().find('option');

		    // get selected options
		    selected = options.filter(function () {
		        return $(this).is(':selected');
		    });

		    // get the generated multiselect container
		    multiselect = parent.siblings('.btn-group').find('.multiselect-container');

		    // check if max amount of selected options has been met
		    if (selected.length === max) {
		        // max is met so disable all other checkboxes.

		        options.filter(function () {
		            return !$(this).is(':selected');
		        }).each(function () {
		            multiselect.find('input[value="' + $(this).val() + '"]')
		                .prop('disabled', true)
		                .parents('li').addClass('disabled');
		        });

		    } else {
		        // max is not yet met so enable all disabled checkboxes.

		        options.each(function () {
		            multiselect.find('input[value="' + $(this).val() + '"]')
		                .prop('disabled', false)
		                .parents('li').removeClass('disabled');
		        });
		    }
		}
	});

	var options = [];
	var caseTypes = mode == 'Lawyer'?$rootScope.global.allLawyerCaseTypes:$rootScope.global.allCACaseTypes;
	for (var i = 0; i <caseTypes.length; i++) {
		options.push({
			label : caseTypes[i],
			title : caseTypes[i],
			value : caseTypes[i]
		});
	};

	$('#caseTypeSelectID').multiselect('dataprovider', options);
}
function prepareLanguageSelect($rootScope, sizeVar) {
	$('#languageSelectID').multiselect({
		maxHeight: 200,
		buttonClass: 'form-control input-'+(sizeVar=='small'?'md':'lg')+' backGroundColorWhiteSmoke',
		buttonWidth: '250px',
		nonSelectedText : "Languages",
		enableFiltering : true,
		enableCaseInsensitiveFiltering : true,
		numberDisplayed: 0,
		selectAllValue: 'select-all-value',
		selectAllName: 'select-all-name',
		onChange: function (element) {
			// copied from "http://stackoverflow.com/questions/19476888/bootstrap-multiselect-plugin-and-disabling-enabling-checkboxes-on-the-change-eve"
		    var me = $(element), // is an <option/>
		        parent = me.parent(),// is a <select/>
		        max = parent.data('max'), // defined on <select/>
		        options, // will contain all <option/> within <select/>
		        selected, // will contain all <option(::selected)/> within <select/>
		        multiselect; // will contain the generated ".multiselect-container"

		    if (!max) { // don't have a max setting so ignore the rest
		        return;
		    }

		    // get all options
		    options = me.parent().find('option');

		    // get selected options
		    selected = options.filter(function () {
		        return $(this).is(':selected');
		    });

		    // get the generated multiselect container
		    multiselect = parent.siblings('.btn-group').find('.multiselect-container');

		    // check if max amount of selected options has been met
		    if (selected.length === max) {
		        // max is met so disable all other checkboxes.

		        options.filter(function () {
		            return !$(this).is(':selected');
		        }).each(function () {
		            multiselect.find('input[value="' + $(this).val() + '"]')
		                .prop('disabled', true)
		                .parents('li').addClass('disabled');
		        });

		    } else {
		        // max is not yet met so enable all disabled checkboxes.

		        options.each(function () {
		            multiselect.find('input[value="' + $(this).val() + '"]')
		                .prop('disabled', false)
		                .parents('li').removeClass('disabled');
		        });
		    }
		}
	});

	var options = [];
	for (var i = 0; i <$rootScope.global.allLanguages.length; i++) {
		options.push({
			label : $rootScope.global.allLanguages[i],
			title : $rootScope.global.allLanguages[i],
			value : $rootScope.global.allLanguages[i]
		});
	};

	$('#languageSelectID').multiselect('dataprovider', options);
}
function setCookie(cname, cvalue, exdays) {
	if(!exdays){
    	document.cookie = cname + "=" + cvalue;
    	return;
	}

    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function loadMap(locality, city, id){
	if(!locality || !city) {
		return;
	}
	
	// set lat long based on locality
	var address = locality + "," + city;
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			// In this case it creates a marker, but you can get the lat and lng from the location.LatLng
			latitude = results[0].geometry.location.lat();
			longitude = results[0].geometry.location.lng();

			loadMapFinally(latitude, longitude, id);
			return latitude + '' + longitude;
		} else {
			// alert("Geocode was not successful for the following reason: " + status); // make it silent
		}
	});
}

function loadMapFinally(latitude, longitude, id){
	setTimeout(function(){
		if(!latitude || !longitude){
			document.getElementById(id).style.display = "none";
			return;
		}
		
		var mapCanvas = document.getElementById(id);
		var myLatLong = {lat: latitude, lng: longitude};
		
		var mapOptions = {
			center: myLatLong,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		var map = new google.maps.Map(mapCanvas, mapOptions);
		
		var marker = new google.maps.Marker({
			position: myLatLong,
			map: map
		});
	}, 500);
}
Array.prototype.contains = function(obj) {
		var i = this.length;
		while (i--) {
				if (this[i] === obj) {
						return true;
				}
		}
		return false;
}