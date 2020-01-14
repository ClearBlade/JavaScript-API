/*
 * Javascript tests for Triggers
 */

import { cb, platformUrl } from "./utils";

var roles: RoleAPI;
beforeEach(function() {
  roles = cb.Roles();
});

describe("ClearBlade Roles", function() {
  it("updates roles", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var id = "fakeId";
    var changes = {};
    var body = {
      id,
      changes
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "PUT",
      body,
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    roles.update(id, changes, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch roles by user", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var id = "fakeId";
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "GET",
      qs: "user=fakeId",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    roles.fetch({ user: id }, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch roles by device", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var id = "fakeId";
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "GET",
      qs: "device=fakeId",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    roles.fetch({ device: id }, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch roles by query", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "GET",
      qs:
        "query=%7B%22FILTERS%22%3A%5B%5B%7B%22EQ%22%3A%5B%7B%22Name%22%3A%22Authenticated%22%7D%5D%7D%5D%5D%7D",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    var query = cb.Query();
    query.equalTo("Name", "Authenticated");
    roles.fetch({ query }, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("delete role", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "DELETE",
      qs: "role=blah",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };

    roles.delete("blah", function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("create role", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var theRole = {
      name: "new",
      description: "",
      collections: [],
      topics: [],
      services: [],
      servicecaches: []
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/user/roles/fakeSystemKey",
      method: "POST",
      body: theRole,
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };

    roles.create(theRole, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
