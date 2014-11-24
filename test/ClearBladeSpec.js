/**
 * This is the Jasmine testing file for the ClearBlade javascript API
 */
var cb;
beforeEach(function() {
  spyOn(ClearBlade, 'request').and.callFake(function (options, callback) {
    callback(null, {fake: "data", DATA: []});
  });
  cb = new ClearBlade();
});

function TestRequest(requester, expectedRequest) {
  
}

describe("ClearBlade initialization should", function () {
  beforeEach(function () {
    var initOptions = {
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret'
    };
    cb.init(initOptions);

  });

  it("have the systemKey stored", function () {
    expect(cb.systemKey).toEqual('fakeSystemKey');
  });

  it("have the systemSecret stored", function () {
    expect(cb.systemSecret).toEqual('fakeSystemSecret');
  });

  it("have defaulted the URI to the Platform", function () {
    expect(cb.URI).toEqual('https://platform.clearblade.com');
  });

  it("have defaulted the logging to false", function () {
    expect(cb.logging).toEqual(false);
  });

  it("have defaulted the callTimeout to 30000", function () {
    expect(cb._callTimeout).toEqual(30000);
  });
});

describe("ClearBlade user setup", function () {
  beforeEach(function () {
    var initOptions = {
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret'
    };
    cb.init(initOptions);
  });

  it('should register a new user correctly', function () {
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call later
    cb.registerUser('test@fake.com', 'testPass', function (err, data) {});
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/user/reg',
      useUser: false,
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      timeout: 30000,
      URI: 'https://platform.clearblade.com',
      body: {
	email: 'test@fake.com',
	password: 'testPass'
      }
    };
    expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
  });

  it('should login as anon', function () {
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call later
    cb.loginAnon(function (err, data) {});
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/user/anon',
      useUser: false,
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      timeout: 30000,
      URI: 'https://platform.clearblade.com'
    };
    expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
  });

  it('should login as user', function () {
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call later
    var initOptions = {
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      email: 'test@fake.com',
      password: 'testPass'
    };
    cb.init(initOptions);
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/user/auth',
      useUser: false,
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      timeout: 30000,
      URI: 'https://platform.clearblade.com',
      body: {
	email: 'test@fake.com',
	password: 'testPass'
      }
    };
    expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
  });

  it('should check to see if the user is authed', function () {
    cb.setUser('test@fake.com', 'testUserToken');
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call later
    cb.isCurrentUserAuthenticated(function (err, data) {});
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/user/checkauth',
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      timeout: 30000,
      URI: 'https://platform.clearblade.com',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
  });

  it('should log out user', function () {
    cb.setUser('test@fake.com', 'testUserToken');
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call later
    cb.logoutUser(function (err, data) {});
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/user/logout',
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
      timeout: 30000,
      URI: 'https://platform.clearblade.com',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
  });
  
});

// describe("ClearBlade collections fetching", function () {
//   var col, cbObj;
//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     var isClearBladeInit = false;
//     var initOptions = {
//       systemKey: TargetPlatform.noAuthsystemKey,
//       systemSecret: TargetPlatform.noAuthsystemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       callback: function(err, user) {
//         expect(err).toEqual(false);
//         isClearBladeInit = true;
//         col = cbObj.Collection(TargetPlatform.generalNoAuthCollection);
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return isClearBladeInit;
//     }, "ClearBlade should be initialized", TEST_TIMEOUT);
//   });

//   it("should have the collectionID stored", function () {
//     expect(col.ID).toEqual(TargetPlatform.generalNoAuthCollection);
//   });

//   it("should return existing data", function () {
//     var flag, returnedData, isAaronCreated;
//     runs(function () {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       col.remove(query,function() {
//         col.create({
//           name: "aaron"
//         }, function(err, response) {
//           expect(err).toEqual(false);
//           isAaronCreated = true;
//         });
//       });
//     });

//     waitsFor(function () {
//       return isAaronCreated;
//     }, "aaron should be created", TEST_TIMEOUT);

//     runs(function () {
//       flag = false;
//       var callback = function (err, data) {
//         flag = true;
//         if (err) {
//         } else {
//           returnedData = data;
//         }
//       };
//       col.fetch(callback);
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData[0].data.name).toEqual('aaron');
//     });
//   });
// });

// describe("ClearBlade collections CRUD should", function () {
//   var collection, col, cbObj;
//   if(window.navigator.userAgent.indexOf("Firefox") > 0) {
//         collection = TargetPlatform.firefoxNoAuthCollection;
//     } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
//         collection = TargetPlatform.chromeNoAuthCollection;
//     } else if(window.navigator.userAgent.indexOf("Safari") > 0){
//         collection = TargetPlatform.safariNoAuthCollection;
//     }

//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     var finishedRemoval = false;
//     var initOptions = {
//       systemKey: TargetPlatform.noAuthsystemKey,
//       systemSecret: TargetPlatform.noAuthsystemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       callback: function (err, user) {
//         col = cbObj.Collection(collection);
//         var query = cbObj.Query();
//         query.equalTo('name', 'John');
//         col.remove(query, function (err, data) { finishedRemoval = true; });
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return finishedRemoval;
//     }, "John should be removed.", TEST_TIMEOUT);
//   });

//   it("successfully create an item", function () {
//     var flag, returnedData, secondFlag;

//     runs(function () {
//       flag = false;
//       var callback = function (err, data) {
//         flag = true;
//         if (err) {
//         }
//       };
//       var newThing = {
//         name: 'jim',
//         age: 40
//       };
//       col.create(newThing, callback);
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       secondFlag = false;
//       var callback = function (err, data) {
//         secondFlag = true;
//         if (err) {
//           returnedData = data;
//         } else {
//           returnedData = data;
//         }
//       };
//       col.fetch(callback);
//     });

//     waitsFor(function () {
//       return secondFlag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData[0].data.name).toEqual('jim');
//     });
//   });

//   it("successfully update an item", function () {
//     // This tests an update and then a fetch to get the updated item, as
//     // opposed to checking the updated item in the update callback itself
//     var flag, returnedData, secondFlag;

//     runs(function () {
//       flag = false;
//       var callback = function (err, data) {
//         flag = true;
//         if (err) {
//         }
//       };
//       var query = cbObj.Query();
//       query.equalTo('name', 'jim');
//       var newThing = {
//         name: 'john'
//       };
//       col.update(query, newThing, callback);
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       secondFlag = false;
//       var callback = function (err, data) {
//         secondFlag = true;
//         if (err) {
//           returnedData = data;
//         } else {
//           returnedData = data;
//         }
//       };
//       col.fetch(callback);
//     });

//     waitsFor(function () {
//       return secondFlag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData[0].data.name).toEqual('john');
//     });
//   });

//   it("successfully delete an item", function () {
//     var flag, returnedData, secondFlag;

//     runs(function () {
//       flag = false;
//       var callback = function (err, data) {
//         flag = true;
//         if (err) {
//         }
//       };
//       var query = cbObj.Query();
//       query.equalTo('name', 'john');
//       col.remove(query, callback);
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       secondFlag = false;
//       var callback = function (err, data) {
//         secondFlag = true;
//         returnedData = data;
//       };
//       col.fetch(callback);
//     });

//     waitsFor(function () {
//       return secondFlag;
//     }, "returnedData should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData).toEqual([]);
//     });
//   });
// });

// describe("Query objects should", function () {
//   var collection, col, cbObj;
//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     var isJohnInserted = false;
//     var initOptions = {
//       systemKey: TargetPlatform.noAuthsystemKey,
//       systemSecret: TargetPlatform.noAuthsystemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       callback: function (err, user) {
//         if(window.navigator.userAgent.indexOf("Firefox") > 0) {
//           collection = TargetPlatform.firefoxNoAuthCollection;
//         } else if(window.navigator.userAgent.indexOf("Chrome") > 0) {
//           collection = TargetPlatform.chromeNoAuthCollection;
//         } else if(window.navigator.userAgent.indexOf("Safari") > 0){
//           collection = TargetPlatform.safariNoAuthCollection;
//         }
//         col = cbObj.Collection(collection);
//         var newItem = {
//           name: 'John',
//           age: 34
//         };
//         col.create(newItem, function (err, data) {
//           if (err) {
//           } else {
//             isJohnInserted = true;
//           }
//         });
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return isJohnInserted;
//     }, "John should be inserted", TEST_TIMEOUT);
//   });

//   afterEach(function () {
//     var query = cbObj.Query();
//     var isJohnRemoved = false;
//     query.equalTo('name', 'John');
//     var callback = function (err, data) {
//       if (err) {
//       }
//       isJohnRemoved = true;
//     };
//     col.remove(query, callback);
//     waitsFor(function() {
//       return isJohnRemoved;
//     }, "John should be removed", TEST_TIMEOUT);
//   });

//   it("successfully fetch an item", function () {
//     var flag, returnedData;
//     var options = {
//       collection: collection
//     };

//     var query = cbObj.Query(options);
//     query.equalTo('name', 'John');
//     flag = false;
//     runs(function () {
//       var callback = function (err, data) {
//         if (err) {
//         } else {
//           flag = true;
//           returnedData = data;
//         }
//       };
//       query.fetch(callback);
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returned data should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData[0].data.name).toEqual('John');
//     });
//   });

//   it("receive updated item upon successful update", function () {
//     // This tests the update callback itself to confirm that the data received
//     // in the callback is the updated item
//     var flag, returnedData;
//     var options = {
//       collection: collection
//     };
//     var query = cbObj.Query(options);
//     query.equalTo('name', 'John');

//     flag = false;
//     runs(function () {
//       var changes = {
//         age: 35
//       };
//       query.update(changes, function (err, data) {
//         flag = true;
//         if (err) {
//           expect(err).toBeFalsy();
//           returnedData = data;
//         } else {
//           returnedData = data;
//         }
//       });
//     });

//     waitsFor(function () {
//       return flag;
//     }, "returned data should not be undefined", TEST_TIMEOUT);

//     runs(function () {
//       expect(returnedData[0].age).toEqual(35);
//     });
//   });
// });

// describe("The ClearBlade Messaging module", function() {
//   var firstFlag, secondFlag, messageObj, msgReceived, cbObj;

//   var onMessageArrived = function(message) {
//     secondFlag = true;
//     msgReceived = message;
//   };
//   var onConnect = function(data) {
//     firstFlag = true;
//     // Once a connection has been made, make a subscription and send a message.
//     messageObj.Subscribe('test', {}, onMessageArrived);
//   };

//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     var isClearBladeInit = false;
//     var initOptions = {
//       systemKey: TargetPlatform.systemKey,
//       systemSecret: TargetPlatform.systemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       callback: function(err, user) {
//         expect(err).toEqual(false);
//         isClearBladeInit = true;
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return isClearBladeInit;
//     }, "ClearBlade should be initialized", TEST_TIMEOUT);
//   });

//   it("should be able to subscribe and send/receive a message", function () {
//     runs(function() {
//       firstFlag = false;
//       messageObj = cbObj.Messaging({}, onConnect);
//     });

//     waitsFor(function() {
//       return firstFlag;
//     }, "Did not connect", 3000);

//     runs(function() {
//       secondFlag = false;
//       messageObj.Publish('test', 'hello');
//     });

//     waitsFor(function() {
//       return secondFlag;
//     }, "Did not publish", 3000);

//     runs(function() {
//       expect(msgReceived).toEqual('hello');
//     });
//   });

//   it("should use the callbacks I pass into Subscribe()", function () {
//     var successMsg;

//     // Custom success callback to use in Subscribe options
//     var onSuccess = function(data) {
//       successMsg = 'EXECUTED';
//       flag = true;
//     };

//     runs(function() {
//       flag = false;
//       messaging = cbObj.Messaging({onSuccess:onSuccess}, onConnect);
//     });

//     waitsFor(function() {
//       return flag;
//     }, "Did not connect", 3000);

//     runs(function() {
//       expect(successMsg).toEqual('EXECUTED');
//     });
//   });

//   it("should fetch message histories", function() {
//     messaging = cbObj.Messaging({}, onConnect);
//     var flag = false;
//     waitsFor(function() {
//       return flag;
//     }, "Did not get message history", 3000);
//     var theTime = Math.floor(new Date().getTime() / 1000);
//     messaging.getMessageHistory("test", Math.floor(theTime), 10, function(err, history) {
//       expect(err).toEqual(false);
//       flag = true;
//     });
//   });
// });

// describe("User queries", function() {
//   it("should be able to fetch users without a query", function() {
//     var cbObj = new ClearBlade();
//     var returnedUsers, usersRetrieved;
//     var isClearBladeInit = false;
//     var initOptions = {
//       systemKey: TargetPlatform.systemKey,
//       systemSecret: TargetPlatform.systemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       callback: function(err, user) {
//         expect(err).toEqual(false);
//         isClearBladeInit = true;
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return isClearBladeInit;
//     }, "ClearBlade should be initialized", TEST_TIMEOUT);

//     runs(function() {
//       var userObj = cbObj.User();
//       userObj.allUsers(function(err, data) {
//         expect(err).toEqual(false);
//         returnedUsers = data;
//         usersRetrieved = true;
//       });
//     });

//     waitsFor(function() {
//       return usersRetrieved;
//     }, "Users should be retrieved", TEST_TIMEOUT);

//     runs(function() {
//       expect(returnedUsers.Data).not.toBeNull();
//     });
//   });
// });
