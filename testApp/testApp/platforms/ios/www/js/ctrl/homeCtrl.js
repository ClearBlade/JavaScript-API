function homeCtrl ($scope, $location) {
	$scope.previousApp = false;
	$scope.initClearBlade = function () {
		var initOptions = {
			appKey: $scope.appKey,
			appSecret: $scope.appSecret
		};
		ClearBlade.init(initOptions);
	};	
	$scope.getAppKeySecret = function () {
		if (localStorage.appKey && localStorage.appSecret) {
			$scope.previousApp = true;
			$scope.appKey = localStorage.appKey;
			$scope.appSecret = localStorage.appSecret;
			$scope.initClearBlade();
		} else {
			$scope.previousApp = false;
		}	
	};
	$scope.clearAppKeySecret = function () {
		localStorage.appKey = "";
		localStorage.appSecret = "";
		$scope.appKey = localStorage.appKey;
		$scope.appSecret = localStorage.appSecret;
		$scope.previousApp = false;
	};
	$scope.appKeySecretSubmit = function () {
		localStorage.appKey = $scope.appKey;
		localStorage.appSecret = $scope.appSecret;
		$scope.initClearBlade();
		$scope.previousApp = true;
	};
	$scope.getAppKeySecret();

	$scope.goToColTest = function () {
		$location.path('collections');
	};

	$scope.goToQueryTest = function () {
		$location.path('queries');
	};
}
