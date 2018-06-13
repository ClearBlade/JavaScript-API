/*
 * JavaScript tests to test the user functionality
 */

import { cb, platformUrl, systemKey } from "./utils";

describe("ClearBlade Users", function() {
  it("gets user info", function() {
    var user = cb.User();
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/user/info",
      URI: platformUrl,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.getUser(function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("Updates a users information", function() {
    var user = cb.User();
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/user/info",
      URI: platformUrl,
      systemKey: systemKey,
      body: {
        height: 70
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.setUser({ height: 70 }, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("Gets all the users", function() {
    var user = cb.User();
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/user",
      URI: platformUrl,
      qs: "",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.allUsers(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
