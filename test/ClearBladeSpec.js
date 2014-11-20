/**
 * This is the Jasmine testing file for the ClearBlade javascript API
 */

describe("ClearBlade initialization should", function () {
  var cbObj;
  beforeEach(function () {
    cbObj = new ClearBlade();
    var isClearBladeInit = false;
    var initOptions = {
      systemKey: 'fakeSystemKey',
      systemSecret: 'fakeSystemSecret',
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
    expect(cbObj.systemKey).toEqual('fakeSystemKey');
  });

  it("have the systemSecret stored", function () {
    expect(cbObj.systemSecret).toEqual('fakeSystemSecret');
  });

  it("have defaulted the URI to the Platform", function () {
    expect(ClearBlade.URI).toEqual('https://platform.clearblade.com');
  });

  it("have defaulted the logging to false", function () {
    expect(cbObj.logging).toEqual(false);
  });

  it("have defaulted the callTimeout to 30000", function () {
    expect(cbObj._callTimeout).toEqual(30000);
  });
});

// describe("ClearBlade users should", function () {
//   var initOptions, cbObj;
//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     initOptions = {
//       systemKey: TargetPlatform.systemKey,
//       systemSecret: TargetPlatform.systemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//     };
//   });

//   it("register new user and be authenticated with email and password", function () {
//     var authenticated = false;
//     initOptions.email = "test_" + Math.floor(Math.random() * 10000) + "@test.com";
//     initOptions.password = "password";
//     initOptions.registerUser = true;
//     initOptions.callback = function(err, response) {
//       expect(cbObj.user).toBeDefined();
//       expect(cbObj.user.email).toEqual(initOptions.email);
//       expect(cbObj.user.authToken).toBeDefined();
//       cbObj.isCurrentUserAuthenticated(function(err, isAuthenticated) {
//         expect(err).toEqual(false);
//         expect(isAuthenticated).toEqual(true);
//         cbObj.logoutUser(function(err, response) {
//           expect(err).toEqual(false);
//           cbObj.isCurrentUserAuthenticated(function(err, isAuthenticated) {
//             expect(err).toEqual(false);
//             expect(isAuthenticated).toEqual(false);
//             authenticated = true;
//           });
//         });
//       });
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return authenticated;
//     }, "user should be defined", TEST_TIMEOUT);
//   });
// });

// describe("ClearBlade anonymous users", function () {
//   var initOptions, cbObj;
//   beforeEach(function () {
//     cbObj = new ClearBlade();
//     initOptions = {
//       systemKey: TargetPlatform.noAuthsystemKey,
//       systemSecret: TargetPlatform.noAuthsystemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//     };
//   });

//   it("should have anonymous user authenticated when no options given", function () {
//     var authenticated = false;
//     initOptions.callback = function() {
//       authenticated = true;
//       expect(cbObj.user).toBeDefined();
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return authenticated;
//     }, "user should be defined", TEST_TIMEOUT);
//   });
// });

// describe("ClearBlade collection fetching with users", function () {
//   var cbObj = new ClearBlade();
//   it("should be able to fetch data as an authenticated user", function () {
//     var flag, returnedData, isAaronCreated;
//     var isClearBladeInit = false;
//     var initOptions = {
//       systemKey: TargetPlatform.systemKey,
//       systemSecret: TargetPlatform.systemSecret,
//       URI: TargetPlatform.serverAddress,
//       messagingURI: TargetPlatform.messagingURI,
//       email: "test_" + Math.floor(Math.random() * 10000) + "@test.com",
//       password: "password",
//       registerUser: true,
//       callback: function(err, user) {
//         expect(err).toEqual(false);
//         isClearBladeInit = true;
//         col = cbObj.Collection(TargetPlatform.generalCollection);
//       }
//     };
//     cbObj.init(initOptions);
//     waitsFor(function() {
//       return isClearBladeInit;
//     }, "ClearBlade should be initialized", TEST_TIMEOUT);

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

// describe("ClearBlade Query usage with anonymous user", function() {
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

//   // Make sure it exists by creating it.
//   it("should return existing data", function() {
//     var returnedData, isAaronCreated;
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

//     waitsFor(function() {
//       return isAaronCreated;
//     }, "aaron should be created", TEST_TIMEOUT);

//     var queryDone;
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       query.collection = col.ID;
//       query.fetch(function(error, data) {
//         expect(error).toBeFalsy();
//         queryDone = true;
//         returnedData = data;
//       });
//     });

//     waitsFor(function() {
//       return queryDone;
//     }, "Query should be finished", TEST_TIMEOUT);

//     runs(function() {
//       expect(returnedData[0].data.name).toEqual('aaron');
//     });
//   });

//   it("should allow multiple query parts", function() {
//     var flag, returnedData, isAaronCreated;
//     runs(function () {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       col.remove(query,function() {
//         col.create({
//           name: "aaron",
//           age: 25
//         }, function(err, response) {
//           expect(err).toEqual(false);
//           isAaronCreated = true;
//         });
//       });
//     });

//     waitsFor(function() {
//       return isAaronCreated;
//     }, "aaron should be created", TEST_TIMEOUT);

//     var queryDone, queryDone2;
//     // Negative case -- should return nothing
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron').equalTo('age', 30);
//       query.collection = col.ID;
//       query.fetch(function(error, data) {
//         expect(error).toBeFalsy();
//         queryDone = true;
//         returnedData = data;
//       });
//     });

//     waitsFor(function() {
//       return queryDone;
//     }, "Query should be finished", TEST_TIMEOUT);

//     runs(function() {
//       expect(returnedData).toEqual([]);
//     });

//     // Positive case -- should return an item
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron').equalTo('age', 25);
//       query.collection = col.ID;
//       query.fetch(function(error, data) {
//         expect(error).toBeFalsy();
//         queryDone2 = true;
//         returnedData = data;
//       });
//     });

//     waitsFor(function() {
//       return queryDone2;
//     }, "Query should be finished", TEST_TIMEOUT);

//     runs(function() {
//       expect(returnedData[0].data.name).toEqual('aaron');
//     });
//   });

//   it("should allow or-based queries", function() {
//     var flag, returnedData, isAaronCreated, isCharlieCreated;
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
//       var query2 = cbObj.Query();
//       query2.equalTo('name', 'charlie');
//       col.remove(query2, function() {
//         col.create({
//           name: "charlie"
//         }, function(err, response) {
//           expect(err).toEqual(false);
//           isCharlieCreated = true;
//         });
//       });
//     });

//     waitsFor(function() {
//       return isAaronCreated;
//     }, "aaron should be created", TEST_TIMEOUT);

//     waitsFor(function() {
//       return isCharlieCreated;
//     }, "charlie should be created", TEST_TIMEOUT);

//     var queryDone;
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       var orQuery = cbObj.Query();
//       orQuery.equalTo('name', 'charlie');
//       query.or(orQuery);
//       query.collection = col.ID;
//       query.fetch(function(error, data) {
//         expect(error).toBeFalsy();
//         queryDone = true;
//         returnedData = data;
//       });
//     });

//     waitsFor(function() {
//       return queryDone;
//     }, "Query should be finished", TEST_TIMEOUT);

//     var isCharlieDeleted;
//     runs(function() {
//       expect(returnedData.length).toEqual(2);
//       // Cleanup
//       var query2 = cbObj.Query();
//       query2.equalTo('name', 'charlie');
//       col.remove(query2, function() {
//         isCharlieDeleted = true;
//       });
//     });

//     waitsFor(function() {
//       return isCharlieDeleted;
//     }, "charlie should be deleted", TEST_TIMEOUT);
//   });

//   it("should allow pagination options", function() {
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       query.setPage(10, 1);
//       expect(query.query.PAGESIZE).toEqual(10);
//       expect(query.query.PAGENUM).toEqual(1);
//     });
//   });

//   it("should allow sorting options", function() {
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       query.collection = col.ID;
//       query.ascending('name');
//       expect(query.query.SORT).toEqual([{"ASC": "name"}]);
//     });
//     runs(function() {
//       var query = cbObj.Query();
//       query.equalTo('name', 'aaron');
//       query.descending('name');
//       expect(query.query.SORT).toEqual([{"DESC": "name"}]);
//     });
//   });
// });

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
