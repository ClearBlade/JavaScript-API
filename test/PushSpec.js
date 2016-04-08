/*
 * Tests for the push messaging components of the ClearBlade JavaScript SDK
 */

describe("ClearBlade Push messaging", function () {
  it("sends a push message", function () {
    var users = ['user1', 'user2', 'user3'],
	payload = { // I have no idea what's supposed to go here
	  alert: 'hello'
	},
	appId = 'someIDSuppliedByApple',
	callNum = ClearBlade.request.calls.count(),
	expectedData = {
	  method: 'POST',
	  endpoint: 'api/v/1/push/fakeSystemKey',
    URI: undefined,
	  body: {
	    cbids: ['user1', 'user2', 'user3'],
	    "apple-message": JSON.stringify({
	      aps: {
		alert: 'hello'
	      }
	    }),
	    appid: 'someIDSuppliedByApple'
	  },
	  user: {
	    email: 'test@fake.com',
	    authToken: 'testUserToken'
	  }
	};
    cb.sendPush(users, payload, appId, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });
});
