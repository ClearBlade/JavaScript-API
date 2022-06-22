/*
 * JavaScript tests to test the code functionality
 */

import { cb, platformUrl, mockRequest } from "./utils";

describe("ClearBlade code", function () {
  it("create code service", function () {
    var code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    var serviceBody = {
      code: "return null;",
      parameters: [],
      name: "fakeNewService",
      dependencies: "",
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      body: serviceBody,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    code.create("fakeNewService", serviceBody, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update code service", function () {
    var code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    var serviceBody = {
      code: "return null;",
      parameters: [],
      name: "fakeNewService",
      dependencies: "",
    };
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      body: serviceBody,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    code.update("fakeNewService", serviceBody, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("delete code service", function () {
    var code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/3/code/fakeSystemKey/service/fakeNewService",
      URI: platformUrl,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    code.delete("fakeNewService", function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("executes given code service with params", function () {
    var code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    var params = {
      name: "charlie",
      age: 23,
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/code/fakeSystemKey/fakeCodeService",
      URI: platformUrl,
      body: {
        name: "charlie",
        age: 23,
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
      timeout: 30000,
    };
    code.execute("fakeCodeService", params, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("code.execute accepts id in options", function () {
    const code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    code.execute(
      "fakeCodeService",
      {},
      function (err) {
        expect(err).toBeNull();
        expect(mockRequest.mock.calls[callNum][0]).toEqual({
          method: "POST",
          endpoint: "api/v/1/code/fakeSystemKey/fakeCodeService?id=myUniqueId",
          URI: platformUrl,
          body: {},
          user: {
            email: "test@fake.com",
            authToken: "testUserToken",
          },
          timeout: 30000,
        });
      },
      {
        id: "myUniqueId",
      }
    );
  });

  it("code.execute accepts requestTimeout in options", function () {
    const code = cb.Code();
    var callNum = mockRequest.mock.calls.length; // we need this for later
    code.execute(
      "fakeCodeService",
      {},
      function (err) {
        expect(err).toBeNull();
        expect(mockRequest.mock.calls[callNum][0]).toEqual({
          method: "POST",
          endpoint: "api/v/1/code/fakeSystemKey/fakeCodeService",
          URI: platformUrl,
          body: {},
          user: {
            email: "test@fake.com",
            authToken: "testUserToken",
          },
          timeout: 420000,
        });
      },
      {
        requestTimeout: 420000,
      }
    );
  });
});
