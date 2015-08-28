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
   * initOptions = {systemKey: 'asdfknafikjasd3853n34kj2vc', systemSecret: 'SHHG245F6GH7SDFG823HGSDFG9'};
   * var cb = new ClearBlade();
   * cb.init(initOptions);
   *
   */

  if (typeof exports != 'undefined') {
    window = exports;
  } else {
    ClearBlade = $cb = window.$cb = window.ClearBlade = window.ClearBlade || function() { };
  }

  ClearBlade.MESSAGING_QOS_AT_MOST_ONCE = 0;
  ClearBlade.MESSAGING_QOS_AT_LEAST_ONCE = 1;
  ClearBlade.MESSAGING_QOS_EXACTLY_ONCE = 2;
  /**
   * This method initializes the ClearBlade module with the values needed to connect to the platform
   * @method ClearBlade.init
   * @param {Object} options  This value contains the config object for initializing the ClearBlade module. A number of reasonable defaults are set for the option if none are set.
   *<p>
   *The connect options and their defaults are:
   * <p>{String} [systemKey] This is the app key that will identify your app in order to connect to the Platform</p>
   * <p>{String} [systemSecret] This is the app secret that will be used in combination with the systemKey to authenticate your app</p>
   * <p>{String} [URI] This is the URI used to identify where the Platform is located. Default is https://platform.clearblade.com</p>
   * <p>{String} [messagingURI] This is the URI used to identify where the Messaging server is located. Default is platform.clearblade.com</p>
n   * <p>{Number} [messagingPort] This is the default port used when connecting to the messaging server. Default is 8904</p>
   * <p>{Boolean} [logging] This is the property that tells the API whether or not the API will log to the console. This should be left `false` in production. Default is false</p>
   * <p>{Number} [callTimeout] This is the amount of time that the API will use to determine a timeout. Default is 30 seconds</p>
   *</p>
   */
  ClearBlade.prototype.init = function (options) {
    var _this = this;

    //check for undefined/null then check if they are the correct types for required params
    if (!options || typeof options !== 'object')
      throw new Error('Options must be an object or it is undefined');

    if (!options.systemKey || typeof options.systemKey !== 'string')
      throw new Error('systemKey must be defined/a string');

    if (!options.systemSecret || typeof options.systemSecret !== 'string')
      throw new Error('systemSecret must be defined/a string');

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
     * @property systemKey
     * @type String
     */
    ClearBlade.prototype.systemKey = options.systemKey;
    this.systemKey = options.systemKey;
    /**
     * This is the app secret that will be used in combination with the systemKey to authenticate your app
     * @property systemSecret
     * @type String
     */
    ClearBlade.prototype.systemSecret = options.systemSecret;
    this.systemSecret = options.systemSecret;
    /**
     * This is the master secret that is used during development to test many apps at a time
     * This is not currently not in use
     * @property masterSecret
     * @type String
     */
    ClearBlade.prototype.masterSecret = options.masterSecret;
    this.masterSecret = options.masterSecret || null;
    /**
     * This is the URI used to identify where the Platform is located
     * @property URI
     * @type String
     */
    ClearBlade.prototype.URI = options.URI;
    this.URI = options.URI || "https://platform.clearblade.com";

    /**
     * This is the URI used to identify where the Messaging server is located
     * @property messagingURI
     * @type String
     */
    ClearBlade.prototype.messagingURI = options.messagingURI;
    this.messagingURI = options.messagingURI || "platform.clearblade.com";

    /**
     * This is the default port used when connecting to the messaging server
     * @prpopert messagingPort
     * @type Number
     */
    ClearBlade.prototype.messagingPort = options.messagingPort;
    this.messagingPort = options.messagingPort || 8904;
    /**
     * This is the property that tells the API whether or not the API will log to the console
     * This should be left `false` in production
     * @property logging
     * @type Boolean
     */
    ClearBlade.prototype.logging = options.logging;
    this.logging = options.logging || false;

    ClearBlade.prototype.defaultQoS = options.defaultQoS;
    this.defaultQoS = options.defaultQoS || 0;
    /**
     * This is the amount of time that the API will use to determine a timeout
     * @property _callTimeout=30000
     * @type Number
     * @private
     */
    ClearBlade.prototype._callTimeout = options.callTimeout;
    this._callTimeout =  options.callTimeout || 30000; //default to 30 seconds

    this.user = null;

    if (options.useUser) {
      _this.setUser(options.useUser.email, options.useUser.authToken);
    } else if (options.registerUser) {
      this.registerUser(options.email, options.password, function(err, response) {
        if (err) {
          execute(err, response, options.callback);
        } else {
          _this.loginUser(options.email, options.password, function(err, user) {
            execute(err, user, options.callback);
          });
        }
      });
    } else if (options.email) {
      this.loginUser(options.email, options.password, function(err, user) {
        execute(err, user, options.callback);
      });
    } else {
      this.loginAnon(function(err, user) {
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
  /**
  * Used when assuming the role of a user to make subsequent requests
  * @method ClearBlade.setUser
  * @param email {String} the email of the user
  * @param authToken {String} the authToken for the user
  */
  ClearBlade.prototype.setUser = function(email, authToken) {
    this.user = {
      "email": email,
      "authToken": authToken
    };
    ClearBlade.prototype.user = this.user;
  };

  /**
  * Method to register a user with the ClearBlade Platform
  * @method ClearBlade.registerUser
  * @param email {String} the users email
  * @param password {String} the password for the user
  * @param callback {function} returns a Boolean error value and a response as parameters
  * @example <caption> Register User </caption>
  * cb.registerUser("newUser@domain.com", "qwerty", function(err, body) {
  *     if(err) {
  *       //handle error
  *     } else {
  *       console.log(body);
  *     }
  *  });
  */
  ClearBlade.prototype.registerUser = function(email, password, callback) {
    _validateEmailPassword(email, password);
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/reg',
      useUser: false,
      body: { "email": email, "password": password },
      systemKey: this.systemKey,
      systemSecret: this.systemSecret,
      timeout: this._callTimeout,
      URI: this.URI
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, "User successfully registered", callback);
      }
    });
  };
  /**
   * Method to check if the current user has an active server session
   * @method  ClearBlade.isCurrentUserAuthenticated
   * @param  {Function} callback
   * @example
   * cb.isCurrentUserAuthenticated(function(err, body) {
   *    if(err) {
   *      //handle error
   *    } else {
   *      //check authentication boolean
   *    }
   * })
   */
  ClearBlade.prototype.isCurrentUserAuthenticated = function(callback) {
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/checkauth',
      systemKey: this.systemKey,
      systemSecret: this.systemSecret,
      timeout: this._callTimeout,
      user: this.user,
      URI: this.URI
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, response.is_authenticated, callback);
      }
    });
  };
  /**
   * Method to end the server session for the current user
   * @method  ClearBlade.logoutUser
   * @param  {Function} callback
   * @example
   * cb.logoutUser(function(err, body) {
   *    if(err) {
   *        //handle error
   *    } else {
   *        //do post logout stuff
   *    }
   * })
   */
  ClearBlade.prototype.logoutUser = function(callback) {
    ClearBlade.request({
      method: 'POST',
      endpoint: 'api/v/1/user/logout',
      systemKey: this.systemKey,
      systemSecret: this.systemSecret,
      timeout: this._callTimeout,
      user: this.user,
      URI: this.URI
    }, function(err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        execute(false, "User Logged out", callback);
      }
    });
  };

  /**
   * Method to create an anonymous session with the ClearBlade Platform
   * @method  ClearBlade.loginAnon
   * @param  {Function} callback
   * @example
   * cb.loginAnon(function(err, body) {
   *    if(err) {
   *        //handle error
   *    } else {
   *        //do post login stuff
   *    }
   * })
   */
  ClearBlade.prototype.loginAnon = function(callback) {
    var _this = this;
    ClearBlade.request({
      method: 'POST',
      useUser: false,
      endpoint: 'api/v/1/user/anon',
      systemKey: this.systemKey,
      systemSecret: this.systemSecret,
      timeout: this._callTimeout,
      URI: this.URI
    }, function(err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        _this.setUser(null, response.user_token);
        execute(false, _this.user, callback);
      }
    });
  };
  /**
   * Method to create an authenticated session with the ClearBlade Platform
   * @method
   * @param  {String}   email
   * @param  {String}   password
   * @param  {Function} callback
   * @example
   * cb.loginUser("existentUser@domain.com", "qwerty", function(err, body) {
   *    if(err) {
   *        //handle error
   *    } else {
   *        //do post login stuff
   *    }
   * })
   */
  ClearBlade.prototype.loginUser = function(email, password, callback) {
    var _this = this;
    _validateEmailPassword(email, password);
    ClearBlade.request({
      method: 'POST',
      useUser: false,
      endpoint: 'api/v/1/user/auth',
      systemKey: this.systemKey,
      systemSecret: this.systemSecret,
      URI: this.URI,
      timeout: this._callTimeout,
      body: { "email": email, "password": password }
    }, function (err, response) {
      if (err) {
        execute(true, response, callback);
      } else {
        _this.setUser(email, response.user_token);
        execute(false, _this.user, callback);
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

  /*
   * request method
   *
   */

   var _createItemList = function(err, data, options, callback) {
    if (err) {
      callback(err, data);
    } else {
      var itemArray = [];
      for (var i = 0; i < data.length; i++) {
        itemArray.push(ClearBlade.prototype.Item(data[i], options));
      }
      callback(err, itemArray);
    }
   };

  var _request = function (options, callback) {
    var method = options.method || 'GET';
    var endpoint = options.endpoint || '';
    var body = options.body || {};
    var qs = options.qs || '';
    var url = options.URI || 'https://platform.clearblade.com';
    var useUser = options.useUser || true;
    var authToken = useUser && options.authToken;
    var callTimeout = options.timeout || 30000;
    if (useUser && !authToken && options.user && options.user.authToken) {
      authToken = options.user.authToken;
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
      httpRequest.setRequestHeader("ClearBlade-SystemKey", options.systemKey);
      httpRequest.setRequestHeader("ClearBlade-SystemSecret", options.systemSecret);
    } else {
      httpRequest.setRequestHeader("ClearBlade-SystemKey", options.systemKey);
      httpRequest.setRequestHeader("ClearBlade-SystemSecret", options.systemSecret);
    }

    if (!isObjectEmpty(body) || params) {

      if (method === "POST" || method === "PUT") {
        // Content-Type is expected for POST and PUT; bad things can happen if you don't specify this.
        httpRequest.setRequestHeader("Content-Type", "application/json");
      }

      httpRequest.setRequestHeader("Accept", "application/json");
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
          var flag = true;
          // try to parse response, it should be JSON
          if (httpRequest.responseText == '[{}]' || httpRequest.responseText == '[]') {
            error = false;
            execute(error, [], callback);
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
    var xhrTimeout = setTimeout(callAbort, callTimeout);
    httpRequest.send(body);

  };

  ClearBlade.request = function (options, callback) {
    if (!options || typeof options !== 'object') {
      throw new Error("Request: options is not an object or is empty");
    }

    _request(options, callback);
  };

  var _parseOperationQuery = function(_query) {
    return encodeURIComponent(JSON.stringify(_query.FILTERS));
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
   * @example
   * var col = cb.Collection("12asd3049qwe834qe23asdf1234");
   */
  ClearBlade.prototype.Collection = function(options) {
    var collection = {};
    if(typeof options === "string") {
      collection.endpoint = "api/v/1/data/" + options;
      options = {collectionID: options};
    } else if (options.collectionName && options.collectionName !== "") {
      collection.endpoint = "api/v/1/collection/" + this.systemKey + "/" + options.collectionName;
    } else if(options.collectionID && options.collectionID !== "") {
      collection.endpoint = "api/v/1/data/" + options.collectionID;
    } else {
      throw new Error("Must supply a collectionID or collectionName key in options object");
    }
    collection.user = this.user;
    collection.URI = this.URI;
    collection.systemKey = this.systemKey;
    collection.systemSecret = this.systemSecret;
    /**
     * Reqests an item or a set of items from the collection.
     * @method ClearBlade.Collection.prototype.fetch
     * @param {Query} _query Used to request a specific item or subset of items from the collection on the server. Optional.
     * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
     * @return {ClearBlade.Item} An array of ClearBlade Items
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
    collection.fetch = function (_query, callback) {
      var query;
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
        if (Object.keys(_query) < 1) {
          query = '';
        } else {
          query = 'query='+ _parseQuery(_query.query);
        }
      }

      var reqOptions = {
        method: 'GET',
        endpoint: this.endpoint,
        qs: query,
        user: this.user,
        URI: this.URI
      };

      var callCallback = function (err, data) {
        _createItemList(err, data.DATA, options, callback);
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callCallback);
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
    collection.create = function (newItem, callback) {
      var reqOptions = {
        method: 'POST',
        endpoint: this.endpoint,
        body: newItem,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
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
     * var query = ClearBlade.Query();
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
    collection.update = function (_query, changes, callback) {
      var reqOptions = {
        method: 'PUT',
        endpoint: this.endpoint,
        body: {query: _query.query.FILTERS, $set: changes},
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
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
     * var query = ClearBlade.Query();
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
    collection.remove = function (_query, callback) {
      var query;
      if (_query === undefined) {
        throw new Error("no query defined!");
      } else {
        query = 'query=' + _parseOperationQuery(_query.query);
      }

      var reqOptions = {
        method: 'DELETE',
        endpoint: this.endpoint,
        qs: query,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    collection.columns = function (callback) {
      if (typeof callback === 'function') {
        ClearBlade.request({
          method: 'GET',
          URI: this.URI,
          endpoint: this.endpoint + '/columns',
          systemKey: this.systemKey,
          systemSecret: this.systemSecret,
          user: this.user,
        }, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    collection.count = function (_query, callback) {
      if (typeof callback === 'function') {
        var query;
        if (_query === undefined || Object.keys(_query).length < 1) {
          query = '';
        } else {
          query = 'query=' + _parseOperationQuery(_query.query);
        }
        ClearBlade.request({
          method: 'GET',
          URI: this.URI,
          qs: query,
          endpoint: this.endpoint + '/count',
          systemKey: this.systemKey,
          systemSecret: this.systemSecret,
          user: this.user,
        }, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    return collection;
  };



  /**
   * creates and returns a Query object that can be used in Collection methods or on its own to operate on items on the server
   * @class ClearBlade.Query
   * @param {Object} options Object that has configuration values used when instantiating a Query object
   * @returns {Object} Clearblade.Query the created query
   */
  ClearBlade.prototype.Query = function (options) {
    var _this = this;
    var query = {};
    if (!options) {
      options = {};
    }
    if(typeof options === "string") {
      query.endpoint = "api/v/1/data/" + options;
      options = {collectionID: options};
    } else if (options.collectionName && options.collectionName !== "") {
      query.endpoint = "api/v/1/collection/" + this.systemKey + "/" + options.collectionName;
    } else if(options.collectionID && options.collectionID !== "") {
      query.endpoint = "api/v/1/data/" + options.collectionID;
    }
    query.user = this.user;
    query.URI = this.URI;
    query.systemKey = this.systemKey;
    query.systemSecret = this.systemSecret;

    query.query = {};
    query.OR = [];
    query.OR.push([query.query]);
    query.offset = options.offset || 0;
    query.limit = options.limit || 10;

    query.addSortToQuery = function(queryObj, direction, column) {
      if (typeof queryObj.query.SORT === 'undefined') {
        queryObj.query.SORT = [];
      }
      var newSort = {}
      newSort[direction] = column;
      queryObj.query.SORT.push(newSort);
    };

    query.addFilterToQuery = function (queryObj, condition, key, value) {
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

    query.ascending = function (field) {
      this.addSortToQuery(this, "ASC", field);
      return this;
    };

    query.descending = function (field) {
      this.addSortToQuery(this, "DESC", field);
      return this;
    };

    /**
     * Creates an equality clause in the query object
     * @method ClearBlade.Query.prototype.equalTo
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding an equality clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.equalTo('name', 'John');
     * //will only match if an item has an attribute 'name' that is equal to 'John'
     */
    query.equalTo = function (field, value) {
      this.addFilterToQuery(this, "EQ", field, value);
      return this;
    };

    /**
     * Creates a greater than clause in the query object
     * @method ClearBlade.Query.prototype.greaterThan
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding a greater than clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.greaterThan('age', 21);
     * //will only match if an item has an attribute 'age' that is greater than 21
     */
    query.greaterThan = function (field, value) {
      this.addFilterToQuery(this, "GT", field, value);
      return this;
    };

    /**
     * Creates a greater than or equality clause in the query object
     * @method ClearBlade.Query.prototype.greaterThanEqualTo
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding a greater than or equality clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.greaterThanEqualTo('age', 21);
     * //will only match if an item has an attribute 'age' that is greater than or equal to 21
     */
    query.greaterThanEqualTo = function (field, value) {
      this.addFilterToQuery(this, "GTE", field, value);
      return this;
    };

    /**
     * Creates a less than clause in the query object
     * @method ClearBlade.Query.prototype.lessThan
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding a less than clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.lessThan('age', 50);
     * //will only match if an item has an attribute 'age' that is less than 50
     */
    query.lessThan = function (field, value) {
      this.addFilterToQuery(this, "LT", field, value);
      return this;
    };

    /**
     * Creates a less than or equality clause in the query object
     * @method ClearBlade.Query.prototype.lessThanEqualTo
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding a less than or equality clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.lessThanEqualTo('age', 50);
     * //will only match if an item has an attribute 'age' that is less than or equal to 50
     */
    query.lessThanEqualTo = function (field, value) {
      this.addFilterToQuery(this, "LTE", field, value);
      return this;
    };

    /**
     * Creates a not equal clause in the query object
     * @method ClearBlade.Query.prototype.notEqualTo
     * @param {String} field String defining what attribute to compare
     * @param {String} value String or Number that is used to compare against
     * @example <caption>Adding a not equal clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.notEqualTo('name', 'Jim');
     * //will only match if an item has an attribute 'name' that is not equal to 'Jim'
     */
    query.notEqualTo = function (field, value) {
      this.addFilterToQuery(this, "NEQ", field, value);
      return this;
    };

    /**
     * Creates an regular expression matching clause in the query object
     * @method ClearBlade.Query.prototype.matches
     * @param {String} field String defining what attribute to compare
     * @param {String} pattern String or Number that is used to compare against
     * @example <caption>Adding an regex matching clause to a query</caption>
     * var query = ClearBlade.Query();
     * query.matches('name', 'Smith$');
     * //will only match if an item has an attribute 'name' that That ends in 'Smith'
     */
    query.matches = function (field, pattern) {
      this.addFilterToQuery(this, "RE", field, pattern);
      return this;
    };

    /**
     * chains an existing query object to the Query object in an or
     * @method ClearBlade.Query.prototype.or
     * @param {Query} that Query object that will be added in disjunction to this query object
     * @example <caption>Chaining two queries together in an or</caption>
     * var query1 = ClearBlade.Query();
     * var query2 = ClearBlade.Query();
     * query1.equalTo('name', 'John');
     * query2.equalTo('name', 'Jim');
     * query1.or(query2);
     * //will match if an item has an attribute 'name' that is equal to 'John' or 'Jim'
     */
    query.or = function (that) {
      if (this.query.hasOwnProperty('FILTERS') && that.query.hasOwnProperty('FILTERS')) {
        for (var i = 0; i < that.query.FILTERS.length; i++) {
          this.query.FILTERS.push(that.query.FILTERS[i]);
        }
        return this;
      } else if (!this.query.hasOwnProperty('FILTERS') && that.query.hasOwnProperty('FILTERS')) {
        for (var j = 0; j < that.query.FILTERS.length; j++) {
          this.query.FILTERS = [];
          this.query.FILTERS.push(that.query.FILTERS[j]);
        }
        return this;
      }
    };

    /**
     * Set the pagination options for a Query.
     * @method ClearBlade.Query.prototype.setPage
     * @param {int} pageSize Number of items per response page. The default is
     * 100.
     * @param {int} pageNum  Page number, taking into account the page size. The
     * default is 1.
     */
    query.setPage = function (pageSize, pageNum) {
      this.query.PAGESIZE = pageSize;
      this.query.PAGENUM = pageNum;
      return this;
    };

    /**
     * Reqests an item or a set of items from the query. Requires that
     * the Query object was initialized with a collection.
     * @method ClearBlade.Query.prototype.fetch
     * @param {function} callback Supplies processing for what to do with the data that is returned from the collection
     * @return {ClearBlade.Item} An array of ClearBlade Items
     * @example <caption>The typical callback</caption>
     * var query = ClearBlade.Query({'collection': 'COLLECTIONID'});
     * var callback = function (err, data) {
     *     if (err) {
     *         //error handling
     *     } else {
     *         console.log(data);
     *     }
     * };
     * query.fetch(callback);
     */
    query.fetch = function (callback) {
      var reqOptions = {
        method: 'GET',
        qs: 'query=' + _parseQuery(this.query),
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };
      var callCallback = function (err, data) {
        _createItemList(err, data.DATA, options, callback);
      };

      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callCallback);
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
     * var query = ClearBlade.Query({'collection': 'COLLECTIONID'});
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
    query.update = function (changes, callback) {
      var reqOptions = {
        method: 'PUT',
        body: {query: this.query.FILTERS, $set: changes},
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };

      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
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
     * var query = ClearBlade.Query({'collection': 'COLLECTIONID'});
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
    query.remove = function (callback) {
      var reqOptions = {
        method: 'DELETE',
        qs: 'query=' + _parseQuery(this.query),
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };

      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    return query;
  };
  /**
   * Note: This class cannot be used with connections
   * @class ClearBlade.Item
   * @param {Object} data Object that contains necessary data for an item in a ClearBlade Collection
   * @param {String} collection Collection ID of the collection the item belongs to
   */
  ClearBlade.prototype.Item = function (data, options) {
    var item = {};
    if (!(data instanceof Object)) {
      throw new Error("data must be of type Object");
    }
    if(options === undefined || options === null || options === "") {
      throw new Error("Must supply an options parameter");
    }
    if(typeof options === "string") {
      options = {collectionID: options};
    }
    item.data = data;

    item.save = function (callback) {
      //do a put or a post to the database to save the item in the db
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo('item_id', this.data.item_id);
      var callCallback = function (err, data) {
        if (err) {
          callback(err, data);
        } else {
          self.data = data[0];
          callback(err, data);
        }
      };
      query.update(this.data, callCallback);
    };

    item.refresh = function (callback) {
      //do a get to make the local item reflect the database
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo('item_id', this.data.item_id);
      var callCallback = function (err, data) {
        if (err) {
          callback(err, data);
        } else {
          self.data = data[0];
          callback(err, data);
        }
      };
      query.fetch(callCallback);
    };

    item.destroy = function (callback) {
      //deletes the relative record in the DB then deletes the item locally
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo('item_id', this.data.item_id);
      var callCallback = function (err, data) {
        if (err) {
          callback(err, data);
        } else {
          self.data = null;
          delete self.data;
          callback(err, data);
        }
      };
      query.remove(callCallback);
      delete this;
    };

    return item;
  };
  /**
   * creates and returns a Code object that can be used to execute ClearBlade Code Services
   * @class  ClearBlade.Code
   * @returns {Object} ClearBlade.Code
   */
  ClearBlade.prototype.Code = function(){
    var code = {};
    code.user = this.user;
    code.URI = this.URI;
    code.systemKey = this.systemKey;
    code.systemSecret = this.systemSecret;
    code.callTimeout = this._callTimeout;
    /**
     * Executes a ClearBlade Code Service
     * @method  ClearBlade.Code.prototype.execute
     * @param  {String}   name name of the ClearBlade service
     * @param  {Object}   params object containing parameters to be used in service
     * @param  {Function} callback
     * @example
     * cb.Code().execute("ServiceName", {stringParam: "stringVal", numParam: 1, objParam: {"key": "val"}, arrayParam: ["ClearBlade", "is", "awesome"]}, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.execute = function(name, params, callback){
      var reqOptions = {
        method: 'POST',
        endpoint: 'api/v/1/code/' + this.systemKey + '/' + name,
        body: params,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    return code;
  };
  /**
   * @class ClearBlade.User
   * @returns {Object} ClearBlade.User the created User object
   */
  ClearBlade.prototype.User = function(){
    var user = {};
    user.user = this.user;
    user.URI = this.URI;
    user.endpoint = 'api/v/1/user';
    user.systemKey = this.systemKey;
    user.systemSecret = this.systemSecret;
    user.callTimeout = this._callTimeout;

    /**
     * Retrieves info on the current user
     * @method ClearBlade.User.prototype.getUser
     * @param  {Function} callback
     * @example
     * var user = cb.User();
     * user.getUser(function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        //do stuff with user info
     *    }
     * });
     */
    user.getUser = function(callback){
      var reqOptions = {
        method: 'GET',
        endpoint: this.endpoint + '/info',
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };
    /**
     * Performs a put on the current users row
     * @method ClearBlade.User.prototype.setUser
     * @param {Object}   data Object containing the data to update
     * @param {Function} callback
     * @example
     * var newUserInfo = {
     *    "name": "newName",
     *    "age": 76
     * }
     * var user = cb.User();
     * user.setUser(newUserInfo, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    user.setUser = function(data, callback){
      var reqOptions = {
        method: 'PUT',
        endpoint: this.endpoint + '/info',
        body: data,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === 'function') {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Method to retrieve all the users in a system
     * @method ClearBlade.User.prototype.allUsers
     * @param  {ClearBlade.Query}   _query ClearBlade query used to filter users
     * @param  {Function} callback
     * @example
     * var user = cb.User();
     * var query = cb.Query();
     * query.equalTo("name", "John");
     * query.setPage(0,0);
     * user.allUsers(query, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     * //returns all the users with a name property equal to "John"
     */
    user.allUsers = function(_query, callback) {
      if (typeof callback === 'function') {
        var query;
        if (callback === undefined) {
          callback = _query;
          query = '';
        } else if (Object.keys(_query).length < 1) {
          query = '';
        } else {
          query = 'query=' + _parseQuery(_query.query);
        }
        ClearBlade.request({
          method: 'GET',
          systemKey: this.systemKey,
          systemSecret: this.systemSecret,
          endpoint: this.endpoint,
          qs: query,
          user: this.user,
          URI: this.URI
        }, callback);
      } else {
        logger('No callback was defined!');
      }
    };

    user.setPassword = function(oldPass, newPass, callback) {
      if (typeof callback === 'function') {
        ClearBlade.request({
          method: 'PUT',
          endpoint: this.endpoint + '/pass',
          body: {oldPass:oldPass,newPass:newPass},
          user: this.user,
          URI: this.URI,
        }, callback);
      } else {
        logger('No callback was defined!');
      }
    };

    user.count = function(_query, callback) {
      if (typeof callback === 'function') {
        var query;
        if (_query === undefined || Object.keys(_query).length < 1) {
          query = '';
        } else {
          query = 'query=' + _parseOperationQuery(_query.query);
        }
        ClearBlade.request({
          method: 'GET',
          endpoint: this.endpoint + '/count',
          qs: query,
          user: this.user,
          URI: this.URI,
        }, callback);
      } else {
        logger('No callback was defined!');
      }
    };

    return user;
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
   * var cb = ClearBlade.Messaging({"timeout":15}, callback);
   */
  ClearBlade.prototype.Messaging = function(options, callback){
    if (!window.Paho) {
      throw new Error('Please include the mqttws31.js script on the page');
    }
    var _this = this;
    var messaging = {};

    messaging.user = this.user;
    messaging.URI = this.URI;
    messaging.endpoint = 'api/v/1/message';
    messaging.systemKey = this.systemKey;
    messaging.systemSecret = this.systemSecret;
    messaging.callTimeout = this._callTimeout;

    //roll through the config
    var conf = {};
    conf.userName = this.user.authToken;
    conf.password = this.systemKey;
    conf.cleanSession = options.cleanSession || true;
    conf.useSSL = options.useSSL || false; //up for debate. ole' perf vs sec argument
    conf.hosts = options.hosts || [this.messagingURI];
    conf.ports = options.ports || [this.messagingPort];
    if (options.qos !== undefined && options.qos !== null) {
      messaging._qos = options.qos;
    } else {
      messaging._qos = this.defaultQoS;
    }

    var clientID = Math.floor(Math.random() * 10e12).toString();
    messaging.client = new Paho.MQTT.Client(conf.hosts[0],conf.ports[0],clientID);//new Messaging.Client(conf.hosts[0],conf.ports[0],clientID);

    messaging.client.onConnectionLost = function(response){
      console.log("ClearBlade Messaging connection lost- attempting to reestablish");
      delete conf.mqttVersionExplicit;
      delete conf.uris;
      messaging.client.connect(conf);
    };

    messaging.client.onMessageArrived = function(message){
      // messageCallback from Subscribe()
      messaging.messageCallback(message.payloadString);
    };;
    // the mqtt websocket library uses "onConnect," but our terminology uses
    // "onSuccess" and "onFailure"
    var onSuccess = function(data) {
      callback(undefined, data);
    };

    messaging.client.onConnect = onSuccess;
    var onFailure = function(err) {
      console.log("ClearBlade Messaging failed to connect");
      callback(err, undefined);
    };

    conf.onSuccess = options.onSuccess || onSuccess;
    conf.onFailure = options.onFailure || onFailure;

    messaging.client.connect(conf);

    /**
     * Gets the message history from a ClearBlade Messaging topic.
     * @method ClearBlade.Messaging.getMessageHistory
     * @param {string} topic The topic from which to retrieve history
     * @param {number} startTime The time from which the history retrieval begins
     * @param {number} count The number of messages to retrieve
     * @param {funtion} callback The function to be called upon execution of query -- called with a boolean error and the response
     */
    messaging.getMessageHistory = function(topic, startTime, count, callback) {
      var reqOptions = {
        method: 'GET',
        endpoint: this.endpoint + '/' + this.systemKey,
        qs: 'topic=' + topic + '&count=' + count + '&last=' + startTime,
        authToken: this.user.authToken,
        timeout: this.callTimeout,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          execute(false, response, callback);
        }
      });
    };

    messaging.currentTopics = function(callback) {
      if (typeof callback === 'function') {
        ClearBlade.request({
          method: 'GET',
          endpoint: this.endpoint + '/' + this.systemKey + '/currentTopics',
          user: this.user,
          URI: this.URI,
        }, callback);
      } else {
        logger('No callback was defined!');
      }
    };

    /**
     * Publishes to a topic.
     * @method ClearBlade.Messaging.prototype.publish
     * @param {string} topic Is the topic path of the message to be published. This will be sent to all listeners on the topic. No default.
     * @param {string | ArrayBuffer} payload The payload to be sent. Also no default.
     * @example <caption> How to publish </caption>
     * var callback = function (data) {
     *   console.log(data);
     * };
     * var cb = ClearBlade.Messaging({}, callback);
     * cb.publish("ClearBlade/is awesome!","Totally rules");
     * //Topics can include spaces and punctuation  except "/"
     */
    messaging.publish = function(topic, payload){
      var msg = new Paho.MQTT.Message(payload);
      msg.destinationName = topic;
      msg.qos = this._qos;
      messaging.client.send(msg);
    };

    messaging.publishREST = function(topic, payload, callback){
      ClearBlade.request({
        method: 'POST',
        endpoint: this.endpoint + '/' + this.systemKey + '/publish',
        body: {topic:topic, payload:payload},
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        user: this.user,
        URI: this.URI,
      }, callback);
    };

    /**
     * Subscribes to a topic
     * @method ClearBlade.Messaging.prototype.subscribe
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
     * cb.subscribe("ClearBlade/is awesome!",{});
     */
    messaging.subscribe = function (topic,options,messageCallback){
      var _this = this;

      var onSuccess = function() {
        var conf = {};
        conf["qos"] = this._qos || 0;
        conf["invocationContext"] = options["invocationContext"] ||  {};
        conf["onSuccess"] = options["onSuccess"] || null;
        conf["onFailure"] = options["onFailure"] || null;
        conf["timeout"] = options["timeout"] || 60;
        _this.client.subscribe(topic,conf);
      };

      var onFailure = function() {
        alert("failed to connect");
      };

      this.client.subscribe(topic);

      this.messageCallback = messageCallback;
    };

    /**
     * Unsubscribes from a topic
     * @method ClearBlade.Messaging.prototype.unsubscribe
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
     * cb.unsubscribe("ClearBlade/is awesome!",{"onSuccess":function(){console.log("we unsubscribe");});
     */
    messaging.unsubscribe = function(topic,options){
      var conf = {};
      conf["invocationContext"] = options["invocationContext"] ||  {};
      conf["onSuccess"] = options["onSuccess"] || function(){};//null;
      conf["onFailure"] = options["onFailure"] || function(){};//null;
      conf["timeout"] = options["timeout"] || 60;
      this.client.unsubscribe(topic,conf);
    };

    /**
     * Disconnects from the server.
     * @method ClearBlade.Messaging.prototype.disconnect
     * @example <caption> How to publish </caption>
     * var callback = function (data) {
     *   console.log(data);
     * };
     * var cb = ClearBlade.Messaging({}, callback);
     * cb.disconnect()//why leave so soon :(
     */
    messaging.disconnect = function(){
      this.client.disconnect()
    };

    return messaging;
  };

  /**
   * Sends a push notification
   * @method ClearBlade.sendPush
   * @param {Array} users The list of users to which the message will be sent
   * @param {Object} payload An object with the keys 'alert', 'badge', 'sound'
   * @param {string} appId A string with appId that identifies the app to send to
   * @param {function} callback A function like `function (err, data) {}` to handle the response
   */

  ClearBlade.prototype.sendPush = function (users, payload, appId, callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    if (!Array.isArray(users)) {
      throw new Error('User list must be an array of user IDs');
    }
    var formattedObject = {};
    Object.getOwnPropertyNames(payload).forEach(function(key, element) {
      if (key === "alert" || key === "badge" || key === "sound") {
  if (!formattedObject.hasOwnProperty('aps')) {
    formattedObject.aps = {};
  }
        formattedObject.aps[key] = payload[key];
      }
    });
    var body = {
      cbids: users,
      "apple-message": JSON.stringify(formattedObject),
      appid: appId
    };
    var reqOptions = {
      method: 'POST',
      endpoint: 'api/v/1/push/' + this.systemKey,
      body: body,
      user: this.user,
      URI: this.URI
    };
    ClearBlade.request(reqOptions, callback);
  };

})(window);