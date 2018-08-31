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
  window.console.log = window.console.log || function() {};
}

(function(window, undefined) {
  "use strict";

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

  if (typeof exports != "undefined") {
    // window = exports;
  }

  ClearBlade = $cb = window.$cb = window.ClearBlade =
    window.ClearBlade || function() {};

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
   * <p>{Boolean} [mqttAuth] Setting this to true and providing an email and password will use mqtt websockets to authenticate, rather than http.</p>
   * <p>{String} [messagingAuthPort] is the port that the messaging auth websocket server is listening on.</p>
   *</p>
   */
  ClearBlade.prototype.init = function(options) {
    var _this = this;

    //check for undefined/null then check if they are the correct types for required params
    if (!options || typeof options !== "object")
      throw new Error("Options must be an object or it is undefined");

    if (!options.systemKey || typeof options.systemKey !== "string")
      throw new Error("systemKey must be defined/a string");

    if (!options.systemSecret || typeof options.systemSecret !== "string")
      throw new Error("systemSecret must be defined/a string");

    //check for optional params.
    if (options.logging && typeof options.logging !== "boolean")
      throw new Error("logging must be a true boolean if present");

    if (options.callback && typeof options.callback !== "function") {
      throw new Error("callback must be a function");
    }
    if (options.email && typeof options.email !== "string") {
      throw new Error("email must be a string");
    }
    if (options.password && typeof options.password !== "string") {
      throw new Error("password must be a string");
    }
    if (options.registerUser && typeof options.registerUser !== "boolean") {
      throw new Error("registerUser must be a true boolean if present");
    }

    if (
      options.useUser &&
      (!options.useUser.email || !options.useUser.authToken)
    ) {
      throw new Error(
        "useUser must contain both an email and an authToken " +
          '{"email":email,"authToken":authToken}'
      );
    }

    if (options.email && !options.password) {
      throw new Error("Must provide a password for email");
    }

    if (options.password && !options.email) {
      throw new Error("Must provide a email for password");
    }

    if (options.registerUser && !options.email) {
      throw new Error("Cannot register anonymous user. Must provide an email");
    }

    if (
      options.useUser &&
      (options.email || options.password || options.registerUser)
    ) {
      throw new Error(
        "Cannot authenticate or register a new user when useUser is set"
      );
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
    this._callTimeout = options.callTimeout || 30000; //default to 30 seconds
    /**
     * This property tells us which port to use for websocket mqtt auth.
     * @property messagingAuthPort
     * @type Number
     */
    this.messagingAuthPort = options.messagingAuthPort || 8907;

    this.user = {};

    if (options.useUser) {
      _this.setUser(options.useUser.email, options.useUser.authToken);
    } else if (options.registerUser) {
      this.registerUser(options.email, options.password, function(
        err,
        response
      ) {
        if (err) {
          execute(err, response, options.callback);
        } else {
          _this.loginUser(options.email, options.password, function(err, user) {
            execute(err, user, options.callback);
          });
        }
      });
    } else if (options.email) {
      if (options.mqttAuth) {
        this.loginUserMqtt(options.email, options.password, function(
          err,
          user
        ) {
          execute(err, user, options.callback);
        });
      } else {
        this.loginUser(options.email, options.password, function(err, user) {
          execute(err, user, options.callback);
        });
      }
    } else {
      this.loginAnon(function(err, user) {
        execute(err, user, options.callback);
      });
    }
  };

  var _validateEmailPassword = function(email, password) {
    if (email == null || email == undefined || typeof email != "string") {
      throw new Error("Email must be given and must be a string");
    }
    if (
      password == null ||
      password == undefined ||
      typeof password != "string"
    ) {
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
    this.user.email = email;
    this.user.authToken = authToken;
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
    ClearBlade.request(
      {
        method: "POST",
        endpoint: "api/v/1/user/reg",
        useUser: true,
        user: this.user,
        body: { email: email, password: password },
        authToken: this.user.authToken,
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        timeout: this._callTimeout,
        URI: this.URI
      },
      function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          this.setUser(email, response.user_token);
          execute(false, this.user, callback);
        }
      }.bind(this)
    );
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
    ClearBlade.request(
      {
        method: "POST",
        endpoint: "api/v/1/user/checkauth",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        timeout: this._callTimeout,
        user: this.user,
        URI: this.URI
      },
      function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          execute(false, response.is_authenticated, callback);
        }
      }
    );
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
    ClearBlade.request(
      {
        method: "POST",
        endpoint: "api/v/1/user/logout",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        timeout: this._callTimeout,
        user: this.user,
        URI: this.URI
      },
      function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          execute(false, "User Logged out", callback);
        }
      }
    );
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
    ClearBlade.request(
      {
        method: "POST",
        useUser: false,
        endpoint: "api/v/1/user/anon",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        timeout: this._callTimeout,
        URI: this.URI
      },
      function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          _this.setUser(null, response.user_token);
          execute(false, _this.user, callback);
        }
      }
    );
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
    ClearBlade.request(
      {
        method: "POST",
        useUser: false,
        endpoint: "api/v/1/user/auth",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        URI: this.URI,
        timeout: this._callTimeout,
        body: { email: email, password: password }
      },
      function(err, response) {
        if (err) {
          execute(true, response, callback);
        } else {
          _this.setUser(email, response.user_token);
          execute(false, _this.user, callback);
        }
      }
    );
  };

  /**
   * Method to log user or developer in via MQTT over websockets
   * @method  ClearBlade.loginUserMqtt
   * @param  {String} email
   * @param  {String} password
   * @param  {Function} callback
   * @example
   * cb.loginUserMqtt("foo@bar.baz","secret_password", function(err, body) {
   *    if(err) {
   *        //handle error
   *    } else {
   *        //do post login stuff
   *    }
   * })
   */
  ClearBlade.prototype.loginUserMqtt = function(email, password, callback) {
    var _this = this;
    _validateEmailPassword(email, password);
    var clientid = email + ":" + password;
    var client = new Paho.MQTT.Client(
      _this.messagingURI,
      _this.messagingAuthPort,
      "/mqtt_auth",
      clientid
    );
    var ourTopic = _this.systemKey + "/" + email;
    //helper
    var getString = function(msg) {
      //take two bytes
      if (msg.length < 2) {
        var err = new Error("Bad Return Value from mqtt auth: bad length");
        callback(err, null);
      }
      var b1 = msg[0];
      var b2 = msg[1];
      //get the string length
      var len = b1.charCodeAt(0) + b2.charCodeAt(0);
      if (msg.length < len + 2) {
        var err = new Error(
          "Bad return value from mqtt auth: length longer than substring"
        );
        callback(err, null);
      }
      return msg.substring(0, len);
    };

    var onConnect = function() {
      //subscribe to our topic
      client.subscribe(ourTopic, { qos: 0 });
    };

    var success = false;
    var msgArrived = function(msg) {
      //we only anticipate receiving one message
      if (msg.destinationName != ourTopic) {
        return;
      }
      var body = msg.payloadString;
      var tok = getString(body);
      body = body.substring(tok.length + 2);
      //usrid is unused by the sdk at the momment
      var usrid = getString(body);
      body = body.substring(usrid.length + 2);
      var msgingHost = getString(body);
      _this.setUser(email, tok);
      _this.messagingURI = msgingHost;
      success = true;
      client.disconnect();
      callback(false, _this.user);
    };

    var mqtt_options = {
      useSSL: true,
      cleanSession: true,
      userName: _this.systemKey,
      password: _this.systemSecret,
      onSuccess: onConnect,
      onFailure: function(msg) {
        if (!success) {
          var err = new Error("failed to authenticate: " + JSON.stringify(msg));
          console.log(err);
          callback(err, null);
        }
      }
    };

    client.onConnectionLost = function(msg) {
      if (!success) {
        var err = new Error("connection lost " + JSON.stringify(msg));
        callback(err, null);
      }
    };
    client.onMessageArrived = msgArrived;
    client.connect(mqtt_options);
  };

  var masterCallback = null;

  ClearBlade.prototype.registerMasterCallback = function(callback) {
    if (typeof callback === "function") {
      this.masterCallback = callback;
    } else {
      logger("Did you forget to supply a valid Callback!");
    }
  };
  /*
   * Helper functions
   */

  var execute = function(error, response, callback) {
    if (typeof callback === "function") {
      if (masterCallback !== null) {
        masterCallback(error, response);
      }
      callback(error, response);
    } else {
      logger("Did you forget to supply a valid Callback!");
    }
  };

  var logger = function(message) {
    if (ClearBlade.logging) {
      console.log(message);
    }
    return;
  };

  var isObjectEmpty = function(object) {
    /*jshint forin:false */
    if (typeof object !== "object") {
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
    if (data === undefined) {
      callback(true, "There was some problem. Data is undefined");
    } else {
      var itemArray = [];
      for (var i = 0; i < data.length; i++) {
        itemArray.push(ClearBlade.prototype.Item(data[i], options));
      }
      callback(err, itemArray);
    }
  };

  var _request = function(options, callback) {
    var method = options.method || "GET";
    var endpoint = options.endpoint || "";
    var body = options.body || {};
    var qs = options.qs || "";
    var url = options.URI || "https://platform.clearblade.com";
    var useUser = options.useUser || true;
    var authToken = useUser && options.authToken;
    var callTimeout = options.timeout || 30000;
    if (useUser && !authToken && options.user && options.user.authToken) {
      authToken = options.user.authToken;
    }
    var params = qs;
    if (endpoint) {
      url += "/" + endpoint;
    }

    if (params) {
      url += "?" + params;
    }

    //begin XMLHttpRequest
    var httpRequest;

    if (typeof window.XMLHttpRequest !== "undefined") {
      // Mozilla, Safari, IE 10 ..

      httpRequest = new XMLHttpRequest();

      // if "withCredentials is not in the XMLHttpRequest object CORS is not supported
      // if (!("withCredentials" in httpRequest)) {
      // logger("Sorry it seems that CORS is not supported on your Browser. The RESTful api calls will not work!");
      // httpRequest = null;
      // throw new Error("CORS is not supported!");
      // }
      httpRequest.open(method, url, true);
    } else if (typeof window.XDomainRequest !== "undefined") {
      // IE 8/9
      httpRequest = new XDomainRequest();
      httpRequest.open(method, url);
    } else {
      alert(
        "Sorry it seems that CORS is not supported on your Browser. The RESTful api calls will not work!"
      );
      httpRequest = null;
      throw new Error("CORS is not supported!");
    }

    // Set Credentials; Maybe some encryption later
    if (authToken) {
      httpRequest.setRequestHeader("CLEARBLADE-USERTOKEN", authToken);
      httpRequest.setRequestHeader("ClearBlade-SystemKey", options.systemKey);
      httpRequest.setRequestHeader(
        "ClearBlade-SystemSecret",
        options.systemSecret
      );
    } else {
      httpRequest.setRequestHeader("ClearBlade-SystemKey", options.systemKey);
      httpRequest.setRequestHeader(
        "ClearBlade-SystemSecret",
        options.systemSecret
      );
    }

    if (!isObjectEmpty(body) || params) {
      if (method === "POST" || method === "PUT") {
        // Content-Type is expected for POST and PUT; bad things can happen if you don't specify this.
        httpRequest.setRequestHeader("Content-Type", "application/json");
      }

      httpRequest.setRequestHeader("Accept", "application/json");
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        // Looks like we didn't time out!
        clearTimeout(xhrTimeout);

        //define error for the entire scope of the if statement
        var error = false;
        if (httpRequest.status >= 200 && httpRequest.status < 300) {
          var parsedResponse;
          var response;
          var flag = true;
          // try to parse response, it should be JSON
          if (
            httpRequest.responseText == "[{}]" ||
            httpRequest.responseText == "[]"
          ) {
            error = false;
            execute(error, [], callback);
          } else {
            try {
              response = JSON.parse(httpRequest.responseText);
              parsedResponse = [];
              for (var item in response) {
                if (response[item] instanceof Object) {
                  for (var key in response[item]) {
                    if (response[item][key] instanceof Object) {
                      if (response[item][key]["_key"]) {
                        delete response[item][key]["_key"];
                      }
                      if (response[item][key]["collectionID"]) {
                        delete response[item][key]["collectionID"];
                      }
                      parsedResponse.push(response[item][key]);
                      continue;
                    } else {
                      if (response[item]["_key"]) {
                        delete response[item]["_key"];
                      }
                      if (response[item]["collectionID"]) {
                        delete response[item]["collectionID"];
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
          var msg = httpRequest.responseText;
          // var msg = "Request Failed: Status " + httpRequest.status + " " + (httpRequest.statusText);
          /*jshint expr: true */
          // httpRequest.responseText && (msg += "\nmessage:" + httpRequest.responseText);
          logger(msg);
          error = true;
          execute(error, msg, callback);
        }
      }
    };

    logger("calling: " + method + " " + url);

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

  ClearBlade.request = function(options, callback) {
    if (!options || typeof options !== "object") {
      throw new Error("Request: options is not an object or is empty");
    }

    _request(options, callback);
  };

  var _parseOperationQuery = function(_query) {
    return encodeURIComponent(JSON.stringify(_query.FILTERS || []));
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
    if (typeof options === "string") {
      collection.endpoint = "api/v/1/data/" + options;
      options = { collectionID: options };
    } else if (options.collectionName && options.collectionName !== "") {
      collection.isUsingCollectionName = true;
      collection.name = options.collectionName;
      collection.endpoint =
        "api/v/1/collection/" + this.systemKey + "/" + options.collectionName;
    } else if (options.collectionID && options.collectionID !== "") {
      collection.endpoint = "api/v/1/data/" + options.collectionID;
    } else {
      throw new Error(
        "Must supply a collectionID or collectionName key in options object"
      );
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
    collection.fetch = function(_query, callback) {
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
        query = "query=" + _parseQuery(query);
      } else {
        if (Object.keys(_query) < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
      }

      var reqOptions = {
        method: "GET",
        endpoint: this.endpoint,
        qs: query,
        user: this.user,
        URI: this.URI
      };

      var callCallback = function(err, data) {
        if (err) {
          callback(err, data);
        } else {
          _createItemList(err, data.DATA, options, callback);
        }
      };
      if (typeof callback === "function") {
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
    collection.create = function(newItem, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: this.endpoint,
        body: newItem,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
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
    collection.update = function(_query, changes, callback) {
      var reqOptions = {
        method: "PUT",
        endpoint: this.endpoint,
        body: { query: _query.query.FILTERS, $set: changes },
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
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
    collection.remove = function(_query, callback) {
      var query;
      if (_query === undefined) {
        throw new Error("no query defined!");
      } else {
        query = "query=" + _parseOperationQuery(_query.query);
      }

      var reqOptions = {
        method: "DELETE",
        endpoint: this.endpoint,
        qs: query,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    collection.columns = function(callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "GET",
            URI: this.URI,
            endpoint: this.isUsingCollectionName
              ? "api/v/2/collection/" +
                this.systemKey +
                "/" +
                this.name +
                "/columns"
              : this.endpoint + "/columns",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            user: this.user
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    collection.count = function(_query, callback) {
      if (typeof callback === "function") {
        var query;
        if (_query === undefined || Object.keys(_query).length < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
        ClearBlade.request(
          {
            method: "GET",
            URI: this.URI,
            qs: query,
            endpoint: this.isUsingCollectionName
              ? "api/v/2/collection/" +
                this.systemKey +
                "/" +
                this.name +
                "/count"
              : this.endpoint + "/count",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            user: this.user
          },
          callback
        );
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
  ClearBlade.prototype.Query = function(options) {
    var _this = this;
    var query = {};
    if (!options) {
      options = {};
    }
    if (typeof options === "string") {
      query.endpoint = "api/v/1/data/" + options;
      options = { collectionID: options };
    } else if (options.collectionName && options.collectionName !== "") {
      query.endpoint =
        "api/v/1/collection/" + this.systemKey + "/" + options.collectionName;
    } else if (options.collectionID && options.collectionID !== "") {
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
      if (typeof queryObj.query.SORT === "undefined") {
        queryObj.query.SORT = [];
      }
      var newSort = {};
      newSort[direction] = column;
      queryObj.query.SORT.push(newSort);
    };

    query.addFilterToQuery = function(queryObj, condition, key, value) {
      var newObj = {};
      newObj[key] = value;
      var newFilter = {};
      newFilter[condition] = [newObj];
      if (typeof queryObj.query.FILTERS === "undefined") {
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

    query.ascending = function(field) {
      this.addSortToQuery(this, "ASC", field);
      return this;
    };

    query.descending = function(field) {
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
    query.equalTo = function(field, value) {
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
    query.greaterThan = function(field, value) {
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
    query.greaterThanEqualTo = function(field, value) {
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
    query.lessThan = function(field, value) {
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
    query.lessThanEqualTo = function(field, value) {
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
    query.notEqualTo = function(field, value) {
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
    query.matches = function(field, pattern) {
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
    query.or = function(that) {
      if (
        this.query.hasOwnProperty("FILTERS") &&
        that.query.hasOwnProperty("FILTERS")
      ) {
        for (var i = 0; i < that.query.FILTERS.length; i++) {
          this.query.FILTERS.push(that.query.FILTERS[i]);
        }
        return this;
      } else if (
        !this.query.hasOwnProperty("FILTERS") &&
        that.query.hasOwnProperty("FILTERS")
      ) {
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
    query.setPage = function(pageSize, pageNum) {
      this.query.PAGESIZE = pageSize;
      this.query.PAGENUM = pageNum;
      return this;
    };

    /**
     * Get the field value for a particular column.
     * @method ClearBlade.Query.prototype.getFieldValue
     * @param {string} field Name of column to retrieve the value for
     */
    query.getFieldValue = function(field) {
      var filters = this.query
        .FILTERS; /* [[{"EQ":[{"user_id":"f094b5b10bf6ad86f7f7d4b8b9f201"}]}]] */
      for (var i = 0, len = filters.length; i < len; i++) {
        for (var j = 0, jLen = filters[i].length; j < jLen; j++) {
          for (var key in filters[i][j]) {
            for (var k = 0, kLen = filters[i][j][key].length; k < kLen; k++) {
              if (filters[i][j][key][k][field]) {
                return filters[i][j][key][k];
              }
            }
          }
        }
      }
      return null;
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
    query.fetch = function(callback) {
      var reqOptions = {
        method: "GET",
        qs: "query=" + _parseQuery(this.query),
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };
      var callCallback = function(err, data) {
        if (err) {
          callback(err, data);
        } else {
          _createItemList(err, data.DATA, options, callback);
        }
      };

      if (typeof callback === "function") {
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
    query.update = function(changes, callback) {
      var reqOptions = {
        method: "PUT",
        body: { query: this.query.FILTERS, $set: changes },
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };

      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Gets rows of the specified columns
     * @method ClearBlade.Query.prototype.columns
     * @param {Object} Columns object
     * @param {function} callback Function that handles the response of the server
     * @example <caption>Getting values of columns</caption>
     * //This example assumes a collection of items that have the columns name and age.
     * var query = ClearBlade.Query({'collectionName': 'COLLECTIONNAME'});
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         console.log(data);
     *     }
     * };
     *
     * query.columns(["name","age"]);
     * query.fetch(callback);
     * //gets values in columns name and age
     */
    query.columns = function(columnsArray) {
      this.query.SELECTCOLUMNS = columnsArray;
      return this;
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
    query.remove = function(callback) {
      var reqOptions = {
        method: "DELETE",
        qs: "query=" + _parseQuery(this.query),
        user: this.user,
        endpoint: this.endpoint,
        URI: this.URI
      };

      if (typeof callback === "function") {
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
  ClearBlade.prototype.Item = function(data, options) {
    var item = {};
    if (!(data instanceof Object)) {
      throw new Error("data must be of type Object");
    }
    if (options === undefined || options === null || options === "") {
      throw new Error("Must supply an options parameter");
    }
    if (typeof options === "string") {
      options = { collectionID: options };
    }
    item.data = data;

    item.save = function(callback) {
      //do a put or a post to the database to save the item in the db
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo("item_id", this.data.item_id);
      var callCallback = function(err, data) {
        if (err) {
          callback(err, data);
        } else {
          self.data = data[0];
          callback(err, data);
        }
      };
      query.update(this.data, callCallback);
    };

    item.refresh = function(callback) {
      //do a get to make the local item reflect the database
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo("item_id", this.data.item_id);
      var callCallback = function(err, data) {
        if (err) {
          callback(err, data);
        } else {
          self.data = data[0];
          callback(err, data);
        }
      };
      query.fetch(callCallback);
    };

    item.destroy = function(callback) {
      //deletes the relative record in the DB then deletes the item locally
      var self = this;
      var query = ClearBlade.prototype.Query(options);
      query.equalTo("item_id", this.data.item_id);
      var callCallback = function(err, data) {
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
  ClearBlade.prototype.Code = function() {
    var code = {};
    code.user = this.user;
    code.URI = this.URI;
    code.systemKey = this.systemKey;
    code.systemSecret = this.systemSecret;
    code.callTimeout = this._callTimeout;

    /**
     * Creates a ClearBlade Code Service
     * @method  ClearBlade.Code.prototype.create
     * @param  {String}   name name of the ClearBlade service you wish to create
     * @param  {String}   body represents the function to be stored
     * @param  {Function} callback
     * @example
     * cb.Code().create("ServiceName", "{"code":"function ServiceName (req, resp) { resp.success('hello!')}","parameters":[],"systemID":"<system_key>","name":"ServiceName","dependencies":"clearblade, log","run_user":""}", function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.create = function(name, body, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: "api/v/3/code/" + this.systemKey + "/service/" + name,
        body: body,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Updates a ClearBlade Code Service
     * @method  ClearBlade.Code.prototype.update
     * @param  {String}   name name of the ClearBlade service you wish to update
     * @param  {String}   body represents the function to be stored
     * @param  {Function} callback
     * @example
     * cb.Code().create("ServiceName", "{"code":"function ServiceName (req, resp) { resp.success('hello!!!!')}","parameters":[],"systemID":"<system_key>","name":"ServiceName","dependencies":"clearblade, log","run_user":""}", function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.update = function(name, body, callback) {
      var reqOptions = {
        method: "PUT",
        endpoint: "api/v/3/code/" + this.systemKey + "/service/" + name,
        body: body,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Deletes a ClearBlade Code Service
     * @method  ClearBlade.Code.prototype.delete
     * @param  {String}   name name of the ClearBlade service you wish to delete
     * @param  {Function} callback
     * @example
     * cb.Code().delete("ServiceName", function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.delete = function(name, callback) {
      var reqOptions = {
        method: "DELETE",
        endpoint: "api/v/3/code/" + this.systemKey + "/service/" + name,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

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
    code.execute = function(name, params, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: "api/v/1/code/" + this.systemKey + "/" + name,
        body: params,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Retrieves a list of completed services for a system
     * @method  ClearBlade.Code.prototype.getCompletedServices
     * @param  {Function} callback
     * @example
     * cb.Code().getCompletedServices(function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.getCompletedServices = function(callback) {
      var reqOptions = {
        method: "GET",
        endpoint: "api/v/3/code/" + this.systemKey + "/completed",
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Retrieves a list of failed services for a system
     * @method  ClearBlade.Code.prototype.getFailedServices
     * @param  {Function} callback
     * @example
     * cb.Code().getFailedServices(function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.getFailedServices = function(callback) {
      var reqOptions = {
        method: "GET",
        endpoint: "api/v/3/code/" + this.systemKey + "/failed",
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Retrieves a list of services for a system
     * @method  ClearBlade.Code.prototype.getAllServices
     * @param  {Function} callback
     * @example
     * cb.Code().fetch(function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    code.getAllServices = function(callback) {
      var reqOptions = {
        method: "GET",
        endpoint: "/api/v/3/code/" + this.systemKey,
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    return code;
  };
  /**
   * @class ClearBlade.User
   * @returns {Object} ClearBlade.User the created User object
   */
  ClearBlade.prototype.User = function() {
    var user = {};
    user.user = this.user;
    user.URI = this.URI;
    user.endpoint = "api/v/1/user";
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
    user.getUser = function(callback) {
      var reqOptions = {
        method: "GET",
        endpoint: this.endpoint + "/info",
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
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
    user.setUser = function(data, callback) {
      var reqOptions = {
        method: "PUT",
        endpoint: this.endpoint + "/info",
        systemKey: this.systemKey,
        body: data,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Performs a post on the current users row
     * @method ClearBlade.User.prototype.addUser
     * @param {Object}   data Object containing the data to insert
     * @param {Function} callback
     * @example
     * var newUserInfo = {
     *    "email": "test@test.com",
     *    "password": "thePassword"
     *    "name": "newName",
     *    "age": 76
     * }
     * var user = cb.User();
     * user.addUser(newUserInfo, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    user.addUser = function(data, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: this.endpoint + "/info",
        systemKey: this.systemKey,
        body: data,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Performs a put on the a users row
     * @method ClearBlade.User.prototype.updateUser
     * @param {Object}   data Object containing the data to update
     * @param {Function} callback
     * @example
     * var newUserInfo = {
     *    "name": "newName",
     *    "age": 76
     * }
     * var user = cb.User();
     * user.updateUser(newUserInfo, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    user.updateUser = function(data, callback) {
      var reqOptions = {
        method: "PUT",
        endpoint: "api/v/2/user/info",
        systemKey: this.systemKey,
        body: data,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Performs a delete on the current users row
     * @method ClearBlade.User.prototype.deleteUser
     * @param {Object}   data Object containing the user to delete
     * @param {Function} callback
     * @example
     * var deleteUserInfo = {
     *    "user_id": "theID"
     * }
     * var user = cb.User();
     * user.deleteUser(deleteUserInfo, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    user.deleteUser = function(data, callback) {
      var reqOptions = {
        method: "DELETE",
        endpoint: this.endpoint + "/info",
        systemKey: this.systemKey,
        body: data,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
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
      if (typeof callback === "function") {
        var query;
        if (callback === undefined) {
          callback = _query;
          query = "";
        } else if (Object.keys(_query).length < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
        ClearBlade.request(
          {
            method: "GET",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            endpoint: this.endpoint,
            qs: query,
            user: this.user,
            URI: this.URI
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    user.setPassword = function(oldPass, newPass, callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "PUT",
            endpoint: this.endpoint + "/pass",
            body: { old_password: oldPass, new_password: newPass },
            user: this.user,
            URI: this.URI
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    user.count = function(_query, callback) {
      if (typeof callback === "function") {
        var query;
        if (_query === undefined || Object.keys(_query).length < 1) {
          query = "";
        } else {
          query = "query=" + _parseOperationQuery(_query.query);
        }
        ClearBlade.request(
          {
            method: "GET",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            endpoint: this.endpoint + "/count",
            qs: query,
            user: this.user,
            URI: this.URI
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    user.columns = function(callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "GET",
            URI: this.URI,
            endpoint: this.endpoint + "/columns",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            user: this.user
          },
          callback
        );
      } else {
        logger("No callback was defined!");
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
  ClearBlade.prototype.Messaging = function(options, callback) {
    if (!window.Paho) {
      throw new Error("Please include the mqttws31.js script on the page");
    }
    var _this = this;
    var messaging = {};

    messaging.user = this.user;
    messaging.URI = this.URI;
    messaging.endpoint = "api/v/1/message";
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
    messaging.client = new Paho.MQTT.Client(
      conf.hosts[0],
      conf.ports[0],
      clientID
    ); //new Messaging.Client(conf.hosts[0],conf.ports[0],clientID);

    messaging.client.onConnectionLost = function(response) {
      if (response.errorCode === 8) {
        console.warn("Unable to connect via WebSocket - Invalid permissions");
      } else {
        console.log(
          "ClearBlade Messaging connection lost- attempting to reestablish",
          response
        );
        delete conf.mqttVersionExplicit;
        delete conf.uris;
        messaging.client.connect(conf);
      }
    };

    messaging.client.onMessageArrived = function(message) {
      // messageCallback from Subscribe()
      messaging.messageCallback(message.payloadString, message);
    };
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
    messaging.publish = function(topic, payload) {
      var msg = new Paho.MQTT.Message(payload);
      msg.destinationName = topic;
      msg.qos = this._qos;
      messaging.client.send(msg);
    };

    messaging.publishREST = function(topic, payload, callback) {
      ClearBlade.request(
        {
          method: "POST",
          endpoint: this.endpoint + "/" + this.systemKey + "/publish",
          body: { topic: topic, payload: payload },
          systemKey: this.systemKey,
          systemSecret: this.systemSecret,
          user: this.user,
          URI: this.URI
        },
        callback
      );
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
    messaging.subscribe = function(topic, options, messageCallback) {
      var _this = this;

      var onSuccess = function() {
        var conf = {};
        conf["qos"] = this._qos || 0;
        conf["invocationContext"] = options["invocationContext"] || {};
        conf["onSuccess"] = options["onSuccess"] || null;
        conf["onFailure"] = options["onFailure"] || null;
        conf["timeout"] = options["timeout"] || 60;
        _this.client.subscribe(topic, conf);
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
    messaging.unsubscribe = function(topic, options) {
      var conf = {};
      conf["invocationContext"] = options["invocationContext"] || {};
      conf["onSuccess"] = options["onSuccess"] || function() {}; //null;
      conf["onFailure"] = options["onFailure"] || function() {}; //null;
      conf["timeout"] = options["timeout"] || 60;
      this.client.unsubscribe(topic, conf);
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
    messaging.disconnect = function() {
      this.client.disconnect();
    };

    return messaging;
  };

  /**
   * @class ClearBlade.MessagingStats
   * @returns {Object} ClearBlade.MessagingStats the created MessagingStats object
   */
  ClearBlade.prototype.MessagingStats = function() {
    var _this = this;
    var messagingStats = {};

    messagingStats.user = this.user;
    messagingStats.URI = this.URI;
    messagingStats.endpoint = "api/v/3/message";
    messagingStats.endpointV1 = "api/v/1/message";
    messagingStats.systemKey = this.systemKey;
    messagingStats.callTimeout = this._callTimeout;

    /**
     * Gets the message history from a ClearBlade Messaging topic.
     * @method ClearBlade.MessagingStats.getMessageHistoryWithTimeFrame
     * @param {string} topic The topic from which to retrieve history
     * @param {number} last Epoch timestamp in seconds that will retrieve 'count' number of messages before that timestamp. Set to -1 if not used
     * @param {number} count Number that signifies how many messages to return; 0 returns all messages
     * @param {number} start Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe. Set to -1 if not used
     * @param {number} stop Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe. Set to -1 if not used
     * @param {function} callback The function to be called upon execution of query -- called with a boolean error and the response
     */
    messagingStats.getMessageHistoryWithTimeFrame = function(
      topic,
      count,
      last,
      start,
      stop,
      callback
    ) {
      var reqOptions = {
        method: "GET",
        endpoint: this.endpointV1 + "/" + this.systemKey,
        qs:
          "topic=" +
          topic +
          "&count=" +
          count +
          "&last=" +
          last +
          "&start=" +
          start +
          "&stop=" +
          stop,
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

    /**
     * Gets the message history from a ClearBlade Messaging topic.
     * @method ClearBlade.MessagingStats.getMessageHistory
     * @param {string} topic The topic from which to retrieve history
     * @param {number} last Epoch timestamp in seconds that will retrieve 'count' number of messages before that timestamp. Set to -1 if not used
     * @param {number} count Number that signifies how many messages to return; 0 returns all messages
     * @param {function} callback The function to be called upon execution of query -- called with a boolean error and the response
     */
    messagingStats.getMessageHistory = function(topic, last, count, callback) {
      messagingStats.getMessageHistoryWithTimeFrame(
        topic,
        count,
        last,
        -1,
        -1,
        callback
      );
    };

    /**
     * Gets the message history from a ClearBlade Messaging topic.
     * @method ClearBlade.MessagingStats.getAndDeleteMessageHistory
     * @param {string} topic The topic from which to retrieve history
     * @param {number} last Epoch timestamp in seconds that will retrieve and delete 'count' number of messages before that timestamp. Set to -1 if not used
     * @param {number} count Number that signifies how many messages to return and delete; 0 returns and deletes all messages
     * @param {number} start Epoch timestamp in seconds that will retrieve and delete 'count' number of messages within timeframe. Set to -1 if not used
     * @param {number} stop Epoch timestamp in seconds that will retrieve and delete 'count' number of  messages within timeframe. Set to -1 if not used
     * @param {function} callback The function to be called upon execution of query -- called with a boolean error and the response
     */
    messagingStats.getAndDeleteMessageHistory = function(
      topic,
      count,
      last,
      start,
      stop,
      callback
    ) {
      var reqOptions = {
        method: "DELETE",
        endpoint: this.endpointV1 + "/" + this.systemKey,
        qs:
          "topic=" +
          topic +
          "&count=" +
          count +
          "&last=" +
          last +
          "&start=" +
          start +
          "&stop=" +
          stop,
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

    /**
     * Gets the list of all available topics
     * @method ClearBlade.MessagingStats.currentTopics
     * @param {function} callback The function to be called upon execution of query -- called with a boolean error and the response
     */
    messagingStats.currentTopics = function(callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "GET",
            endpoint: this.endpointV1 + "/" + this.systemKey + "/currentTopics",
            user: this.user,
            URI: this.URI
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.MessagingStats.prototype.getAveragePayloadSize
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getAveragePayloadSize("mytopic", 1490819666, 1490819676, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     * //returns {"payloadsize":28}
     */
    messagingStats.getAveragePayloadSize = function(
      topic,
      start,
      stop,
      callback
    ) {
      var reqOptions = {
        method: "GET",
        endpoint: this.endpoint + "/" + this.systemKey + "/averagePayload",
        qs: "topic=" + topic + "&start=" + start + "&stop=" + stop,
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the number of MQTT connections for a system
     * @method ClearBlade.MessagingStats.prototype.getOpenConnections
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getOpenConnections(function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     * //returns {"connections":42}
     */
    messagingStats.getOpenConnections = function(callback) {
      var reqOptions = {
        method: "GET",
        endpoint: this.endpoint + "/" + this.systemKey + "/connections",
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the number of subscribers for a topic
     * @method ClearBlade.MessagingStats.prototype.getCurrentSubscribers
     * @param  {string} topic Topic to retrieve the current subscribers for
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getCurrentSubscribers("mytopic", function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     * //returns {"subscribers": 42}
     */
    messagingStats.getCurrentSubscribers = function(topic, callback) {
      var reqOptions = {
        method: "GET",
        endpoint:
          this.endpoint + "/" + this.systemKey + "/subscribers/" + topic,
        user: this.user,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    return messagingStats;
  };

  /**
   * Sends a push notification
   * @method ClearBlade.sendPush
   * @param {Array} users The list of users to which the message will be sent
   * @param {Object} payload An object with the keys 'alert', 'badge', 'sound'
   * @param {string} appId A string with appId that identifies the app to send to
   * @param {function} callback A function like `function (err, data) {}` to handle the response
   */

  ClearBlade.prototype.sendPush = function(users, payload, appId, callback) {
    if (!callback || typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    if (!Array.isArray(users)) {
      throw new Error("User list must be an array of user IDs");
    }
    var formattedObject = {};
    Object.getOwnPropertyNames(payload).forEach(function(key, element) {
      if (key === "alert" || key === "badge" || key === "sound") {
        if (!formattedObject.hasOwnProperty("aps")) {
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
      method: "POST",
      endpoint: "api/v/1/push/" + this.systemKey,
      body: body,
      user: this.user,
      URI: this.URI
    };
    ClearBlade.request(reqOptions, callback);
  };

  /**
   * Gets an array of Edges on the system.
   * @method ClearBlade.getEdges
   * @param {function} callback A function like `function (err, data) {}` to handle the response
   */
  ClearBlade.prototype.getEdges = function(_query, callback) {
    var query;
    if (callback === undefined) {
      callback = _query;
      query = {
        FILTERS: []
      };
      query = "query=" + _parseQuery(query);
    } else {
      if (Object.keys(_query) < 1) {
        query = "";
      } else {
        query = "query=" + _parseQuery(_query.query);
      }
    }
    var reqOptions = {
      method: "GET",
      user: this.user,
      endpoint: "api/v/2/edges/" + this.systemKey,
      qs: query,
      URI: this.URI
    };
    if (typeof callback === "function") {
      ClearBlade.request(reqOptions, callback);
    } else {
      logger("No callback was defined!");
    }
  };

  ClearBlade.prototype.Edge = function() {
    var edge = {};
    edge.user = this.user;
    edge.URI = this.URI;
    edge.systemKey = this.systemKey;
    edge.systemSecret = this.systemSecret;

    /**
     * Updates data for an edge
     * @method ClearBlade.Edge.prototype.updateEdgeByName
     * @param {String} name Specifies which edge to update
     * @param {Object} object Supplies the data to update
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @return {Object} An object containing updated edge's data
     * @example <caption>Updating edge data</caption>
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     }
     * };
     *
     * edge.updateEdgeByName(name, object, callback);
     */
    edge.updateEdgeByName = function(name, object, callback) {
      if (typeof object != "object") {
        throw new Error("Invalid object format");
      }
      if (typeof name === "object") {
        name = name.query.FILTERS[0][0].EQ[0].edge_key.split(":")[1];
      }
      var reqOptions = {
        method: "PUT",
        user: this.user,
        endpoint: "api/v/3/edges/" + this.systemKey + "/" + name,
        URI: this.URI
      };
      reqOptions["body"] = object;
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Deletes edge or edges
     * @method ClearBlade.Edge.prototype.deleteEdgeByName
     * @param {String} name Specifies name of which edge to delete or query object containing edge or edges to delete
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @example <caption>Deleting edge data</caption>
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     }
     * };
     *
     * edge.deleteEdgeByName(name, callback);
     */
    edge.deleteEdgeByName = function(name, callback) {
      if (typeof name === "object") {
        var edges = name.query.FILTERS;
        for (var i = 0; i < edges.length; i++) {
          var edgeName = edges[i][0].EQ[0].edge_key.split(":")[1];
          var reqOptions = {
            method: "DELETE",
            user: this.user,
            endpoint: "api/v/3/edges/" + this.systemKey + "/" + edgeName,
            URI: this.URI
          };
          ClearBlade.request(reqOptions, callback);
        }
      } else {
        var reqOptions = {
          method: "DELETE",
          user: this.user,
          endpoint: "api/v/3/edges/" + this.systemKey + "/" + name,
          URI: this.URI
        };
        ClearBlade.request(reqOptions, callback);
      }
    };

    /**
     * Creates a new edge and returns the created item to the callback
     * @method ClearBlade.Edge.prototype.create
     * @param {Object} newItem An object that represents the new edge, requiring the fields below.
     * @param {function} callback Supplies processing for what to do with the data that is returned from the edge list
     * @example <caption>Creating a new edge</caption>
     * var newEdge = {
           token: '',
           system_key: '',
           system_secret: '',
     * };
     * var name = 'newName';
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         console.log(data);
     *     }
     * };
     * edge.create(newEdge, name, callback);
     * //this inserts the the newEdge into the edge list
     *
     */
    edge.create = function(newEdge, name, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: "api/v/3/edges/" + this.systemKey + "/" + name,
        body: newEdge,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    edge.columns = function(callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "GET",
            URI: this.URI,
            endpoint: "api/v/3/edges/" + this.systemKey + "/columns",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            user: this.user
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    edge.count = function(_query, callback) {
      var query;
      if (callback === undefined) {
        callback = _query;
        query = {
          FILTERS: []
        };
        query = "query=" + _parseQuery(query);
      } else {
        if (Object.keys(_query) < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
      }
      var reqOptions = {
        method: "GET",
        URI: this.URI,
        qs: query,
        endpoint: "api/v/3/edges/" + this.systemKey + "/count",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        user: this.user
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };
    return edge;
  };

  ClearBlade.prototype.Metrics = function() {
    var metrics = {};
    metrics.systemKey = this.systemKey;
    metrics.URI = this.URI;
    metrics.user = this.user;

    metrics.setQuery = function(_query) {
      metrics.query = _query.query;
    };

    metrics.getStatistics = function(callback) {
      if (!callback || typeof callback !== "function") {
        throw new Error("Callback must be a function");
      }
      var endpoint = "api/v/3/platform/statistics/" + this.systemKey;
      var query = "query=" + _parseQuery(this.query);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: endpoint,
        URI: this.URI,
        qs: query
      };
      ClearBlade.request(reqOptions, callback);
    };

    metrics.getStatisticsHistory = function(callback) {
      if (!callback || typeof callback !== "function") {
        throw new Error("Callback must be a function");
      }
      var endpoint =
        "api/v/3/platform/statistics/" + this.systemKey + "/history";
      var query = "query=" + _parseQuery(this.query);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: endpoint,
        URI: this.URI,
        qs: query
      };
      ClearBlade.request(reqOptions, callback);
    };

    metrics.getDBConnections = function(callback) {
      if (!callback || typeof callback !== "function") {
        throw new Error("Callback must be a function");
      }
      var endpoint = "api/v/3/platform/dbconnections/" + this.systemKey;
      var query = "query=" + _parseQuery(this.query);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: endpoint,
        URI: this.URI
      };
      if (this.query) {
        reqOptions.qs = query;
      }
      ClearBlade.request(reqOptions, callback);
    };

    metrics.getLogs = function(callback) {
      if (!callback || typeof callback !== "function") {
        throw new Error("Callback must be a function");
      }
      var endpoint = "api/v/3/platform/logs/" + this.systemKey;
      var query = "query=" + _parseQuery(this.query);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: endpoint,
        URI: this.URI,
        qs: query
      };
      ClearBlade.request(reqOptions, callback);
    };

    return metrics;
  };

  /**
   * Creates a representation of devices
   * @class ClearBlade.Device
   * @classdesc It does not actually make a connection upon instantiation, but has all the methods necessary to do so.
   * @example
   * var device = cb.Device();
   */
  ClearBlade.prototype.Device = function() {
    var device = {};

    device.user = this.user;
    device.URI = this.URI;
    device.systemKey = this.systemKey;
    device.systemSecret = this.systemSecret;

    /**
     * Requests the named device
     * @method ClearBlade.Device.prototype.getDeviceByName
     * @param {String} name Used to indicate which device to get
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @return {Object} An object containing device's data
     * @example <caption>Fetching data from device</caption>
     * var returnedData = {};
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         returnedData = data;
     *     }
     * };
     *
     * device.updateDeviceByName(name, callback);
     * //this will give returnedData the value of what ever was returned from the server.
     */
    device.getDeviceByName = function(name, callback) {
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey + "/" + name,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Updates data for a device
     * @method ClearBlade.Device.prototype.updateDeviceByName
     * @param {String} name Specifies which device to update
     * @param {Object} object Supplies the data to update
     * @param {Boolean} trigger Indicates whether or not should cause a trigger
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @return {Object} An object containing updated device's data
     * @example <caption>Updating device data</caption>
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     }
     * };
     *
     * device.updateDevice(name, object, trigger, callback);
     */
    device.updateDeviceByName = function(name, object, trigger, callback) {
      if (typeof object != "object") {
        throw new Error("Invalid object format");
      }
      object["causeTrigger"] = trigger;
      var reqOptions = {
        method: "PUT",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey + "/" + name,
        URI: this.URI
      };
      reqOptions["body"] = object;
      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Deletes the named device
     * @method ClearBlade.Device.prototype.deleteDeviceByName
     * @param {String} name Used to indicate which device to remove
     * @param {function} callback Handles response from the server
     * @example <caption>Removing device</caption>
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         returnedData = data;
     *     }
     * };
     *
     * device.deleteDeviceByName(name, callback);
     * //this will remove the indicated device.
     */
    device.deleteDeviceByName = function(name, callback) {
      var reqOptions = {
        method: "DELETE",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey + "/" + name,
        URI: this.URI
      };

      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Requests a list of all devices, unless query specifies item or a set of items.
     * @method ClearBlade.Device.prototype.fetch
     * @param {Query} _query Used to request a specific item or subset of items from the devices on the server. Optional.
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @return {Object} An array of objects
     * @example <caption>Fetching data from devices</caption>
     * var returnedData = [];
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         returnedData = data;
     *     }
     * };
     *
     * device.fetch(query, callback);
     * //this will give returnedData the value of what ever was returned from the server.
     */
    device.fetch = function(_query, callback) {
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
        query = "query=" + _parseQuery(query);
      } else {
        if (Object.keys(_query) < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
      }

      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey,
        qs: query,
        URI: this.URI
      };

      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Updates all devices, unless query specifies item or a set of items to update.
     * @method ClearBlade.Device.prototype.update
     * @param {Query} _query Used to request a specific item or subset of items from the devices on the server. Optional.
     * @param {Object} object Supplies the data to update
     * @param {Boolean} trigger Indicates whether or not should cause a trigger
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @return {Object} An object containing updated devices' data
     * @example <caption>Updating devices' data</caption>
     * var query = ClearBlade.query();
     * query.equalTo('state', 'TX')
     * var changes = {
     *   state: 'CA'
     * }
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     }
     * };
     * device.update(query, changes, true, callback);
     */
    device.update = function(_query, object, trigger, callback) {
      var filters = _query ? _query.query.FILTERS : [];

      var reqOptions = {
        method: "PUT",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey,
        URI: this.URI
      };
      reqOptions["causeTrigger"] = trigger;
      reqOptions["body"] = { query: filters, $set: object };

      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Deletes device or a set of devices indicated by query.
     * @method ClearBlade.Device.prototype.delete
     * @param {Query} _query Used to request a specific item or subset of items from the devices on the server. Required.
     * @param {function} callback Supplies processing for what to do with the data that is returned from the devices
     * @example <caption>Removing devices from devices</caption>
     * var query = ClearBlade.Query();
     * query.equalTo('state', 'TX');
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         console.log(data);
     *     }
     * };
     *
     * device.delete(query, callback);
     * //removes every device whose 'state' attribute is equal to 'TX'
     */
    device.delete = function(_query, callback) {
      var query;
      if (_query === undefined) {
        throw new Error("no query defined!");
      } else {
        query = "query=" + _parseOperationQuery(_query.query);
      }

      var reqOptions = {
        method: "DELETE",
        user: this.user,
        endpoint: "api/v/2/devices/" + this.systemKey,
        qs: query,
        URI: this.URI
      };

      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    /**
     * Creates a new device and returns the created item to the callback
     * @method ClearBlade.Device.prototype.create
     * @param {Object} newItem An object that represents the new device, requiring the fields below.
     * @param {function} callback Supplies processing for what to do with the data that is returned from the device list
     * @example <caption>Creating a new device</caption>
     * var newDevice = {
     *     active_key: "deviceKey",
     *     allow_certificate_auth: true,
     *     allow_key_auth: true,
     *     certificate: '',
     *     description: '',
     *     enabled: true,
     *     keys: '',
     *     name: 'newDevice",
     *     state: 'TX',
     *     type: '',
     * };
     * var callback = function (err, data) {
     *     if (err) {
     *         throw new Error (data);
     *     } else {
     *         console.log(data);
     *     }
     * };
     * device.create(newDevice, callback);
     * //this inserts the the newDevice into the device list
     *
     */
    device.create = function(newDevice, callback) {
      var reqOptions = {
        method: "POST",
        endpoint: "api/v/2/devices/" + this.systemKey + "/" + newDevice.name,
        body: newDevice,
        user: this.user,
        URI: this.URI
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    device.columns = function(callback) {
      if (typeof callback === "function") {
        ClearBlade.request(
          {
            method: "GET",
            URI: this.URI,
            endpoint: "api/v/3/devices/" + this.systemKey + "/columns",
            systemKey: this.systemKey,
            systemSecret: this.systemSecret,
            user: this.user
          },
          callback
        );
      } else {
        logger("No callback was defined!");
      }
    };

    device.count = function(_query, callback) {
      var query;
      if (callback === undefined) {
        callback = _query;
        query = {
          FILTERS: []
        };
        query = "query=" + _parseQuery(query);
      } else {
        if (Object.keys(_query) < 1) {
          query = "";
        } else {
          query = "query=" + _parseQuery(_query.query);
        }
      }

      var reqOptions = {
        method: "GET",
        URI: this.URI,
        qs: query,
        endpoint: "api/v/3/devices/" + this.systemKey + "/count",
        systemKey: this.systemKey,
        systemSecret: this.systemSecret,
        user: this.user
      };
      if (typeof callback === "function") {
        ClearBlade.request(reqOptions, callback);
      } else {
        logger("No callback was defined!");
      }
    };

    return device;
  };

  /**
   * @class ClearBlade.Analytics
   * @returns {Object} ClearBlade.Analytics the created Analytics object
   */
  ClearBlade.prototype.Analytics = function() {
    var analytics = {};
    analytics.user = this.user;
    analytics.URI = this.URI;
    analytics.systemKey = this.systemKey;
    analytics.systemSecret = this.systemSecret;

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.Analytics.prototype.getStorage
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getStorage(filter, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    analytics.getStorage = function(filter, callback) {
      var query = "query=" + JSON.stringify(filter);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/analytics/storage",
        qs: query,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.Analytics.prototype.getCount
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getCount(filter, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    analytics.getCount = function(filter, callback) {
      var query = "query=" + JSON.stringify(filter);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/analytics/count",
        qs: query,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.Analytics.prototype.getEventList
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getEventList(filter, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    analytics.getEventList = function(filter, callback) {
      var query = "query=" + JSON.stringify(filter);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/analytics/eventlist",
        qs: query,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.Analytics.prototype.getEventTotals
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getEventTotals(filter, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    analytics.getEventTotals = function(filter, callback) {
      var query = "query=" + JSON.stringify(filter);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/analytics/eventtotals",
        qs: query,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Method to retrieve the average payload size for a topic
     * @method ClearBlade.Analytics.prototype.getUserEvents
     * @param  {string} topic Topic to retrieve the average payload size for
     * @param  {int}  start Point in time in which to begin the query (epoch timestamp)
     * @param  {int}  stop Point in time in which to end the query (epoch timestamp)
     * @param  {Function} callback
     * @example
     * cb.MessagingStats().getUserEvents(filter, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * });
     */
    analytics.getUserEvents = function(filter, callback) {
      var query = "query=" + JSON.stringify(filter);
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/analytics/userevents",
        qs: query,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    return analytics;
  };

  ClearBlade.prototype.Portal = function(name) {
    var portal = {};

    if (!name) {
      throw new Error("Must supply a name for portal");
    }

    portal.name = name;
    portal.user = this.user;
    portal.URI = this.URI;
    portal.systemKey = this.systemKey;
    portal.systemSecret = this.systemSecret;

    portal.fetch = function(callback) {
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "api/v/2/portals/" + this.systemKey + "/" + this.name,
        URI: this.URI
      };
      ClearBlade.request(reqOptions, callback);
    };

    portal.update = function(data, callback) {
      if (typeof data != "object") {
        throw new Error("Invalid object format");
      }
      var reqOptions = {
        method: "PUT",
        user: this.user,
        endpoint: "api/v/2/portals/" + this.systemKey + "/" + this.name,
        URI: this.URI
      };

      reqOptions["body"] = data;
      ClearBlade.request(reqOptions, callback);
    };

    return portal;
  };

  ClearBlade.prototype.Triggers = function() {
    var triggers = {};

    triggers.user = this.user;
    triggers.URI = this.URI;
    triggers.systemKey = this.systemKey;
    triggers.systemSecret = this.systemSecret;

    triggers.fetchDefinitions = function(callback) {
      var reqOptions = {
        method: "GET",
        user: this.user,
        endpoint: "admin/triggers/definitions",
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Creates a ClearBlade Trigger
     * @method  ClearBlade.Triggers.prototype.create
     * @param  {String}   name name of the ClearBlade trigger you wish to create
     * @param  {Object}   def object that represents the trigger definition
     * @param  {Function} callback
     * @example
     * var newTrigger = {
     *   system_key: "<system_key>",
     *   name: "myTrigger",
     *   def_module: "Messaging",
     *   def_name: "Subscribe",
     *   service_name: "<myServiceName>",
     *   key_value_pairs: {"topic":"mytopic"}
     * }
     * cb.Triggers().create("myTrigger", newTrigger, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    triggers.create = function(name, def, callback) {
      var reqOptions = {
        method: "POST",
        user: this.user,
        body: def,
        endpoint: "api/v/3/code/" + this.systemKey + "/trigger/" + name,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Updates a ClearBlade Trigger
     * @method  ClearBlade.Triggers.prototype.update
     * @param  {String}   name name of the ClearBlade trigger you wish to update
     * @param  {Object}   def object that represents the trigger definition
     * @param  {Function} callback
     * @example
     * var triggerUpdate = {
     *   system_key: "<system_key>",
     *   name: "myTrigger",
     *   def_module: "Messaging",
     *   def_name: "Publish",
     *   service_name: "<myServiceName>",
     *   key_value_pairs: {"topic":"mytopic"}
     * }
     * cb.Triggers().update("myTrigger", triggerUpdate, function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    triggers.update = function(name, def, callback) {
      var reqOptions = {
        method: "PUT",
        user: this.user,
        body: def,
        endpoint: "api/v/3/code/" + this.systemKey + "/trigger/" + name,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    /**
     * Deletes a ClearBlade Trigger
     * @method  ClearBlade.Triggers.prototype.delete
     * @param  {String}   name name of the ClearBlade trigger you wish to delete
     * @param  {Object}   def object that represents the trigger definition
     * @param  {Function} callback
     * @example
     * cb.Triggers().delete("myTrigger", function(err, body) {
     *    if(err) {
     *        //handle error
     *    } else {
     *        console.log(body);
     *    }
     * })
     */
    triggers.delete = function(name, callback) {
      var reqOptions = {
        method: "DELETE",
        user: this.user,
        endpoint: "api/v/3/code/" + this.systemKey + "/trigger/" + name,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    return triggers;
  };

  ClearBlade.prototype.Roles = function() {
    var roles = {};

    roles.user = this.user;
    roles.URI = this.URI;
    roles.systemKey = this.systemKey;
    roles.systemSecret = this.systemSecret;

    roles.update = function(id, changes, callback) {
      var reqOptions = {
        method: "PUT",
        user: this.user,
        body: {
          id: id,
          changes: changes
        },
        endpoint: "api/v/3/user/roles/" + this.systemKey,
        URI: this.URI
      };

      ClearBlade.request(reqOptions, callback);
    };

    return roles;
  };

  /**
   * Retrieves a list of collections for a system
   * @method  ClearBlade.Collection.prototype.getAllCollections
   * @param  {Function} callback
   * @example
   * cb.getAllCollections(function(err, body) {
   *    if(err) {
   *        //handle error
   *    } else {
   *        console.log(body);
   *    }
   * })
   */
  ClearBlade.prototype.getAllCollections = function(callback) {
    var reqOptions = {
      method: "GET",
      endpoint: "api/v/3/allcollections/" + this.systemKey,
      user: this.user,
      URI: this.URI
    };
    ClearBlade.request(reqOptions, callback);
  };
})(window);
