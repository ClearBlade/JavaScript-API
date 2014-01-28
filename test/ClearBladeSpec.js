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
  appKey: "c899bfae0afca9b1c899c2fe841d",
  appSecret: "C899BFAE0ACAE5A3C2A086ECDCF801",
  safariCollection: "aaaabfae0ad0da86f2dde3bba761",
  chromeCollection: "949abfae0aae8aaeffb09f80f8c101",
  generalCollection: "b69abfae0ad28bceb1dba4eecb19",
  firefoxCollection: "a49abfae0ac8e987e699def0e4e301"
};
var PLATFORM_INFO = {
  serverAddress: "https://platform.clearblade.com",
  appKey: 'f2f5f8aa0aba8bc7e4bdcd8ef142',
  appSecret: 'F2F5F8AA0AB4F2C4A4E1C387F3F801',
  safariCollection: "82f7f8aa0ab8929ab1c3cad7e534",
  chromeCollection:"84f6f8aa0abcf9fbb6ae97a6c9da01",
  firefoxCollection:"d8f6f8aa0ababdbbc5b8fdf49356",
  generalCollection:'90f6f8aa0a86969ced80c0a8b03e'
}
var TargetPlatform = RTP_INFO;

describe("ClearBlade API", function () {
  it("should return the correct API version", function () {
    var APIversion = ClearBlade.getApiVersion();
    expect(APIversion).toEqual('0.0.2');
  });
});


describe("ClearBlade initialization should", function () {
  beforeEach(function () {
    var initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress
    };
    ClearBlade.init(initOptions);
  });

  it("have the appKey stored", function () {
    expect(ClearBlade.appKey).toEqual(TargetPlatform.appKey);
  });

  it("have the appSecret stored", function () {
    expect(ClearBlade.appSecret).toEqual(TargetPlatform.appSecret);
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
      URI: TargetPlatform.serverAddress
    };
  });
  it("have anonymous user authenticated when no options given", function () {
    var authenticated = false;
    initOptions.onSuccess = function() {
      authenticated = true;
      expect(ClearBlade.user).toBeDefined();
    };
    ClearBlade.init(initOptions)
    waitsFor(function() {
      return authenticated;
    }, "user should be defined", TEST_TIMEOUT);
  });
});

describe("ClearBlade collections fetching", function () {
  var col;
  beforeEach(function () {
    var initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress
    };
    ClearBlade.init(initOptions);
    col = new ClearBlade.Collection(TargetPlatform.generalCollection);
  });

  it("should have the collectionID stored", function () {
    expect(col.ID).toEqual(TargetPlatform.generalCollection);
  });

  it("should return the stuff I entered before", function () {
    var flag, returnedData;  
    
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
        collection = TargetPlatform.firefoxCollection; 
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
        collection = TargetPlatform.chromeCollection;
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
        collection = TargetPlatform.safariCollection; 
    }

  beforeEach(function () {
    var initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress
    };
    ClearBlade.init(initOptions);
    col = new ClearBlade.Collection(collection);
    var query = new ClearBlade.Query();
    query.equalTo('name', 'John');
    col.remove(query, function (err, data) {});
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
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress
    };
    ClearBlade.init(initOptions);
    if(window.navigator.userAgent.indexOf("Firefox") > 0) {
      collection = TargetPlatform.firefoxCollection; 
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
      collection = TargetPlatform.chromeCollection;
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
      collection = TargetPlatform.safariCollection; 
    }
    col = new ClearBlade.Collection(collection);
    var newItem = {
      name: 'John',
      age: 34
    };
    var callback = function (err, data) {
      if (err) {
      } 
      isJohnInserted = true;
    };
    col.create(newItem, callback);
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
  it("receive updated dated upon successful update", function () {
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
    var initOptions = {
      appKey: TargetPlatform.appKey,
      appSecret: TargetPlatform.appSecret,
      URI: TargetPlatform.serverAddress
    };
    ClearBlade.init(initOptions);
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
      flag = true;
      successMsg = 'EXECUTED';
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
