/*
 * JavaScript tests to test the code functionality
 */

import { cb, platformUrl } from "./utils";

describe("ClearBlade code", function() {
  it("create code service", function() {
    var code = cb.Code();
    var callNum = ClearBlade.request.mock.calls.length; // we need this for later
    var serviceBody = {
      code: "return null;",
      parameters: [],
      name: "fakeNewService",
      dependencies: ""
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      body: serviceBody,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    code.create("fakeNewService", serviceBody, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update code service", function() {
    var code = cb.Code();
    var callNum = ClearBlade.request.mock.calls.length; // we need this for later
    var serviceBody = {
      code: "return null;",
      parameters: [],
      name: "fakeNewService",
      dependencies: ""
    };
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      body: serviceBody,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    code.update("fakeNewService", serviceBody, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("delete code service", function() {
    var code = cb.Code();
    var callNum = ClearBlade.request.mock.calls.length; // we need this for later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    code.delete("fakeNewService", function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("executes given code service with params", function() {
    var code = cb.Code();
    var callNum = ClearBlade.request.mock.calls.length; // we need this for later
    var params = {
      name: "charlie",
      age: 23
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/code/fakeSystemKey/fakeCodeService",
      URI: platformUrl,
      body: {
        name: "charlie",
        age: 23
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    code.execute("fakeCodeService", params, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
