/*
 * JavaScript tests to test the code functionality
 */

import { cb, platformUrl } from "./utils";

describe("ClearBlade code", function() {
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
