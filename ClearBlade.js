/*
 * This is the client-side JavaScript API for The ClearBlade Platform
 * Learn More at https://platform.clearblade.com/
 *
 * Copyright 2013 ClearBlade Inc
 *
 * @author Charlie Andrews (candrews@clearblade.com)
 * @version 0.0.2
 *
 */

if (!window.console) {
	window.console = window.console || {};
	window.console.log = window.console.log || function () {};
}

(function (window, undefined) {
	'use strict';

	var ClearBlade, $cb, currentUser;
	/**
	 * This is the base module for the ClearBlade Platform API
	 * @namespace ClearBlade
	 * @example <caption>Initialize ClearBladeAPI</caption>
	 * initOptions = {appKey: 'asdfknafikjasd3853n34kj2vc', appSecret: 'SHHG245F6GH7SDFG823HGSDFG9'};
	 * ClearBlade.init(initOptions);
	 * 
	 */

	if (typeof exports != 'undefined') {
		window = exports;
	} else {
		ClearBlade = $cb = window.$cb = window.ClearBlade = window.ClearBlade || {};
	}	   

	/**
	 * This method returns the current version of the API
	 * @method getApiVersion
	 */
	ClearBlade.getApiVersion = function () {
		return '0.0.2';
	};

	/**
	 * This method initializes the ClearBlade module with the values needed to connect to the platform
	 * @method init
	 * @param options {Object} the `options` Object
	 */
	ClearBlade.init = function (options) {

		//check for undefined/null then check if they are the correct types for required params
		if (!options || typeof options !== 'object')
			throw new Error('Options must be an object or it is undefined');

		if (!options.appKey || typeof options.appKey !== 'string')
			throw new Error('appKey must be defined/a string');

		if (!options.appSecret || typeof options.appSecret !== 'string') 
			throw new Error('appSecret must be defined/a string');

		//check for optional params.
		if (options.logging && typeof options.logging !== 'boolean')
			throw new Error('logging must be a boolean');

		// store keys
		/**
		 * This is the app key that will identify your app in order to connect to the Platform
		 * @property appKey
		 * @type String
		 */
		ClearBlade.appKey = options.appKey;
		/**
		 * This is the app secret that will be used in combination with the appKey to authenticate your app
		 * @property appSecret
		 * @type String
		 */
		ClearBlade.appSecret = options.appSecret;
		/**
		 * This is the master secret that is used during development to test many apps at a time
		 * This is not currently not in use
		 * @property masterSecret
		 * @type String
		 */
		ClearBlade.masterSecret = options.masterSecret || null;
		/**
		 * This is the URI used to identify where the Platform is located
		 * @property URI
		 * @type String
		 */
		ClearBlade.URI = options.URI || 'https://platform.clearblade.com';
		/**
		 * This is the property that tells the API whether or not the API will log to the console
		 * This should be left `false` in production
		 * @property logging
		 * @type Boolean
		 */
		ClearBlade.logging = options.logging || false;
		/**
		 * This is the amount of time that the API will use to determine a timeout
		 * @property _callTimeout=30000
		 * @type Number
		 * @private
		 */
		ClearBlade._callTimeout =  options.callTimeout || 30000; //default to 30 seconds

	};

	/*
	 * Helper functions
	 */

	var execute = function (error, response, callback) {
		if (typeof callback === 'function') {
			callback(error, response);
		} else {
			logger("Did you forget to supply a valid Callback!");
		}
	};

	var logger = function (message) {
		if (ClearBlade.logging) {
			console.log(message);
		}
		return;
	};


	var isObjectEmpty = function (object) { 
		/*jshint forin:false */
		if (typeof object !== 'object') {
			return true;
		}
		for (var keys in object) {
			return false;
		}
		return true;
	};
	var makeKVPair = function (key, value) {
		var KVPair = {};
		KVPair[key] = value;
		return KVPair; 
	};

	var addToQuery = function (queryObj, condition, KVPair) {

		if (typeof queryObj.query[condition] === 'undefined') {
			queryObj.query[condition] = [];
		}
		queryObj.query[condition].push(KVPair);
	};

	/*
	 * request method
	 *
	 * TODO: Go over with a fine toothed comb! Get all superfluous methods out!
	 *
	 */

	var _request = function (options, callback) {
		var self = ClearBlade;
		var method = options.method || 'GET';
		var endpoint = options.endpoint || '';
		var body = options.body || {};
		var qs = options.qs || '';
		var url = options.URI || self.URI;
		var params = qs
			if (endpoint) {
				url +=  ('/' + endpoint);
			}

		if (params) {
			url += "?" + params;
		}

		//begin XMLHttpRequest 
		var httpRequest;

		if (typeof window.XMLHttpRequest !== 'undefined') { // Mozilla, Safari, IE 10 ...

			httpRequest = new XMLHttpRequest();

			// if "withCredentials is not in the XMLHttpRequest object CORS is not supported


			if (!("withCredentials" in httpRequest)) {
				logger("Sorry it seems that CORS is not supported on your Browser. The RESTful api calls will not work!");
				httpRequest = null;
				throw new Error("CORS is not supported!");
			}
			httpRequest.open(method, url, true);

		} else if (typeof window.XDomainRequest !== 'undefined') { // IE 8/9
			httpRequest = new XDomainRequest();
			httpRequest.open(method, url);
		} else {   
			alert("Sorry it seems that CORS is not supported on your Browser. The RESTful api calls will not work!");
			httpRequest = null;
			throw new Error("CORS is not supported!");   
		}

		// Set Credentials; Maybe some encryption later
		httpRequest.setRequestHeader("CLEARBLADE-APPKEY", ClearBlade.appKey);
		httpRequest.setRequestHeader("CLEARBLADE-APPSECRET", ClearBlade.appSecret);

		if (!isObjectEmpty(body) || params) {

			if (method === "POST" || method === "PUT") { 
				// Content-Type is expected for POST and PUT; bad things can happen if you don't specify this.  
				httpRequest.setRequestHeader("Content-Type", "application/json");
			}

			httpRequest.setRequestHeader("Accept", "application/json");
			/* Authorization headers expected to change once app structure is set up */

			//set Authorization header
			if (typeof ClearBlade.masterSecret === 'String') {
				// if masterSecret exists as a string use it for Authorization
				httpRequest.setRequestHeader("Authorization", "Basic " + window.btoa(ClearBlade.appKey + ':' + ClearBlade.masterSecret));
			} else if (currentUser && currentUser.getToken()) {
				// if there is a current user then use the current Access token
				httpRequest.setRequestHeader("Authorization", "Bearer " + self.getToken());
			}

			/* uncomment the following line once server is set to echo back origins or take custom headers */
			//httpRequest.withCredentials = true;
		}

		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === 4) {
				// Looks like we didn't time out!
				clearTimeout(xhrTimeout); 

				//define error for the entire scope of the if statement 
				var error = false; 
				if (httpRequest.status >= 200 &&  httpRequest.status < 300) {
					var parsedResponse;
					var response;
					var flag = false;
					// try to parse response, it should be JSON
					if (httpRequest.responseText == '[{}]' || httpRequest.responseText == '[]') {
						error = true;
						execute(error, "query returned nothing", callback);
					} else {
						try {	
							response = JSON.parse(httpRequest.responseText);
							parsedResponse = [];
							for (var item in response) {
								if (response[item] instanceof Object) {
									for (var key in response[item]) {
										if (response[item][key] instanceof Object ){
											if (response[item][key]['_key']) {
												delete response[item][key]['_key'];
											}
											if (response[item][key]['collectionID']) {
												delete response[item][key]['collectionID'];
											}
											parsedResponse.push(response[item][key]);
											continue;
										} else {
											if (response[item]['_key']) {
												delete response[item]['_key'];
											}
											if (response[item]['collectionID']) {
												delete response[item]['collectionID'];
											}
											parsedResponse.push(response[item]);
											break;
										}
									}
								} else {
									flag = true;
								}
							}
						} catch (e) {
							// the response probably was not JSON; Probably had html in it, just output it until all requirements of our backend are defined.
							if (e instanceof SyntaxError) { 
								response = httpRequest.responseText;
								// some other error occured; log message , execute callback
							} else { 
								logger("Error during JSON response parsing: " + e);
								error = true;
								execute(error, e, callback);
							}
						} // end of catch 
						// execute callback with whatever was in the response 
						if (flag) {
							execute(error, response, callback);
						} else {
							execute(error, parsedResponse, callback);
						}
					}
				} else {
					var msg = "Request Failed: Status " + httpRequest.status + " " + (httpRequest.statusText); 
					/*jshint expr: true */
					httpRequest.responseText && (msg += "\nmessage:" + httpRequest.responseText);
					logger(msg);
					error = true;
					execute(error, msg, callback);
				}
			}
		};


		logger('calling: ' + method + ' ' + url);

		body = JSON.stringify(body);

		// set up our own TimeOut function, because XMLHttpRequest.onTimeOut is not implemented by all browsers yet.
		function callAbort() { 
			httpRequest.abort();
			logger("It seems the request has timed Out, please try again.");
			execute(true, "API Request TimeOut", callback);
		}

		// set timeout and timeout function
		var xhrTimeout = setTimeout(callAbort, ClearBlade._callTimeout);
		httpRequest.send(body);

	};

	ClearBlade.request = function (options, callback) {
		if (!options || typeof options !== 'object') {
			throw new Error("Request: options is not an object or is empty");
		}

		_request(options, callback);
	};

	var _parseQuery = function(_query) {
		var parsed = encodeURIComponent(JSON.stringify(_query));
		return parsed;
	};

	/**
	 * Creates a new Collection that represents the server-side collection with the specified collection ID
	 * @class ClearBlade.Collection
	 * @classdesc This class represents a server-side collection. It does not actully make a connection upon instantiation, but has all the methods necessary to do so. It also has all the methods necessary to do operations on the server-side collections.
	 * @param {String} collectionID The string ID for the collection you want to represent.
	 */
	ClearBlade.Collection = function(collectionID) {
		this.ID = collectionID;
	};

	/**
	 * Reqests an item or a set of items from the collection. 
	 * @method ClearBlade.Collection.fetch
	 * @param {Query} _query Used to request a specific item or subset of items from the collection on the server
	 * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
	 * @example <caption>The typical callback</caption>
	 * var callback = function (err, data) {
	 *     if (err) {
	 *         //error handling
	 *     } else {
	 *         console.log(data);
	 *     }
	 * };
	 *
	 * @example <caption>Fetching data from a collection</caption>
	 * var returnedData = [];
	 * var callback = function (err, data) {
	 *     if (err) {
	 *         throw new Error (data);
	 *     } else {
	 *         returnedData = data;
	 *     }
	 * };
	 *
	 * col.fetch(query, callback);
	 * //this will give returnedData the value of what ever was returned from the server.
	 */
	ClearBlade.Collection.prototype.fetch = function (_query, callback) {
		var query;
		var self = this;
		/* 
		 * The following logic may look funny, but it is intentional. 
		 * I do this because it is typeical for the callback to be the last parameter.
		 * However, '_query' is an optional parameter, so I have to check if 'callback' is undefined
		 * in order to see weather or not _query is defined.
		 */
		if (callback == undefined) {
			callback = _query;
			query = {
				OR: []
			};
			query = 'query='+ _parseQuery(query.OR);
		} else {
			query = 'query='+ _parseQuery(_query.OR);
		}

		var reqOptions = {
			method: 'GET',
			endpoint: 'apidev/' + this.ID,
			qs: query
		};
		var colID = this.ID;
		var callCallback = function (err, data) {
			if (err) {
				callback(err, data);
			} else {
				var itemArray = [];
				for (var i in data) {
					var newItem = new ClearBlade.Item(data[i], colID);
					itemArray.push(newItem);
				}
				callback(err, itemArray);
			}
		};
		if (typeof callback === 'function') {
			_request(reqOptions, callCallback);
		} else {
			logger("No callback was defined!");
		}
	};

	/**
	 * Creates a new item in the collection and returns the created item to the callback
	 * @method ClearBlade.Collection.create
	 * @param {Object} newItem An object that represents an item that you want to add to the collection
	 * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
	 * @example <caption>Creating a new item in the collection</caption>
	 * //This example assumes a collection of items that have the columns: name, height, and age.
	 * var newPerson = {
	 *     name: 'Jim',
	 *     height: 70,
	 *     age: 32
	 * };
	 * var callback = function (err, data) {
	 *     if (err) {
	 *         throw new Error (data);
	 *     } else {
	 *         console.log(data);
	 *     }
	 * };
	 * col.create(newPerson, callback);
	 * //this inserts the the newPerson item into the collection that col represents
	 *
	 */
	ClearBlade.Collection.prototype.create = function (newItem, callback) {
		var reqOptions = {
			method: 'POST',
			endpoint: 'apidev/' + this.ID,
			body: newItem
		};
		if (typeof callback === 'function') {
			_request(reqOptions, callback);
		} else {
			logger("No callback was defined!");
		}
	};

	/**
	 * Updates an existing item or set of items 
	 * @method ClearBlade.Collection.update
	 * @param {Query} _query Query object to denote which items or set of Items will be changed
	 * @param {Object} changes Object representing the attributes that you want changed
	 * @param {function} callback Function that handles the response of the server
	 * @example <caption>Updating a set of items</caption>
	 * //This example assumes a collection of items that have the columns name and age.
	 * var query = new ClearBlade.Query();
	 * query.equalTo('name', 'John');
	 * var changes = {
	 *     age: 23
	 * };
	 * var callback = function (err, data) {
	 *     if (err) {
	 *         throw new Error (data);
	 *     } else {
	 *         console.log(data);
	 *     }
	 * };
	 *
	 * col.update(query, changes, callback);
	 * //sets John's age to 23
	 */
	ClearBlade.Collection.prototype.update = function (_query, changes, callback) {
		var reqOptions = {
			method: 'PUT',
			endpoint: 'apidev/' + this.ID,
			body: {query: _query.OR, $set: changes}
		};
		if (typeof callback === 'function') {
			_request(reqOptions, callback);
		} else {
			logger("No callback was defined!");
		}
	};

	/**
	 * Removes an item or set of items from the specified collection
	 * @method ClearBlade.Collection.remove
	 * @param {Query} _query Query object that used to define what item or set of items to remove
	 * @param {function} callback Function that handles the response from the server
	 * @example <caption>Removing an item in a collection</caption>
	 * //This example assumes that you have a collection with the item whose 'name' attribute is 'John'
	 * var query = new ClearBlade.Query();
	 * query.equalTo('name', 'John');
	 * var callback = function (err, data) {
	 *     if (err) {
	 *         throw new Error (data);
	 *     } else {
	 *         console.log(data);
	 *     }
	 * };
	 *
	 * col.remove(query, callback);
	 * //removes every item whose 'name' attribute is equal to 'John'
	 */
	ClearBlade.Collection.prototype.remove = function (_query, callback) {
		var query;
		if (_query == undefined) {
			throw new Error("no query defined!");
		} else {
			query = 'query=' + _parseQuery(_query.OR);
		}

		var reqOptions = {
			method: 'DELETE',
			endpoint: 'apidev/' + this.ID,
			qs: query
		};
		if (typeof callback === 'function') {
			_request(reqOptions, callback);
		} else {
			logger("No callback was defined!");
		}
	}; 


	/**
	 * creates a Query object that can be used in Collection methods or on its own to operate on items on the server
	 * @class ClearBlade.Query
	 * @param {Object} options Object that has configuration values used when instantiating a Query object
	 */
	ClearBlade.Query = function (options) {
		/*	if (!collection || typeof collection !== 'string') {
			throw new Error("options.type must be defined and of type 'String'");
			} */
		if (!options) {
			options = {}; 
		}
		if (options.collection != undefined || options.collection != "") {
			this.collection = options.collection;
		}
		this.query = {};
		this.OR = [];
		this.OR.push([this.query]);
		//this.collection = collection;
		this.offset = options.offset || 0;
		this.limit = options.limit || 10; 
	};

	ClearBlade.Query.prototype.ascending = function (field) {
		jaddToQuery(this, "SORT", makeKVPair("ASC", field));
		return this;
	};

	ClearBlade.Query.prototype.descending = function (field) {
		addToQuery(this, "SORT", makeKVPair("DESC", field));
		return this;
	};

	/**
	 * Creates an equality clause in the query object
	 * @method ClearBlade.Query.equalTo
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against
	 * @example <caption>Adding an equality clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.equalTo('name', 'John');
	 * //will only match if an item has an attribute 'name' that is equal to 'John'
	 */
	ClearBlade.Query.prototype.equalTo = function (field, value) {
		addToQuery(this, "EQ", makeKVPair(field, value));
		return this;
	};

	/**
	 * Creates a greater than clause in the query object
	 * @method ClearBlade.Query.greaterThan
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against
	 * @example <caption>Adding a greater than clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.greaterThan('age', 21);
	 * //will only match if an item has an attribute 'age' that is greater than 21
	 */
	ClearBlade.Query.prototype.greaterThan = function (field, value) {
		addToQuery(this, "GT",  makeKVPair(field, value));
		return this;
	};

	/**
	 * Creates a greater than or equality clause in the query object
	 * @method ClearBlade.Query.greaterThanEqualTo
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against 
	 * @example <caption>Adding a greater than or equality clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.greaterThanEqualTo('age', 21);
	 * //will only match if an item has an attribute 'age' that is greater than or equal to 21
	 */
	ClearBlade.Query.prototype.greaterThanEqualTo = function (field, value) {
		addToQuery(this, "GTE",  makeKVPair(field, value));
		return this;
	};

	/**
	 * Creates a less than clause in the query object
	 * @method ClearBlade.Query.lessThan
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against 
	 * @example <caption>Adding a less than clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.lessThan('age', 50);
	 * //will only match if an item has an attribute 'age' that is less than 50
	 */
	ClearBlade.Query.prototype.lessThan = function (field, value) {
		addToQuery(this, "LT",  makeKVPair(field, value));
		return this;
	};

	/**
	 * Creates a less than or equality clause in the query object
	 * @method ClearBlade.Query.lessThanEqualTo
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against 
	 * @example <caption>Adding a less than or equality clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.lessThanEqualTo('age', 50);
	 * //will only match if an item has an attribute 'age' that is less than or equal to 50
	 */
	ClearBlade.Query.prototype.lessThanEqualTo = function (field, value) {

		addToQuery(this, "LTE",  makeKVPair(field, value));
		return this;
	};

	/**
	 * Creates a not equal clause in the query object
	 * @method ClearBlade.Query.notEqualTo
	 * @param {String} field String defining what attribute to compare
	 * @param {String} value String or Number that is used to compare against 
	 * @example <caption>Adding a not equal clause to a query</caption>
	 * var query = new ClearBlade.Query();
	 * query.notEqualTo('name', 'Jim');
	 * //will only match if an item has an attribute 'name' that is not equal to 'Jim' 
	 */
	ClearBlade.Query.prototype.notEqualTo = function (field, value) {

		addToQuery(this, "NEQ",  makeKVPair(field, value));
		return this;
	};

	/**
	 * chains an existing query object to the Query object in an or
	 * @method ClearBlade.Query.or
	 * @param {Query} that Query object that will be added in disjunction to this query object
	 * @example <caption>Chaining two queries together in an or</caption>
	 * var query1 = new ClearBlade.Query();
	 * var query2 = new ClearBlade.Query();
	 * query1.equalTo('name', 'John');
	 * query2.equalTo('name', 'Jim');
	 * query1.or(query2);
	 * //will match if an item has an attribute 'name' that is equal to 'John' or 'Jim'
	 */
	ClearBlade.Query.prototype.or = function (that) {
		this.OR.push([that.query]);
		return this;
	};

	ClearBlade.Query.prototype.setLimit = function (limit) {
		this.limit = limit;
		return this;
	};

	ClearBlade.Query.prototype.setOffset = function (offset) {
		this.offset = offset;
		return this;
	};

	ClearBlade.Query.prototype.execute = function (method, callback) {
		var reqOptions = {
			method: method
		};
		console.log(this);
		switch(method) {
			case "GET": 
				reqOptions.qs = 'query=' + _parseQuery(this.OR);
				break;
			case "PUT":
				reqOptions.body = this.OR;
				break;
			case "DELETE":
				reqOptions.qs = 'query=' + _parseQuery(this.OR);
				break;
			default:
				throw new Error("The method " + method + " does not exist");
				break;
		}
		if (this.collection == undefined || this.collection == "") {
			throw new Error("No collection was defined");
		} else {
			reqOptions.endpoint = "apidev/" + this.collection;
		}
		if (typeof callback === 'function') {
			_request(reqOptions, callback);
		} else {
			logger("No callback was defined!");
		}
	};

	ClearBlade.Query.prototype.fetch = function (callback) {
		var reqOptions = {
			method: 'GET',
			qs: 'query=' + _parseQuery(this.OR)
		};

		if (this.collection == undefined || this.collection == "") {
			throw new Error("No collection was defined");
		} else {
			reqOptions.endpoint = "apidev/" + this.collection;
		}
		var colID = this.collection;
		var callCallback = function (err, data) {
			if (err) {
				callback(err, data);
			} else {
				var itemArray = [];
				for (var i in data) {
					var newItem = new ClearBlade.Item(data[i], colID);
					itemArray.push(newItem);
				}
				callback(err, itemArray);
			}
		};

		if (typeof callback === 'function') {
			_request(reqOptions, callCallback);
		} else {
			logger("No callback was defined!");
		}
	};

	ClearBlade.Query.prototype.update = function (changes, callback) {
		var reqOptions = {
			method: 'PUT',
			body: {query: this.OR, $set: changes}
		};

		var colID = this.collection;
		var callCallback = function (err, data) {
			if (err) {
				callback(err, data);
			} else {
				var itemArray = [];
				for (var i in data) {
					var newItem = new ClearBlade.Item(data[i], colID);
					itemArray.push(newItem);
				}
				callback(err, itemArray);
			}
		};

		console.log(this.collection);

		if (this.collection == undefined || this.collection == "") {
			throw new Error("No collection was defined");
		} else {
			reqOptions.endpoint = "apidev/" + this.collection;
		}
		if (typeof callback === 'function') {
			_request(reqOptions, callCallback);
		} else {
			logger("No callback was defined!");
		}
	};

	ClearBlade.Query.prototype.remove = function (callback) {
		var reqOptions = {
			method: 'DELETE',
			qs: 'query=' + _parseQuery(this.OR)
		};

		var colID = this.collection;
		var callCallback = function (err, data) {
			if (err) {
				callback(err, data);
			} else {
				var itemArray = [];
				for (var i in data) {
					var newItem = new cb.Item(data[i], colID);
					itemArray.push(newItem);
				}
				callback(err, itemArray);
			}
		};

		if (this.collection == undefined || this.collection == "") {
			throw new Error("No collection was defined");
		} else {
			reqOptions.endpoint = "apidev/" + this.collection;
		}
		if (typeof callback === 'function') {
			_request(reqOptions, callCallback);
		} else {
			logger("No callback was defined!");
		}

	};

	ClearBlade.Item = function (data, collection) {
		if (!(data instanceof Object)) {
			throw new Error("data must be of type Object");
		}
		if ((typeof collection !== 'string') || (collection == "")) {
			throw new Error("You have to give a collection ID");
		}
		this.collection = collection;
		this.data = data;
	};

	ClearBlade.Item.prototype.save = function () {
		//do a put or a post to the database to save the item in the db
		var self = this;	
		var query = new ClearBlade.Query({collection: this.collection});
		query.equalTo('itemId', this.data.itemId);
		var callback = function (err, data) {
			if (err) {
				throw new Error (data);
			} else {
				console.log(data);
				self.data = data[0].data;
			}
		};
		query.update(this.data, callback);
	};

	ClearBlade.Item.prototype.refresh = function () {
		//do a get to make the local item reflect the database
		var self = this;
		var query = new ClearBlade.Query({collection: this.collection});
		query.equalTo('itemId', this.data.itemId);
		var callback = function (err, data) {
			if (err) {
				throw new Error (data);
			} else {
				console.log(data);
				self.data = data[0].data;
			}
		};
		query.fetch(callback);
	};

	ClearBlade.Item.prototype.destroy = function () {
		//deletes the relative record in the DB then deletes the item locally
		var self = this;
		var query = new ClearBlade.Query({collection: this.collection});
		query.equalTo('itemId', this.data.itemId);
		var callback = function (err, data) {
			if (err) {
				throw new Error (data);
			} else {
				self.data = null;
				self.collection = null;
				delete self.data;
				delete self.collection;
			}
		};
		query.remove(callback);
		delete this;
	};

})(window);
