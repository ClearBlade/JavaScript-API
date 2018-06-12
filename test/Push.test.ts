/*
 * Tests for the push messaging components of the ClearBlade JavaScript SDK
 */

import { cb, platformUrl, systemKey } from "./utils";

describe("ClearBlade Push messaging", function() {
  // cb.init({ systemKey, systemSecret: "fake" });
  it("sends a push message", function() {
    var users = ["user1", "user2", "user3"],
      payload = {
        // I have no idea what's supposed to go here
        alert: "hello"
      },
      appId = "someIDSuppliedByApple",
      callNum = ClearBlade.request.mock.calls.length,
      expectedData = {
        method: "POST",
        endpoint: `api/v/1/push/${systemKey}`,
        URI: platformUrl,
        body: {
          cbids: ["user1", "user2", "user3"],
          "apple-message": JSON.stringify({
            aps: {
              alert: "hello"
            }
          }),
          appid: "someIDSuppliedByApple"
        },
        user: {
          email: "test@fake.com",
          authToken: "testUserToken"
        }
      };
    cb.sendPush(users, payload, appId, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
