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
  noAuthsystemKey: "8cc896b40a82d0d2b4e18bbbed0f",
  noAuthsystemSecret: "8CC896B40A90DEA898C197B5E357",
  safariNoAuthCollection: "ccc896b40ae083ea8af480d4868401",
  chromeNoAuthCollection: "e8c896b40a90bfcd9bc78df5ca5d",
  generalNoAuthCollection: "82c996b40a90fab0dbf7ff83e312",
  firefoxNoAuthCollection: "a8c996b40aacdd919dadce92c430",
  systemKey: "d6d096b40ab4f3c7ddb4899b8a30",
  systemSecret: "D6D096B40ADAA885E0BF8F8D93CB01",
  safariCollection: "84d196b40aa883bec8cfdaf697df01",
  firefoxCollection: "9ed196b40a8083efa485e58aa9b901",
  generalCollection: "9cd296b40acac5e2f797a485ec8e01",
  chromeCollection: "bcd196b40ade8ddb9491b494fd9f01"
};
var STAGING_INFO = {
  serverAddress: "https://staging.clearblade.com",
  messagingURI: "staging.clearblade.com",
  messagingPort: 8904,
  noAuthsystemKey: "e6a1c1ba0a8690f7a6aaacde9fff01",
  noAuthsystemSecret: "E6A1C1BA0A98E3D384D7D8F6C6F901",
  safariNoAuthCollection: "bea3c1ba0ae8cc97f2d0e897e6cb01",
  chromeNoAuthCollection: "aea2c1ba0a8495d2bdb7d0e3bca701",
  generalNoAuthCollection: "90a3c1ba0ab2e3dcfccab5d8bbb101",
  firefoxNoAuthCollection: "dca2c1ba0aa0ecd89bbe80ba8b8501",
  systemKey: "8c9ac1ba0adeb7f68fced7fb9049",
  systemSecret: "8C9AC1BA0AE2D697A0DCA78DC179",
  safariCollection: "d49dc1ba0a8ae8dfb5b5f6a996c301",
  firefoxCollection: "fe9bc1ba0af08893def9f9fceeef01",
  generalCollection: "b49cc1ba0adac69fc9f4d8a0fe52",
  chromeCollection: "d69ac1ba0a9293bbc9fdb486e38d01"
};
var PLATFORM_INFO = {
  serverAddress: "https://platform.clearblade.com",
  messagingURI: "platform.clearblade.com",
  systemKey: 'f2f5f8aa0aba8bc7e4bdcd8ef142',
  systemSecret: 'F2F5F8AA0AB4F2C4A4E1C387F3F801',
  noAuthsystemKey: "b48abbb10af2f9bfffd9f793dc9a01",
  noAuthsystemSecret: "B48ABBB10AE8EB9AD7D1B3B7FC62",
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
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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

  it("have the systemKey stored", function () {
    expect(ClearBlade.systemKey).toEqual(TargetPlatform.noAuthsystemKey);
  });

  it("have the systemSecret stored", function () {
    expect(ClearBlade.systemSecret).toEqual(TargetPlatform.noAuthsystemSecret);
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
      systemKey: TargetPlatform.systemKey,
      systemSecret: TargetPlatform.systemSecret,
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
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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
      systemKey: TargetPlatform.systemKey,
      systemSecret: TargetPlatform.systemSecret,
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
      expect(returnedData.DATA[0].name).toEqual('aaron');
    });
  });
});

describe("ClearBlade Query usage with anonymous user", function() {
  var col;
  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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
    var returnedData, isAaronCreated;
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
      query.fetch(function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData.DATA[0].name).toEqual('aaron');
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
      query.fetch(function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData.DATA).toEqual([]);
    });

    // Positive case -- should return an item
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron').equalTo('age', 25);
      query.collection = col.ID;
      query.fetch(function(error, data) {
        expect(error).toBeFalsy();
        queryDone2 = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone2;
    }, "Query should be finished", TEST_TIMEOUT);

    runs(function() {
      expect(returnedData.DATA[0].name).toEqual('aaron');
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
      query.fetch(function(error, data) {
        expect(error).toBeFalsy();
        queryDone = true;
        returnedData = data;
      });
    });

    waitsFor(function() {
      return queryDone;
    }, "Query should be finished", TEST_TIMEOUT);

    var isCharlieDeleted;
    runs(function() {
      expect(returnedData.DATA.length).toEqual(2);
      // Cleanup
      var query2 = new ClearBlade.Query();
      query2.equalTo('name', 'charlie');
      col.remove(query2, function() {
        isCharlieDeleted = true;
      });
    });

    waitsFor(function() {
      return isCharlieDeleted;
    }, "charlie should be deleted", TEST_TIMEOUT);
  });

  it("should allow pagination options", function() {
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      query.setPage(10, 1);
      expect(query.query.PAGESIZE).toEqual(10);
      expect(query.query.PAGENUM).toEqual(1);
    });
  });

  it("should allow sorting options", function() {
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      query.collection = col.ID;
      query.ascending('name');
      expect(query.query.SORT).toEqual([{"ASC": "name"}]);
    });
    runs(function() {
      var query = new ClearBlade.Query();
      query.equalTo('name', 'aaron');
      query.descending('name');
      expect(query.query.SORT).toEqual([{"DESC": "name"}]);
    });
  });
});

describe("ClearBlade collections fetching", function () {
  var col;
  beforeEach(function () {
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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
      expect(returnedData.DATA[0].name).toEqual('aaron');
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
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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
          returnedData = data;
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
      expect(returnedData.DATA[0].name).toEqual('jim');
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
          returnedData = data;
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
      expect(returnedData.DATA[0].name).toEqual('john');
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
      expect(returnedData.DATA).toEqual([]);
    });
  });
});

describe("Query objects should", function () {
  var collection, col;
  beforeEach(function () {
    var isJohnInserted = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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
      expect(returnedData.DATA[0].name).toEqual('John');
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
          expect(err).toBeFalsy();
          returnedData = data;
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
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
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

describe("User queries", function() {
  it("should be able to fetch users without a query", function() {
    var returnedUsers, usersRetrieved;
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: TargetPlatform.systemKey,
      systemSecret: TargetPlatform.systemSecret,
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

    runs(function() {
      var userObj = new ClearBlade.User();
      userObj.allUsers(function(err, data) {
        expect(err).toEqual(false);
        returnedUsers = data;
        usersRetrieved = true;
      });
    });

    waitsFor(function() {
      return usersRetrieved;
    }, "Users should be retrieved", TEST_TIMEOUT);

    runs(function() {
      expect(returnedUsers.Data).not.toBeNull();
    });
  });
});
