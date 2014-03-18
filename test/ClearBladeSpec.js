/**
 * This is the Jasmine testing file for the ClearBlade javascript API
 *
 * The credentials to log into the platform and change the collections that this test suite uses:
 *
 * username: test@fake.com
 * password: testPass
 */

var TEST_TIMEOUT = 30000;
var RTP_INFO = {
  serverAddress: "https://rtp.clearblade.com",
  messagingURI: "rtp.clearblade.com",
  messagingPort: 8904,
  appKey: "c899bfae0afca9b1c899c2fe841d",
  appSecret: "C899BFAE0ACAE5A3C2A086ECDCF801",
  safariCollection: "aaaabfae0ad0da86f2dde3bba761",
  chromeCollection: "949abfae0aae8aaeffb09f80f8c101",
  generalCollection: "b69abfae0ad28bceb1dba4eecb19",
  firefoxCollection: "a49abfae0ac8e987e699def0e4e301"
};
var PLATFORM_INFO = {
  serverAddress: "https://platform.clearblade.com",
  messagingURI: "platform.clearblade.com",
  appKey: 'f2f5f8aa0aba8bc7e4bdcd8ef142',
  appSecret: 'F2F5F8AA0AB4F2C4A4E1C387F3F801',
  noAuthAppKey: "b48abbb10af2f9bfffd9f793dc9a01",
  noAuthAppSecret: "B48ABBB10AE8EB9AD7D1B3B7FC62",
  safariCollection: "82f7f8aa0ab8929ab1c3cad7e534",
  chromeCollection:"84f6f8aa0abcf9fbb6ae97a6c9da01",
  firefoxCollection:"d8f6f8aa0ababdbbc5b8fdf49356",
  generalCollection:'90f6f8aa0a86969ced80c0a8b03e',
  firefoxNoAuthCollection: "f28fbbb10a8ca5a5f2f5acd297cc01",
  safariNoAuthCollection: "a690bbb10abadbb387efdcc0b09e01",
  generalNoAuthCollection: "ba90bbb10aba93f7bde8cbd2cfe201",
  chromeNoAuthCollection: "e08fbbb10ae0efadd4e2f68cf39701"
};
var TargetPlatform = PLATFORM_INFO;

describe("ClearBlade API", function () {
  it("should return the correct API version", function () {
    var APIversion = ClearBlade.getApiVersion();
    expect(APIversion).toEqual('0.0.2');
  });
});

describe("ClearBlade initialization should", function () {
  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  it("have the appKey stored", function () {
    expect(ClearBlade.appKey).toEqual(TargetPlatform.noAuthAppKey);
  });

  it("have the appSecret stored", function () {
    expect(ClearBlade.appSecret).toEqual(TargetPlatform.noAuthAppSecret);
  });

  // it("have defaulted the URI to the Platform", function () {
  //   expect(ClearBlade.URI).toEqual('');
  // });

  it("have defaulted the logging to false", function () {
    expect(ClearBlade.logging).toEqual(false);
  });

  it("have defaulted the masterSecret to null", function () {
    expect(ClearBlade.masterSecret).toEqual(null);
  });

  it("have defaulted the callTimeout to 30000", function () {
    expect(ClearBlade._callTimeout).toEqual(30000);
  });
});

describe("ClearBlade users should", function () {
  var initOptions;
  beforeEach(function () {
    initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
    };
  });

  it("have anonymous user authenticated with email and password", function () {
    var authenticated = false;
    initOptions.email = "test_" + Math.floor(Math.random() * 10000) + "@test.com";
    initOptions.password = "password";
    initOptions.registerUser = true;
    initOptions.callback = function(err, response) {
      expect(ClearBlade.user).toBeDefined();
      expect(ClearBlade.user.email).toEqual(initOptions.email);
      expect(ClearBlade.user.authToken).toBeDefined();
      ClearBlade.isCurrentUserAuthenticated(function(err, isAuthenticated) {
        expect(err).toEqual(false);
        expect(isAuthenticated).toEqual(true);
        ClearBlade.logoutUser(function(err, response) {
          expect(err).toEqual(false);
          ClearBlade.isCurrentUserAuthenticated(function(err, isAuthenticated) {
            expect(err).toEqual(false);
            expect(isAuthenticated).toEqual(false);
            authenticated = true;
          });
        });
      });
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return authenticated;
    }, "user should be defined", TEST_TIMEOUT);
  });
});

describe("ClearBlade anonymous users", function () {
  var initOptions;
  beforeEach(function () {
    initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
    };
  });

  it("should have anonymous user authenticated when no options given", function () {
    var authenticated = false;
    initOptions.callback = function() {
      authenticated = true;
      expect(ClearBlade.user).toBeDefined();
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return authenticated;
    }, "user should be defined", TEST_TIMEOUT);
  });
});

describe("ClearBlade collection fetching with users", function () {
  it("should be able to fetch data as an authenticated user", function () {
    var flag, returnedData, isAaronCreated;
    var isClearBladeInit = false;
    var initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      email: "test_" + Math.floor(Math.random() * 10000) + "@test.com",
      password: "password",
      registerUser: true,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
        col = new ClearBlade.Collection(TargetPlatform.generalCollection);
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);

    runs(function () {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron"
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
    });

    waitsFor(function () {
      return isAaronCreated;
    }, "aaron should be created", TEST_TIMEOUT);

    runs(function () {
      flag = false;
      var callback = function (err, data) {
        flag = true;
        if (err) {
        } else {
          returnedData = data;
        }
      };
      col.fetch(callback);
    });

    waitsFor(function () {
      return flag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('aaron');
    });
  });
});

describe("ClearBlade Query fetching with anonymous user", function() {
  var col;
  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
        col = new ClearBlade.Collection(TargetPlatform.generalNoAuthCollection);
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  // Make sure it exists by creating it.
  it("should return existing data", function() {
    var flag, returnedData, isAaronCreated;
    runs(function () {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron"
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
    });

    waitsFor(function() {
      return isAaronCreated;
    }, "aaron should be created", TEST_TIMEOUT);

    var queryDone;
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      query.collection = col.ID;
      query.execute('GET', function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData[0].name).toEqual('aaron');
    });
  });

  it("should allow multiple query parts", function() {
    var flag, returnedData, isAaronCreated;
    runs(function () {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron",
          age: 25
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
    });

    waitsFor(function() {
      return isAaronCreated;
    }, "aaron should be created", TEST_TIMEOUT);

    var queryDone, queryDone2;
    // Negative case -- should return nothing
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron').equalTo('age', 30);
      query.collection = col.ID;
      query.execute('GET', function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData).toEqual([]);
    });

    // Positive case -- should return an item
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron').equalTo('age', 25);
      query.collection = col.ID;
      query.execute('GET', function(error, data) {
        expect(error).toBeFalsy();
        queryDone2 = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone2;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData[0].name).toEqual('aaron');
    });
  });

  it("should allow or-based queries", function() {
    var flag, returnedData, isAaronCreated, isCharlieCreated;
    runs(function () {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron"
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
      var query2 = new ClearBlade.Query();
      query2.equalTo('name', 'charlie');
      col.remove(query2, function() {
        col.create({
          name: "charlie"
        }, function(err, response) {
          expect(err).toEqual(false);
          isCharlieCreated = true;
        });
      });
    });

    waitsFor(function() {
      return isAaronCreated;
    }, "aaron should be created", TEST_TIMEOUT);

    waitsFor(function() {
      return isCharlieCreated;
    }, "charlie should be created", TEST_TIMEOUT);

    var queryDone;
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      var orQuery = new ClearBlade.Query();
      orQuery.equalTo('name', 'charlie');
      query.or(orQuery);
      query.collection = col.ID;
      query.execute('GET', function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    // Cleanup
    var isCharlieDeleted;
    runs(function() {
      expect(returnedData.length).toEqual(2);
      var query2 = new ClearBlade.Query();
      query2.equalTo('name', 'charlie');
      col.remove(query2, function() {
        col.create({
          name: "charlie"
        }, function(err, response) {
          expect(err).toEqual(false);
          isCharlieDeleted = true;
        });
      });
    });

    waitsFor(function() {
      return isCharlieDeleted;
    }, "charlie should be deleted", TEST_TIMEOUT);
  });
});

describe("ClearBlade collections fetching", function () {
  var col;
  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
        col = new ClearBlade.Collection(TargetPlatform.generalNoAuthCollection);
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  it("should have the collectionID stored", function () {
    expect(col.ID).toEqual(TargetPlatform.generalNoAuthCollection);
  });

  it("should return existing data", function () {
    var flag, returnedData, isAaronCreated;
    runs(function () {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron"
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
    });

    waitsFor(function () {
      return isAaronCreated;
    }, "aaron should be created", TEST_TIMEOUT);

    runs(function () {
      flag = false;
      var callback = function (err, data) {
        flag = true;
        if (err) {
        } else {
          returnedData = data;
        }
      };
      col.fetch(callback);
    });

    waitsFor(function () {
      return flag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('aaron');
    });
  });
});

describe("ClearBlade collections CRUD should", function () {
  var collection, col;
  if(window.navigator.userAgent.indexOf("Firefox") > 0) {
        collection = TargetPlatform.firefoxNoAuthCollection;
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
        collection = TargetPlatform.chromeNoAuthCollection;
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
        collection = TargetPlatform.safariNoAuthCollection;
    }

  beforeEach(function () {
    var finishedRemoval = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function (err, user) {
        col = new ClearBlade.Collection(collection);
        var query = new ClearBlade.Query();
        query.equalTo('name', 'John');
        col.remove(query, function (err, data) { finishedRemoval = true; });
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return finishedRemoval;
    }, "John should be removed.", TEST_TIMEOUT);
  });

  it("successfully create an item", function () {
    var flag, returnedData, secondFlag;

    runs(function () {
      flag = false;
      var callback = function (err, data) {
        flag = true;
        if (err) {
        }
      };
      var newThing = {
        name: 'jim',
        age: 40
      };
      col.create(newThing, callback);
    });

    waitsFor(function () {
      return flag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      secondFlag = false;
      var callback = function (err, data) {
        secondFlag = true;
        if (err) {
        } else {
          returnedData = data;
        }
      };
      col.fetch(callback);
    });

    waitsFor(function () {
      return secondFlag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('jim');
    });
  });

  it("successfully update an item", function () {
    // This tests an update and then a fetch to get the updated item, as
    // opposed to checking the updated item in the update callback itself
    var flag, returnedData, secondFlag;

    runs(function () {
      flag = false;
      var callback = function (err, data) {
        flag = true;
        if (err) {
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
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      secondFlag = false;
      var callback = function (err, data) {
        secondFlag = true;
        if (err) {
        } else {
          returnedData = data;
        }
      };
      col.fetch(callback);
    });

    waitsFor(function () {
      return secondFlag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('john');
    });
  });

  it("successfully delete an item", function () {
    var flag, returnedData, secondFlag;

    runs(function () {
      flag = false;
      var callback = function (err, data) {
        flag = true;
        if (err) {
        }
      };
      var query = new ClearBlade.Query();
      query.equalTo('name', 'john');
      col.remove(query, callback);
    });

    waitsFor(function () {
      return flag;
    }, "returnedData should not be undefined", TEST_TIMEOUT);

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
    }, "returnedData should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData).toEqual([]);
    });
  });
});

describe("Query objects should", function () {
  var collection, col;
  beforeEach(function () {
    var isJohnInserted = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function (err, user) {
        if(window.navigator.userAgent.indexOf("Firefox") > 0) {
          collection = TargetPlatform.firefoxNoAuthCollection;
        } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
          collection = TargetPlatform.chromeNoAuthCollection;
        } else if(window.navigator.userAgent.indexOf("Safari") > 0){
          collection = TargetPlatform.safariNoAuthCollection;
        }
        col = new ClearBlade.Collection(collection);
        var newItem = {
          name: 'John',
          age: 34
        };
        col.create(newItem, function (err, data) {
          if (err) {
          } else {
            isJohnInserted = true;
          }
        });
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isJohnInserted;
    }, "John should be inserted", TEST_TIMEOUT);
  });

  afterEach(function () {
    var query = new ClearBlade.Query();
    var isJohnRemoved = false;
    query.equalTo('name', 'John');
    var callback = function (err, data) {
      if (err) {
      }
      isJohnRemoved = true;
    };
    col.remove(query, callback);
    waitsFor(function() {
      return isJohnRemoved;
    }, "John should be removed", TEST_TIMEOUT);
  });

  it("successfully fetch an item", function () {
    var flag, returnedData;
    var options = {
      collection: collection
    };

    var query = new ClearBlade.Query(options);
    query.equalTo('name', 'John');
    flag = false;
    runs(function () {
      var callback = function (err, data) {
        if (err) {
        } else {
          flag = true;
          returnedData = data;
        }
      };
      query.fetch(callback);
    });

    waitsFor(function () {
      return flag;
    }, "returned data should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('John');
    });
  });
  it("receive updated item upon successful update", function () {
    // This tests the update callback itself to confirm that the data received
    // in the callback is the updated item
    var flag, returnedData;
    var options = {
      collection: collection
    };
    var query = new ClearBlade.Query(options);
    query.equalTo('name', 'John');

    flag = false;
    runs(function () {
      var changes = {
        age: 35
      };
      query.update(changes, function (err, data) {
        flag = true;
        if (err) {
            console.error(err);
        } else {
          returnedData = data;
        }
      });
    });

    waitsFor(function () {
      return flag;
    }, "returned data should not be undefined", TEST_TIMEOUT);

    runs(function () {
      expect(returnedData[0].data.age).toEqual(35);
    });
  });
});

describe("The ClearBlade Messaging module", function() {
  var flag, messaging, msgReceived;

  var onMessageArrived = function(message) {
    flag = true;
    msgReceived = message;
  };
  var onConnect = function(data) {
    flag = true;
    // Once a connection has been made, make a subscription and send a message.
    messaging.Subscribe('/test', {}, onMessageArrived);
  };

  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      appKey: TargetPlatform.noAuthAppKey,
      appSecret: TargetPlatform.noAuthAppSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
      }
    };
    ClearBlade.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  it("should be able to subscribe and send/receive a message", function () {
    runs(function() {
      flag = false;
      messaging = new ClearBlade.Messaging({}, onConnect);
    });

    waitsFor(function() {
      return flag;
    }, "Did not connect", 3000);

    runs(function() {
      flag = false;
      messaging.Publish('/test', 'hello');
    });

    waitsFor(function() {
      return flag;
    }, "Did not publish", 3000);

    runs(function() {
      expect(msgReceived).toEqual('hello');
    });
  });

  it("should use the callbacks I pass into Subscribe()", function () {
    var successMsg;

    // Custom success callback to use in Subscribe options
    var onSuccess = function(data) {
      successMsg = 'EXECUTED';
      flag = true;
    };

    runs(function() {
      flag = false;
      messaging = new ClearBlade.Messaging({onSuccess:onSuccess}, onConnect);
    });

    waitsFor(function() {
      return flag;
    }, "Did not connect", 3000);

    runs(function() {
      expect(successMsg).toEqual('EXECUTED');
    });
  });
});
