/*******************************************************************************
* Copyright 2013 ClearBlade, Inc
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Any redistribution of this program in any form must include this copyright
*******************************************************************************/

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
   * @method ClearBlade.getApiVersion
   */
  ClearBlade.getApiVersion = function () {
    return '0.0.2';
  };

  ClearBlade.MESSAGING_QOS_AT_MOST_ONCE = 0;
  ClearBlade.MESSAGING_QOS_AT_LEAST_ONCE = 1;
  ClearBlade.MESSAGING_QOS_EXACTLY_ONCE = 2;
  /**
   * This method initializes the ClearBlade module with the values needed to connect to the platform
   * @method ClearBlade.init
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
      throw new Error('logging must be a true boolean if present');

    if (options.callback && typeof options.callback !== 'function') {
      throw new Error('callback must be a function');
    }
    if (options.email && typeof options.email !== 'string') {
      throw new Error('email must be a string');
    }
    if (options.password && typeof options.password !== 'string') {
      throw new Error('password must be a string');
    }
    if (options.registerUser && typeof options.registerUser !== 'boolean') {
      throw new Error('registerUser must be a true boolean if present');
    }

    if (options.useUser && (!options.useUser.email || !options.useUser.authToken)) {
      throw new Error('useUser must contain both an email and an authToken ' +
        '{"email":email,"authToken":authToken}');
    }

    if (options.email && !options.password) {
      throw new Error('Must provide a password for email');
    }

    if (options.password && !options.email) {
      throw new Error('Must provide a email for password');
    }

    if (options.registerUser && !options.email) {
      throw new Error('Cannot register anonymous user. Must provide an email');
    }

    if (options.useUser && (options.email || options.password || options.registerUser)) {
      throw new Error('Cannot authenticate or register a new user when useUser is set');
    }


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
    ClearBlade.URI = options.URI || "https://platform.clearblade.com";

    /**
     * This is the URI used to identify where the Messaging server is located
     * @property messagingURI
     * @type String
     */
    ClearBlade.messagingURI = options.messagingURI || "platform.clearblade.com";

    /**
     * This is the default port used when connecting to the messaging server
     * @prpopert messagingPort
     * @type Number
     */
    ClearBlade.messagingPort = options.messagingPort || 8904;
    /**
     * This is the property that tells the API whether or not the API will log to the console
     * This should be left `false` in production
     * @property logging
     * @type Boolean
     */
    ClearBlade.logging = options.logging || false;

    ClearBlade.defaultQoS = options.defaultQoS || 0;
    /**
     * This is the amount of time that the API will use to determine a timeout
     * @property _callTimeout=30000
     * @type Number
     * @private
     */
    ClearBlade._callTimeout =  options.callTimeout || 30000; //default to 30 seconds

    ClearBlade.user = null;

    if (options.useUser) {
      ClearBlade.user = options.useUser;
    } else if (options.registerUser) {
      ClearBlade.registerUser(options.email, options.password, function(err, response) {
        if (err) {
          execute(err, response, options.callback);
        } else {
          ClearBlade.loginUser(options.email, options.password, function(err, user) {
            execute(err, user, options.callback);
          });
        }
      });
    } else if (options.email) {
      ClearBlade.loginUser(options.email, options.password, function(err, user) {
        execute(err, user, options.callback);
      });
    } else {
      ClearBlade.loginAnon(function(err, user) {
        execute(err, user, options.callback);
      });
    }
  };

  var _validateEmailPassword = function(email, password) {
    if (email == null || email == undefined || typeof email != 'string') {
      throw new Error("Email must be given and must be a string");
    }
    if (password == null || password == undefined || typeof password != 'string') {
      throw new Error("Password must be given and must be a string");
    }
  };

  ClearBlade.setUser = function(email, authToken) {
    ClearBlade.user = {
      "email": email,
      "authToken": authToken
    };
  };

  ClearBlade.registerUser = function(email, password, callback) {
    _validateEmailPassword(email, password);
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/reg',
      useUser: false,
      body: { "email": email, "password": password }
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, "User successfully registered", callback);
      }
    });
  };

  ClearBlade.isCurrentUserAuthenticated = function(callback) {
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/checkauth'
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, response.is_authenticated, callback);
      }
    });
  };

  ClearBlade.logoutUser = function(callback) {
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/logout'
    }, function(err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, "User Logged out", callback);
      }
    });
  };


  ClearBlade.loginAnon = function(callback) {
    ClearBlade.request({
      method: 'POST',
      useUser: false,
      endpoint: 'api/v/1/user/anon'
    }, function(err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        ClearBlade.setUser(null, response.user_token);
        execute(false, ClearBlade.user, callback);
      }
    });
  };

  ClearBlade.loginUser = function(email, password, callback) {
    _validateEmailPassword(email, password);
    ClearBlade.request({
      method: 'POST',
      useUser: false,
      endpoint: 'api/v/1/user/auth',
      body: { "email": email, "password": password }
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        ClearBlade.setUser(email, response.user_token);
        execute(false, ClearBlade.user, callback);
      }
    });
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

  var addToQuery = function(queryObj, key, value) {
    queryObj.query[key] = value;
  };

  var addFilterToQuery = function (queryObj, condition, key, value) {
    var newObj = {};
    newObj[key] = value;
    var newFilter = {};
    newFilter[condition] = [newObj];
    if (typeof queryObj.query.FILTERS === 'undefined') {
      queryObj.query.FILTERS = [];
      queryObj.query.FILTERS.push([newFilter]);
      return;
    } else {
      for (var i = 0; i < queryObj.query.FILTERS[0].length; i++) {
        for (var k in queryObj.query.FILTERS[0][i]) {
          if (queryObj.query.FILTERS[0][i].hasOwnProperty(k)) {
            if (k === condition) {
              queryObj.query.FILTERS[0][i][k].push(newObj);
              return;
            }
          }
        }
      }
      queryObj.query.FILTERS[0].push(newFilter);
    }
  };

  var addSortToQuery = function(queryObj, direction, column) {
    if (typeof queryObj.query.SORT === 'undefined') {
      queryObj.query.SORT = [];
    }
    queryObj.query.SORT.push(makeKVPair(direction, column));
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
    var useUser = options.useUser || true;
    var authToken = useUser && options.authToken;
    if (useUser && !authToken && ClearBlade.user && ClearBlade.user.authToken) {
      authToken = ClearBlade.user.authToken;
    }
    var params = qs;
      if (endpoint) {
        url +=  ('/' + endpoint);
      }

    if (params) {
      url += "?" + params;
    }
    //begin XMLHttpRequest
    var httpRequest;

    if (typeof window.XMLHttpRequest !== 'undefined') { // Mozilla, Safari, IE 10 ..

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
    if (authToken) {
      httpRequest.setRequestHeader("CLEARBLADE-USERTOKEN", authToken);
    } else {
      httpRequest.setRequestHeader("ClearBlade-SystemKey", ClearBlade.appKey);
      httpRequest.setRequestHeader("ClearBlade-SystemSecret", ClearBlade.appSecret);
    }

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

  var _parseOperationQuery = function(_query) {
    return encodeURIComponent(JSON.stringify(_query.query.FILTERS));
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
   * @method ClearBlade.Collection.prototype.fetch
   * @param {Query} _query Used to request a specific item or subset of items from the collection on the server. Optional.
   * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
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
    if (callback === undefined) {
      callback = _query;
      query = {
        FILTERS: []
      };
      query = 'query='+ _parseQuery(query);
    } else {
      query = 'query='+ _parseQuery(_query.query);
    }

    var reqOptions = {
      method: 'GET',
      endpoint: 'api/v/1/data/' + this.ID,
      qs: query
    };
    var colID = this.ID;
    var callCallback = function (err, data) {
      callback(err, data);
    };
    if (typeof callback === 'function') {
      _request(reqOptions, callCallback);
    } else {
      logger("No callback was defined!");
    }
  };

  /**
   * Creates a new item in the collection and returns the created item to the callback
   * @method ClearBlade.Collection.prototype.create
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
      endpoint: 'api/v/1/data/' + this.ID,
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
   * @method ClearBlade.Collection.prototype.update
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
      endpoint: 'api/v/1/data/' + this.ID,
      body: {query: _query.query.FILTERS, $set: changes}
    };
    if (typeof callback === 'function') {
      _request(reqOptions, callback);
    } else {
      logger("No callback was defined!");
    }
  };

  /**
   * Removes an item or set of items from the specified collection
   * @method ClearBlade.Collection.prototype.remove
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
    if (_query === undefined) {
      throw new Error("no query defined!");
    } else {
      query = 'query=' + _parseOperationQuery(_query);
    }

    var reqOptions = {
      method: 'DELETE',
      endpoint: 'api/v/1/data/' + this.ID,
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
    if (!options) {
      options = {};
    }
    if (options.collection !== undefined || options.collection !== "") {
      this.collection = options.collection;
    }
    this.query = {};
    this.OR = [];
    this.OR.push([this.query]);
    this.offset = options.offset || 0;
    this.limit = options.limit || 10;
  };

  ClearBlade.Query.prototype.ascending = function (field) {
    addSortToQuery(this, "ASC", field);
    return this;
  };

  ClearBlade.Query.prototype.descending = function (field) {
    addSortToQuery(this, "DESC", field);
    return this;
  };

  /**
   * Creates an equality clause in the query object
   * @method ClearBlade.Query.prototype.equalTo
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding an equality clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.equalTo('name', 'John');
   * //will only match if an item has an attribute 'name' that is equal to 'John'
   */
  ClearBlade.Query.prototype.equalTo = function (field, value) {
    addFilterToQuery(this, "EQ", field, value);
    return this;
  };

  /**
   * Creates a greater than clause in the query object
   * @method ClearBlade.Query.prototype.greaterThan
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding a greater than clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.greaterThan('age', 21);
   * //will only match if an item has an attribute 'age' that is greater than 21
   */
  ClearBlade.Query.prototype.greaterThan = function (field, value) {
    addFilterToQuery(this, "GT", field, value);
    return this;
  };

  /**
   * Creates a greater than or equality clause in the query object
   * @method ClearBlade.Query.prototype.greaterThanEqualTo
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding a greater than or equality clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.greaterThanEqualTo('age', 21);
   * //will only match if an item has an attribute 'age' that is greater than or equal to 21
   */
  ClearBlade.Query.prototype.greaterThanEqualTo = function (field, value) {
    addFilterToQuery(this, "GTE", field, value);
    return this;
  };

  /**
   * Creates a less than clause in the query object
   * @method ClearBlade.Query.prototype.lessThan
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding a less than clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.lessThan('age', 50);
   * //will only match if an item has an attribute 'age' that is less than 50
   */
  ClearBlade.Query.prototype.lessThan = function (field, value) {
    addFilterToQuery(this, "LT", field, value);
    return this;
  };

  /**
   * Creates a less than or equality clause in the query object
   * @method ClearBlade.Query.prototype.lessThanEqualTo
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding a less than or equality clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.lessThanEqualTo('age', 50);
   * //will only match if an item has an attribute 'age' that is less than or equal to 50
   */
  ClearBlade.Query.prototype.lessThanEqualTo = function (field, value) {
    addFilterToQuery(this, "LTE", field, value);
    return this;
  };

  /**
   * Creates a not equal clause in the query object
   * @method ClearBlade.Query.prototype.notEqualTo
   * @param {String} field String defining what attribute to compare
   * @param {String} value String or Number that is used to compare against
   * @example <caption>Adding a not equal clause to a query</caption>
   * var query = new ClearBlade.Query();
   * query.notEqualTo('name', 'Jim');
   * //will only match if an item has an attribute 'name' that is not equal to 'Jim'
   */
  ClearBlade.Query.prototype.notEqualTo = function (field, value) {
    addFilterToQuery(this, "NEQ", field, value);
    return this;
  };

  /**
   * chains an existing query object to the Query object in an or
   * @method ClearBlade.Query.prototype.or
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
    for (var i = 0; i < that.query.FILTERS.length; i++) {
      this.query.FILTERS.push(that.query.FILTERS[i]);
    }
    return this;
  };

  /**
   * Set the pagination options for a Query.
   * @method ClearBlade.Query.prototype.setPage
   * @param {int} pageSize Number of items per response page. The default is
   * 100.
   * @param {int} pageNum  Page number, taking into account the page size. The
   * default is 1.
   */
  ClearBlade.Query.prototype.setPage = function (pageSize, pageNum) {
    addToQuery(this, "PAGESIZE", pageSize);
    addToQuery(this, "PAGENUM", pageNum);
    return this;
  };

  ClearBlade.Query.prototype.execute = function (method, callback) {
    var reqOptions = {
      method: method
    };
    switch(method) {
      case "GET":
        reqOptions.qs = 'query=' + _parseQuery(this.query);
        break;
      case "PUT":
        reqOptions.body = this.query; // TOOD: check this shit
        break;
      case "DELETE":
        reqOptions.qs = 'query=' + _parseOperationQuery(this.query);
        break;
      default:
        throw new Error("The method " + method + " does not exist");
    }
    if (this.collection === undefined || this.collection === "") {
      throw new Error("No collection was defined");
    } else {
      reqOptions.endpoint = "api/v/1/data/" + this.collection;
    }
    if (typeof callback === 'function') {
      _request(reqOptions, callback);
    } else {
      logger("No callback was defined!");
    }
  };

  /**
   * Reqests an item or a set of items from the query. Requires that
   * the Query object was initialized with a collection.
   * @method ClearBlade.Query.prototype.fetch
   * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
   * @example <caption>The typical callback</caption>
   * var callback = function (err, data) {
   *     if (err) {
   *         //error handling
   *     } else {
   *         console.log(data);
   *     }
   * };
   * query.fetch(callback);
   * //this will give returnedData the value of what ever was returned from the server.
   */
  ClearBlade.Query.prototype.fetch = function (callback) {
    var reqOptions = {
      method: 'GET',
      qs: 'query=' + _parseQuery(this.query)
    };

    if (this.collection === undefined || this.collection === "") {
      throw new Error("No collection was defined");
    } else {
      reqOptions.endpoint = "api/v/1/data/" + this.collection;
    }
    var colID = this.collection;
    var callCallback = function (err, data) {
      callback(err, data);
    };

    if (typeof callback === 'function') {
      _request(reqOptions, callCallback);
    } else {
      logger("No callback was defined!");
    }
  };

  /**
   * Updates an existing item or set of items. Requires that a collection was
   * set when the Query was initialized.
   * @method ClearBlade.Query.prototype.update
   * @param {Object} changes Object representing the attributes that you want changed
   * @param {function} callback Function that handles the response of the server
   * @example <caption>Updating a set of items</caption>
   * //This example assumes a collection of items that have the columns name and age.
   * var query = new ClearBlade.Query({'collection': 'COLLECTIONID'});
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
   * query.update(changes, callback);
   * //sets John's age to 23
   */
  ClearBlade.Query.prototype.update = function (changes, callback) {
    var reqOptions = {
      method: 'PUT',
      body: {query: this.query.FILTERS, $set: changes}
    };

    var colID = this.collection;
    var callCallback = function (err, data) {
      if (err) {
        callback(err, data);
      } else {
        var itemArray = [];
        for (var i = 0; i < data.length; i++) {
          var newItem = new ClearBlade.Item(data[i], colID);
          itemArray.push(newItem);
        }
        callback(err, itemArray);
      }
    };

    if (this.collection === undefined || this.collection === "") {
      throw new Error("No collection was defined");
    } else {
      reqOptions.endpoint = "api/v/1/data/" + this.collection;
    }
    if (typeof callback === 'function') {
      _request(reqOptions, callCallback);
    } else {
      logger("No callback was defined!");
    }
  };

  /**
   * Removes an item or set of items from the Query
   * @method ClearBlade.Query.prototype.remove
   * @param {function} callback Function that handles the response from the server
   * @example <caption>Removing an item in a collection</caption>
   * //This example assumes that you have a collection with the item whose 'name' attribute is 'John'
   * var query = new ClearBlade.Query({'collection': 'COLLECTIONID'});
   * query.equalTo('name', 'John');
   * var callback = function (err, data) {
   *     if (err) {
   *         throw new Error (data);
   *     } else {
   *         console.log(data);
   *     }
   * };
   *
   * query.remove(callback);
   * //removes every item whose 'name' attribute is equal to 'John'
   */
  ClearBlade.Query.prototype.remove = function (callback) {
    var reqOptions = {
      method: 'DELETE',
      qs: 'query=' + _parseOperationQuery(this.query)
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
      reqOptions.endpoint = "api/v/1/data/" + this.collection;
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


  /**
   * Initializes the ClearBlade messaging object and connects to a server.
   * @class ClearBlade.Messaging
   * @param {Object} options  This value contains the config object for connecting. A number of reasonable defaults are set for the option if none are set.
   *<p>
   *The connect options and their defaults are:
   * <p>{number} [timeout] sets the timeout for the websocket connection in case of failure. The default is 60</p>
   * <p>{Messaging Message} [willMessage] A message sent on a specified topic when the client disconnects without sending a disconnect packet. The default is none.</p>
   * <p>{Number} [keepAliveInterval] The server disconnects if there is no activity for this pierod of time. The default is 60.</p>
   * <p>{boolean} [cleanSession] The server will persist state of the session if true. Not avaliable in beta.</p>
   * <p>{boolean} [useSSL] The option to use SSL websockets. Default is false for now.</p>
   * <p>{object} [invocationContext] An object to wrap all the important variables needed for the onFalure and onSuccess functions. The default is empty.</p>
   * <p>{function} [onSuccess] A callback to operate on the result of a sucessful connect. In beta the default is just the invoking of the `callback` parameter with the data from the connection.</p>
   * <p>{function} [onFailure] A callback to operate on the result of an unsuccessful connect. In beta the default is just the invoking of the `callback` parameter with the data from the connection.</p>
   * <p>{Object} [hosts] An array of hosts to attempt to connect too. Sticks to the first one that works. The default is [ClearBlade.messagingURI].</p>
   * <p>{Object} [ports] An array of ports to try, it also sticks to thef first one that works. The default is [1337].</p>
   *</p>
   * @param {function} callback Callback to be run upon either succeessful or
   * failed connection
   * @example <caption> A standard connect</caption>
   * var callback = function (data) {
   *   console.log(data);
   * };
   * //A connect with a nonstandard timeout
   * var cb = new ClearBlade.Messaging({"timeout":15}, callback);
   */
  ClearBlade.Messaging = function(options, callback){
    var that = this;
    //roll through the config
    var conf = {};
    conf.userName = ClearBlade.user.authToken;
    conf.password = ClearBlade.appSecret;
    conf.cleanSession = options.cleanSession || true;
    conf.useSSL = options.useSSL || false; //up for debate. ole' perf vs sec argument
    conf.hosts = options.hosts || [ClearBlade.messagingURI];
    conf.ports = options.ports || [ClearBlade.messagingPort];
    if (options.qos !== undefined && options.qos !== null) {
      this._qos = options.qos;
    } else {
      this._qos = ClearBlade.defaultQoS;
    }

    var onConnectionLost = function(){
      console.log("ClearBlade Messaging connection lost- attempting to reestablish");
      that.client.connect(conf);
    };

    var onMessageArrived = function(message){
      // messageCallback from Subscribe()
      that.messageCallback(message.payloadString);
    };

    var clientID = Math.floor(Math.random() * 10e12).toString();
    this.client = new Messaging.Client(conf.hosts[0],conf.ports[0],clientID);
    this.client.onConnectionLost = onConnectionLost;
    this.client.onMessageArrived = onMessageArrived;
    // the mqtt websocket library uses "onConnect," but our terminology uses
    // "onSuccess" and "onFailure"
    var onSuccess = function(data) {
      callback(data);
    };

    this.client.onConnect = onSuccess;
    var onFailure = function(err) {
      console.log("ClearBlade Messaging failed to connect");
      callback(err);
    };

    conf.onSuccess = options.onSuccess || onSuccess;
    conf.onFailure = options.onFailure || onFailure;

    this.client.connect(conf);
  };


  /**
   * Publishes to a topic.
   * @method ClearBlade.Messaging.prototype.Publish
   * @param {string} topic Is the topic path of the message to be published. This will be sent to all listeners on the topic. No default.
   * @param {string | ArrayBuffer} payload The payload to be sent. Also no default.
   * @example <caption> How to publish </caption>
   * var callback = function (data) {
   *   console.log(data);
   * };
   * var cb = ClearBlade.Messaging({}, callback);
   * cb.Publish("ClearBlade/is awesome!","Totally rules");
   * //Topics can include spaces and punctuation  except "/"
   */

  ClearBlade.Messaging.prototype.Publish = function(topic, payload){
    var msg = new Messaging.Message(payload);
    msg.destinationName = topic;
    msg.qos = this._qos;
    this.client.send(msg);
  };

  /**
   * Subscribes to a topic
   * @method ClearBlade.Messaging.prototype.Subscribe
   * @param {string} topic The topic to subscribe to. No default.
   * @param {Object} [options] The configuration object. Options:
     <p>{Number} [qos] The quality of service specified within MQTT. The default is 0, or fire and forget.</p>
     <p>{Object}  [invocationContext] An object that contains variables and other data for the onSuccess and failure callbacks. The default is blank.</p>
     <p>{function} [onSuccess] The callback invoked on a successful subscription. The default is nothing.</p>
     <p>{function} [onFailure] The callback invoked on a failed subsciption. The default is nothing.</p>
     <p>{Number} [timeout] The time to wait for a response from the server acknowleging the subscription.</p>
   * @param {function} messageCallback Callback to invoke upon message arrival
   * @example <caption> How to publish </caption>
   * var callback = function (data) {
   *   console.log(data);
   * };
   * var cb = ClearBlade.Messaging({}, callback);
   * cb.Subscribe("ClearBlade/is awesome!",{});
   */
  ClearBlade.Messaging.prototype.Subscribe = function (topic,options,messageCallback){

    var onSuccess = function() {
      var conf = {};
      conf["qos"] = this._qos || 0;
      conf["invocationContext"] = options["invocationContext"] ||  {};
      conf["onSuccess"] = options["onSuccess"] || null;
      conf["onFailure"] = options["onFailure"] || null;
      conf["timeout"] = options["timeout"] || 60;
      this.client.subscribe(topic,conf);
    };

    var onFailure = function() {
      alert("failed to connect");
    };

    this.client.subscribe(topic);

    this.messageCallback = messageCallback;
  };

  /**
  * Unsubscribes from a topic
  * @method ClearBlade.Messaging.prototype.Unsubscribe
  * @param {string} topic The topic to subscribe to. No default.
  * @param {Object} [options] The configuration object
    <p>
    @options {Object}  [invocationContext] An object that contains variables and other data for the onSuccess and failure callbacks. The default is blank.
    @options {function} [onSuccess] The callback invoked on a successful unsubscription. The default is nothing.
    @options {function} [onFailure] The callback invoked on a failed unsubcription. The default is nothing.
    @options {Number} [timeout] The time to wait for a response from the server acknowleging the subscription.
    </p>
  * @example <caption> How to publish </caption>
  * var callback = function (data) {
  *   console.log(data);
  * };
  * var cb = ClearBlade.Messaging({}, callback);
  * cb.Unsubscribe("ClearBlade/is awesome!",{"onSuccess":function(){console.log("we unsubscribe");});
  */
  ClearBlade.Messaging.prototype.Unsubscribe = function(topic,options){
    var conf = {};
    conf["invocationContext"] = options["invocationContext"] ||  {};
    conf["onSuccess"] = options["onSuccess"] || function(){};//null;
    conf["onFailure"] = options["onFailure"] || function(){};//null;
    conf["timeout"] = options["timeout"] || 60;
    this.client.unsubscribe(topic,conf);
  };

  /**
   * Disconnects from the server.
   * @method ClearBlade.Messaging.prototype.Disconnect
   * @example <caption> How to publish </caption>
   * var callback = function (data) {
   *   console.log(data);
   * };
   * var cb = ClearBlade.Messaging({}, callback);
   * cb.Disconnect()//why leave so soon :(
  */
  ClearBlade.Messaging.prototype.Disconnect = function(){
    this.client.disconnect()
  };


})(window);
