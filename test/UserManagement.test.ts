/*
 * Javascript tests for Triggers
 */

import { cb, platformUrl, mockRequest } from "./utils";

var userMgmt: UserManagementAPI;
beforeEach(function () {
  userMgmt = cb.UserManagement();
});

describe("ClearBlade UserManagement", function () {
  it("updates user", function () {
    var callNum = mockRequest.mock.calls.length;
    var id = "fakeId";
    var body = {
      user: id,
      changes: {
        password: "new",
        roles: {
          add: [],
          delete: [],
        },
      },
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/4/user/manage",
      method: "PUT",
      body,
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    userMgmt.update(body, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
