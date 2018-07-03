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

  it("sets user info", function() {
    var user = cb.User();
    var userData = {
      email: "test@fake.com",
      authToken: "testUserToken"
    };
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/user/info",
      URI: platformUrl,
      systemKey: "fakeSystemKey",
      body: userData,
      user: userData
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.setUser(userData, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("add user", function() {
    var user = cb.User();
    var userData = {
      email: "test@fake.com",
      authToken: "testUserToken"
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/info",
      URI: platformUrl,
      systemKey: "fakeSystemKey",
      body: userData,
      user: userData
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.addUser(userData, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("Updates a users information", function() {
    var user = cb.User();
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/2/user/info",
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
    user.updateUser({ height: 70 }, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("Deletes a user", function() {
    var user = cb.User();
    var userData = {
      email: "test@fake.com",
      authToken: "testUserToken"
    };
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/user/info",
      URI: platformUrl,
      systemKey: systemKey,
      body: userData,
      user: userData
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.deleteUser(userData, function(err, body) {
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

  it("Sets password of user", function() {
    var user = cb.User();
    var old_password = "oldPassword";
    var new_password = "newPassword";
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/user/pass",
      URI: platformUrl,
      body: {
        old_password,
        new_password
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    user.setPassword(old_password, new_password, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
