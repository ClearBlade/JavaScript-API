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
  serverAddress: "https://rtp.clearblade.com:4433",
  messagingURI: "rtp.clearblade.com",
  messagingPort: 8904,
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
  systemKey: 'a29a80c40a9680da8ddccef0ee4a',
  systemSecret: 'A29A80C40AE8A6F59286F19380DE01',
  noAuthsystemKey: "b48abbb10af2f9bfffd9f793dc9a01",
  noAuthsystemSecret: "B48ABBB10AE8EB9AD7D1B3B7FC62",
  safariCollection: "84bb80c40ab6f395f2eac0a08260",
  chromeCollection:"b2a080c40ad8d0e08681dbe8edcd01",
  firefoxCollection:"eca080c40aaaabdfcaeeeaf29cc201",
  generalCollection:'88af80c40a8aa4e4a08c929ff248',
  firefoxNoAuthCollection: "f28fbbb10a8ca5a5f2f5acd297cc01",
  safariNoAuthCollection: "a690bbb10abadbb387efdcc0b09e01",
  generalNoAuthCollection: "ba90bbb10aba93f7bde8cbd2cfe201",
  chromeNoAuthCollection: "e08fbbb10ae0efadd4e2f68cf39701"
};
var TargetPlatform = PLATFORM_INFO;

describe("ClearBlade initialization should", function () {
  var cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
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
    cbObj.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  it("have the systemKey stored", function () {
    expect(cbObj.systemKey).toEqual(TargetPlatform.noAuthsystemKey);
  });

  it("have the systemSecret stored", function () {
    expect(cbObj.systemSecret).toEqual(TargetPlatform.noAuthsystemSecret);
  });

  // it("have defaulted the URI to the Platform", function () {
  //   expect(ClearBlade.URI).toEqual('');
  // });

  it("have defaulted the logging to false", function () {
    expect(cbObj.logging).toEqual(false);
  });

  it("have defaulted the callTimeout to 30000", function () {
    expect(cbObj._callTimeout).toEqual(30000);
  });
});

describe("ClearBlade users should", function () {
  var initOptions, cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
    initOptions = {
      systemKey: TargetPlatform.systemKey,
      systemSecret: TargetPlatform.systemSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
    };
  });

  it("register new user and be authenticated with email and password", function () {
    var authenticated = false;
    initOptions.email = "test_" + Math.floor(Math.random() * 10000) + "@test.com";
    initOptions.password = "password";
    initOptions.registerUser = true;
    initOptions.callback = function(err, response) {
      expect(cbObj.user).toBeDefined();
      expect(cbObj.user.email).toEqual(initOptions.email);
      expect(cbObj.user.authToken).toBeDefined();
      cbObj.isCurrentUserAuthenticated(function(err, isAuthenticated) {
        expect(err).toEqual(false);
        expect(isAuthenticated).toEqual(true);
        cbObj.logoutUser(function(err, response) {
          expect(err).toEqual(false);
          cbObj.isCurrentUserAuthenticated(function(err, isAuthenticated) {
            expect(err).toEqual(false);
            expect(isAuthenticated).toEqual(false);
            authenticated = true;
          });
        });
      });
    };
    cbObj.init(initOptions);
    waitsFor(function() {
      return authenticated;
    }, "user should be defined", TEST_TIMEOUT);
  });
});

describe("ClearBlade anonymous users", function () {
  var initOptions, cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
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
      expect(cbObj.user).toBeDefined();
    };
    cbObj.init(initOptions);
    waitsFor(function() {
      return authenticated;
    }, "user should be defined", TEST_TIMEOUT);
  });
});

describe("ClearBlade collection fetching with users", function () {
  var cbObj = new ClearBlade();
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
        col = cbObj.Collection(TargetPlatform.generalCollection);
      }
    };
    cbObj.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);

    runs(function () {
      var query = cbObj.Query();
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

describe("ClearBlade Query usage with anonymous user", function() {
  var col, cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
        col = cbObj.Collection(TargetPlatform.generalNoAuthCollection);
      }
    };
    cbObj.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  // Make sure it exists by creating it.
  it("should return existing data", function() {
    var returnedData, isAaronCreated;
    runs(function () {
      var query = cbObj.Query();
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
      var query = cbObj.Query();
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
      expect(returnedData[0].data.name).toEqual('aaron');
    });
  });

  it("should allow multiple query parts", function() {
    var flag, returnedData, isAaronCreated;
    runs(function () {
      var query = cbObj.Query();
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
      var query = cbObj.Query();
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
      expect(returnedData).toEqual([]);
    });

    // Positive case -- should return an item
    runs(function() {
      var query = cbObj.Query();
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
      expect(returnedData[0].data.name).toEqual('aaron');
    });
  });

  it("should allow or-based queries", function() {
    var flag, returnedData, isAaronCreated, isCharlieCreated;
    runs(function () {
      var query = cbObj.Query();
      query.equalTo('name', 'aaron');
      col.remove(query,function() {
        col.create({
          name: "aaron"
        }, function(err, response) {
          expect(err).toEqual(false);
          isAaronCreated = true;
        });
      });
      var query2 = cbObj.Query();
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
      var query = cbObj.Query();
      query.equalTo('name', 'aaron');
      var orQuery = cbObj.Query();
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
      expect(returnedData.length).toEqual(2);
      // Cleanup
      var query2 = cbObj.Query();
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
      var query = cbObj.Query();
      query.equalTo('name', 'aaron');
      query.setPage(10, 1);
      expect(query.query.PAGESIZE).toEqual(10);
      expect(query.query.PAGENUM).toEqual(1);
    });
  });

  it("should allow sorting options", function() {
    runs(function() {
      var query = cbObj.Query();
      query.equalTo('name', 'aaron');
      query.collection = col.ID;
      query.ascending('name');
      expect(query.query.SORT).toEqual([{"ASC": "name"}]);
    });
    runs(function() {
      var query = cbObj.Query();
      query.equalTo('name', 'aaron');
      query.descending('name');
      expect(query.query.SORT).toEqual([{"DESC": "name"}]);
    });
  });
});

describe("ClearBlade collections fetching", function () {
  var col, cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function(err, user) {
        expect(err).toEqual(false);
        isClearBladeInit = true;
        col = cbObj.Collection(TargetPlatform.generalNoAuthCollection);
      }
    };
    cbObj.init(initOptions);
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
      var query = cbObj.Query();
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
  var collection, col, cbObj;
  if(window.navigator.userAgent.indexOf("Firefox") > 0) {
        collection = TargetPlatform.firefoxNoAuthCollection;
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
        collection = TargetPlatform.chromeNoAuthCollection;
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
        collection = TargetPlatform.safariNoAuthCollection;
    }

  beforeEach(function () {
    cbObj = new ClearBlade();
    var finishedRemoval = false;
    var initOptions = {
      systemKey: TargetPlatform.noAuthsystemKey,
      systemSecret: TargetPlatform.noAuthsystemSecret,
      URI: TargetPlatform.serverAddress,
      messagingURI: TargetPlatform.messagingURI,
      callback: function (err, user) {
        col = cbObj.Collection(collection);
        var query = cbObj.Query();
        query.equalTo('name', 'John');
        col.remove(query, function (err, data) { finishedRemoval = true; });
      }
    };
    cbObj.init(initOptions);
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
      var query = cbObj.Query();
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
      var query = cbObj.Query();
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
  var collection, col, cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
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
        col = cbObj.Collection(collection);
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
    cbObj.init(initOptions);
    waitsFor(function() {
      return isJohnInserted;
    }, "John should be inserted", TEST_TIMEOUT);
  });

  afterEach(function () {
    var query = cbObj.Query();
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

    var query = cbObj.Query(options);
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
    var query = cbObj.Query(options);
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
      expect(returnedData[0].age).toEqual(35);
    });
  });
});

describe("The ClearBlade Messaging module", function() {
  var firstFlag, secondFlag, messageObj, msgReceived, cbObj;

  var onMessageArrived = function(message) {
    secondFlag = true;
    msgReceived = message;
  };
  var onConnect = function(data) {
    firstFlag = true;
    // Once a connection has been made, make a subscription and send a message.
    messageObj.Subscribe('test', {}, onMessageArrived);
  };

  beforeEach(function () {
    cbObj = new ClearBlade();
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
    cbObj.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);
  });

  it("should be able to subscribe and send/receive a message", function () {
    runs(function() {
      firstFlag = false;
      messageObj = cbObj.Messaging({}, onConnect);
    });

    waitsFor(function() {
      return firstFlag;
    }, "Did not connect", 3000);

    runs(function() {
      secondFlag = false;
      messageObj.Publish('test', 'hello');
    });

    waitsFor(function() {
      return secondFlag;
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
      messaging = cbObj.Messaging({onSuccess:onSuccess}, onConnect);
    });

    waitsFor(function() {
      return flag;
    }, "Did not connect", 3000);

    runs(function() {
      expect(successMsg).toEqual('EXECUTED');
    });
  });

  it("should fetch message histories", function() {
    messaging = cbObj.Messaging({}, onConnect);
    var flag = false;
    waitsFor(function() {
      return flag;
    }, "Did not get message history", 3000);
    var theTime = Math.floor(new Date().getTime() / 1000);
    messaging.getMessageHistory("test", Math.floor(theTime), 10, function(err, history) {
      expect(err).toEqual(false);
      flag = true;
    });
  });
});

describe("User queries", function() {
  it("should be able to fetch users without a query", function() {
    var cbObj = new ClearBlade();
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
    cbObj.init(initOptions);
    waitsFor(function() {
      return isClearBladeInit;
    }, "ClearBlade should be initialized", TEST_TIMEOUT);

    runs(function() {
      var userObj = cbObj.User();
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
