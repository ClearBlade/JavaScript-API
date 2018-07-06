/*
 * Javascript tests for Triggers
 */

import { cb, platformUrl } from "./utils";

var roles: Roles;
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
});
