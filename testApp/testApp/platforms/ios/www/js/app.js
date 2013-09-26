var app = angular.module('testApp', []);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {templateUrl: 'partials/home.html', controller: homeCtrl})
	.when('/collections', {templateUrl: 'partials/collections.html', controller: colCtrl})
	.when('/queries', {templateUrl: 'partials/queries.html', controller: queryCtrl})
	.otherwise({redirectTo: '/'});
}]);

var untrust = function () {
		cordova.exec(
				function success() {},
				function error() {},
				'Certificates',
				'setUntrusted',
				[true]	
				);
};	
document.addEventListener("deviceready", untrust, false);
