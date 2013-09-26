/**
 * This is the Jasmine testing file for the ClearBlade javascript API
 *
 * The credentials to log into the platform and change the collections that this test suite uses:
 *
 * username: test@fake.com
 * password: testPass
 */

describe("ClearBlade API misc.", function () {
	it("should return the correct API version", function () {
		var APIversion = ClearBlade.getApiVersion();
		expect(APIversion).toEqual('0.0.2');
	});
});

describe("ClearBlade Initialization", function () {
	beforeEach(function () {
		var initOptions = {
			appKey: '522743918ab3a32f2caee87e',
			appSecret: '0R9AALLIAP9UTCIA5KA6E5EUBPK08R'
		};
		ClearBlade.init(initOptions);
	});

	it("should have the appKey stored", function () {
		expect(ClearBlade.appKey).toEqual('522743918ab3a32f2caee87e');
	});

	it("should have the appSecret stored", function () {
		expect(ClearBlade.appSecret).toEqual('0R9AALLIAP9UTCIA5KA6E5EUBPK08R');
	});

	it("should have defaulted the URI to the Platform", function () {
		expect(ClearBlade.URI).toEqual('https://platform.clearblade.com');
	});

	it("should have defaulted the logging to false", function () {
		expect(ClearBlade.logging).toEqual(false);
	});

	it("should have defaulted the masterSecret to null", function () {
		expect(ClearBlade.masterSecret).toEqual(null);
	});

	it("should have defaulted the callTimeout to 30000", function () {
		expect(ClearBlade._callTimeout).toEqual(30000);
	});
});

describe("ClearBlade collections fetching", function () {
	var col;
	beforeEach(function () {
		col = new ClearBlade.Collection('5227487d8ab3a32f2caee87f');
	});

	it("should have the collectionID stored", function () {
		expect(col.ID).toEqual('5227487d8ab3a32f2caee87f');
	});

	it("should return the stuff I entered before", function () {
		var flag, returnedData;	
		
		runs(function () {
			flag = false;
			var callback = function (err, data) {
				flag = true;
				if (err) {
				//	throw new Error (data);
				} else {
					returnedData = data;
				}
			};
			col.fetch(callback);
		});

		waitsFor(function () {
			return flag;
		}, "returnedData should not be undefined", 30000);

		runs(function () {
			expect(returnedData[0].data['name']).toEqual('aaron');
		});
	});
});
describe("ClearBlade collections CRUD", function () {
	var collection, col;
	if(window.navigator.userAgent.indexOf("Firefox") > 0) {
        collection = "522df06f8ab3a3554e89d676"; 
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
        collection = "5228a70e8ab3a32f2caee883";
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
        collection = "5228a6e58ab3a32f2caee882"; 
    }

	beforeEach(function () {
		col = new ClearBlade.Collection(collection);
		var query = new ClearBlade.Query();
		query.equalTo('name', 'John');
		col.remove(query, function (err, data) {
			if (err) {
				console.log(data);
			} else {
				console.log(data);
			}
		});
	});

	it("successful push", function () {
		var flag, returnedData, secondFlag;	
		
		runs(function () {
			flag = false;
			var callback = function (err, data) {
				flag = true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				}
			};
			var newThing = {
				name: 'jim',
				age: '40'
			};
			col.create(newThing, callback);
		});

		waitsFor(function () {
			return flag;
		}, "returnedData should not be undefined", 30000);
		
		runs(function () {
			secondFlag = false;
			var callback = function (err, data) {
				secondFlag = true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				} else {
					returnedData = data;
				}
			};
			col.fetch(callback);
		});

		waitsFor(function () {
			return secondFlag;
		}, "returnedData should not be undefined", 30000);

		runs(function () {
			expect(returnedData[0].data['name']).toEqual('jim');
		});
	});

	it("successful update", function () {
		var flag, returnedData, secondFlag;	
		
		runs(function () {
			flag = false;
			var callback = function (err, data) {
				flag = true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				}
			};
			var query = new ClearBlade.Query();
			query.equalTo('name', 'jim');
			var newThing = {
				name: 'john'
			};
			col.update(query, newThing, callback);
		});

		waitsFor(function () {
			return flag;
		}, "returnedData should not be undefined", 30000);
		
		runs(function () {
			secondFlag = false;
			var callback = function (err, data) {
				secondFlag = true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				} else {
					returnedData = data;
				}
			};
			col.fetch(callback);
		});

		waitsFor(function () {
			return secondFlag;
		}, "returnedData should not be undefined", 30000);

		runs(function () {
			expect(returnedData[0].data['name']).toEqual('john');
		});
	});

	it("successful delete", function () {
		var flag, returnedData, secondFlag;	
		
		runs(function () {
			flag = false;
			var callback = function (err, data) {
				flag = true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				} 
			};
			var query = new ClearBlade.Query();
			query.equalTo('name', 'john');
			col.remove(query, callback);
		});

		waitsFor(function () {
			return flag;
		}, "returnedData should not be undefined", 30000);
		
		runs(function () {
			secondFlag = false;
			var callback = function (err, data) {
				secondFlag = true;
				returnedData = data;
			};
			col.fetch(callback);
		});

		waitsFor(function () {
			return secondFlag;
		}, "returnedData should not be undefined", 30000);

		runs(function () {
			expect(returnedData).toEqual('query returned nothing');
		});
	});
});

describe("query should work correctly", function () {
	var collection, col;
	beforeEach(function () {
		if(window.navigator.userAgent.indexOf("Firefox") > 0) {
			collection = "522df06f8ab3a3554e89d676"; 
		} else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
			collection = "5228a70e8ab3a32f2caee883";
		} else if(window.navigator.userAgent.indexOf("Safari") > 0){
			collection = "5228a6e58ab3a32f2caee882"; 
		}
		col = new ClearBlade.Collection(collection);
		var newItem = {
			name: 'John',
			age: 34
		};
		var callback = function (err, data) {
			if (err) {
				//throw new Error (data);
				console.log(data);
			} 
		};
		col.create(newItem, callback);
	});

	afterEach(function () {
		var query = new ClearBlade.Query();
		query.equalTo('name', 'John');
		var callback = function (err, data) {
			if (err) {
				//throw new Error (data);
				console.log(data);
			} 
		};
		col.remove(query, callback);
	});

	it("successful fetch", function () {
		var flag, returnedData;
		var options = {
			collection: collection
		};

		var query = new ClearBlade.Query(options);
		query.equalTo('name', 'John');
		
		runs(function () {
			flag = false;
			var callback = function (err, data) {
				if (err) {
					//throw new Error (data);
					console.log(data);
				} else {
					flag = true;
					returnedData = data;
				}
			};
			query.fetch(callback);
		});
		
		waitsFor(function () {
			return flag;
		}, "returned data should not be undefined", 30000);

		runs(function () {
			expect(returnedData[0].data['name']).toEqual('John');
		});
	});
	it("successful update", function () {
		var flag, returnedData;
		var options = {
			collection: collection
		};
		var query = new ClearBlade.Query(options);
		query.equalTo('name', 'John');

		runs(function () {
			flag = false;
			var changes = {
				age: 35
			};
			query.update(changes, function (err, data) {
				flag =true;
				if (err) {
					//throw new Error (data);
					console.log(data);
				} else { 
					returnedData = data;
				}
			});	
		});

		waitsFor(function () {
			return flag;
		}, "returned data should not be undefined", 30000);

		runs(function () {
			expect(returnedData[0].data['age']).toEqual('35');
		});
	});
});	
