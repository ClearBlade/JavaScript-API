function colCtrl ($scope, $location) {
	$scope.goHome = function () {
		$location.path('');
	};
	$scope.showTable = false;
	$scope.Items = [];
	$scope.colSubmit = function () {
	$scope.collection = new ClearBlade.Collection($scope.colID);
		$scope.collection.fetch (function (err, data) {
			if (err) {
				throw new Error (data);
			} else {
				$scope.Items = data;
				$scope.$apply();
				$scope.showTable = true;
			}
		});
	};
}
