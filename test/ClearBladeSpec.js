/**
 * This is the Jasmine testing file for the ClearBlade javascript API
 *
 * The credentials to log into the platform and change the collections that this test suite uses:
 *
 * username: test@fake.com
 * password: testPass
 */

describe("ClearBlade API", function () {
  it("should return the correct API version", function () {
    var APIversion = ClearBlade.getApiVersion();
    expect(APIversion).toEqual('0.0.2');
  });
});

describe("ClearBlade initialization should", function () {
  beforeEach(function () {
    var initOptions = {
      appKey: 'bcf1fca90af4f8a8fbb3d5ce9173',
      appSecret: 'BCF1FCA90A90BAE0CA9399A899F501'
    };
    ClearBlade.init(initOptions);
  });

  it("have the appKey stored", function () {
    expect(ClearBlade.appKey).toEqual('bcf1fca90af4f8a8fbb3d5ce9173');
  });

  it("have the appSecret stored", function () {
    expect(ClearBlade.appSecret).toEqual('BCF1FCA90A90BAE0CA9399A899F501');
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

describe("ClearBlade collections fetching", function () {
  var col;
  beforeEach(function () {
    var initOptions = {
      appKey: 'bcf1fca90af4f8a8fbb3d5ce9173',
      appSecret: 'BCF1FCA90A90BAE0CA9399A899F501'
    };
    ClearBlade.init(initOptions);
    col = new ClearBlade.Collection('b4dc85aa0ab290f1e9d0e0cdad9401');
  });

  it("should have the collectionID stored", function () {
    expect(col.ID).toEqual('b4dc85aa0ab290f1e9d0e0cdad9401');
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
    }, "returnedData should not be undefined", 30000);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('aaron');
    });
  });
});
describe("ClearBlade collections CRUD should", function () {
  var collection, col;
  if(window.navigator.userAgent.indexOf("Firefox") > 0) {
        collection = "fadc85aa0aeabea1ba8887f592e101"; 
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
        collection = "f2dc85aa0abac7e7f7a187a68654";
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
        collection = "88dd85aa0afcfdaede8498a4f6f401"; 
    }

  beforeEach(function () {
    var initOptions = {
      appKey: 'bcf1fca90af4f8a8fbb3d5ce9173',
      appSecret: 'BCF1FCA90A90BAE0CA9399A899F501'
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
    }, "returnedData should not be undefined", 30000);
    
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
    }, "returnedData should not be undefined", 30000);

    runs(function () {
      expect(returnedData[0].data.name).toEqual('jim');
    });
  });

  it("successfully update an item", function () {
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
    }, "returnedData should not be undefined", 30000);
    
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
    }, "returnedData should not be undefined", 30000);

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
      expect(returnedData).toEqual([]);
    });
  });
});

describe("Query objects should", function () {
  var collection, col;
  beforeEach(function () {
    var initOptions = {
      appKey: 'bcf1fca90af4f8a8fbb3d5ce9173',
      appSecret: 'BCF1FCA90A90BAE0CA9399A899F501'
    };
    ClearBlade.init(initOptions);
    if(window.navigator.userAgent.indexOf("Firefox") > 0) {
      collection = "fadc85aa0aeabea1ba8887f592e101"; 
    } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
      collection = "f2dc85aa0abac7e7f7a187a68654";
    } else if(window.navigator.userAgent.indexOf("Safari") > 0){
      collection = "88dd85aa0afcfdaede8498a4f6f401"; 
    }
    col = new ClearBlade.Collection(collection);
    var newItem = {
      name: 'John',
      age: 34
    };
    var callback = function (err, data) {
      if (err) {
      } 
    };
    col.create(newItem, callback);
  });

  afterEach(function () {
    var query = new ClearBlade.Query();
    query.equalTo('name', 'John');
    var callback = function (err, data) {
      if (err) {
      } 
    };
    col.remove(query, callback);
  });

  it("successfully fetch an item", function () {
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
      expect(returnedData[0].data.name).toEqual('John');
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
        flag = true;
        if (err) {
        } else {
          returnedData = data;
        }
      });  
    });

    waitsFor(function () {
      return flag;
    }, "returned data should not be undefined", 30000);

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
      appKey: 'bcf1fca90af4f8a8fbb3d5ce9173',
      appSecret: 'BCF1FCA90A90BAE0CA9399A899F501'
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
      debugger;
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
