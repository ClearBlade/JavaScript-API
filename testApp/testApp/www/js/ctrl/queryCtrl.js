function queryCtrl ($scope, $location) {
	$scope.showTable = false;
	$scope.goHome = function () {
		$location.path('');
	};
	$scope.ops = [
		{
			name: 'Equal To',
			value: 'EQ'
		},
		{
			name: 'Greater Than',
			value: 'GT'
		},
		{
			name: 'Less Than',
			value: 'LT'
		},
		{
			name: 'Greater Than or Equal To',
			value: 'GTEQ'
		},
		{
			name: 'Less Than or Equal To',
			value: 'LTEQ'
		},
		{
			name: 'Not Equal To',
			value: 'NEQ'
		}
	];

	$scope.Items = [];
	$scope.submitQuery = function () {
		
		var options = {
			collection: $scope.collection
		};
		$scope.query = new ClearBlade.Query(options);
		switch ($scope.selectedOp) {
			case 'EQ':
				$scope.query.equalTo($scope.field, $scope.value);
				break;
			case 'GT':
				$scope.query.greaterThan($scope.field, $scope.value);
				break;
			case 'LT':
				$scope.query.lessThan($scope.field, $scope.value);
				break;
			case 'GTEQ':
				$scope.query.greaterThanEqualTo($scope.field, $scope.value);
				break;
			case 'LTEQ':
				$scope.query.lessThanEqualTo($scope.field, $scope.value);
				break;
			case 'NEQ':
				$scope.query.notEqualTo($scope.field, $scope.value);
				break;
			default:
				$scope.query.equalTo($scope.field, $scope.value);
				break;
		}
		$scope.query.fetch (function (err, data) {
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
