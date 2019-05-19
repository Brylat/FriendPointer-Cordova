//initial script
document.addEventListener('deviceready', function () {
	include('content', 'friends'); 
});

jQuery(document).on("mobileinit", function () {
	jQuery.mobile.autoInitializePage = false;
});
$.mobile.autoInitializePage = false;

//add method from view JSfile, invoke after add view
function invokeInitMethod(viewName) {
	switch (viewName) {
		case 'events':{
			afterEventLoad({a: 'a'});
			break;
		}
		case 'friends':{
			afterFriendsLoad({a: 'a'});
			break;
		}
		case 'map':{
			afterMapLoad({a: 'a'});
			break;
		}
		
	}
}

function invokeInitInter(viewname) {
    $.ajax({ url: "", success: () => invokeInitMethod(viewname)});
}

function changeContext(viewname){
	include('content', viewname);
	invokeInitInter(viewname);
}

function updateButtonStatus(button1, button2, button3) {
	if (document.getElementById(button1).classList.contains('teal-600')) {
		document.getElementById(button1).classList.remove('teal-600');
		document.getElementById(button1).classList.add('teal-700');
	}
	if (document.getElementById(button2).classList.contains('teal-700')) {
		document.getElementById(button2).classList.remove('teal-700');
		document.getElementById(button2).classList.add('teal-600');
	}
	if (document.getElementById(button3).classList.contains('teal-700')) {
		document.getElementById(button3).classList.remove('teal-700');
		document.getElementById(button3).classList.add('teal-600');
	}
}

