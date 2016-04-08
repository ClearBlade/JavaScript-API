/*
 * JavaScript tests to test the user functionality
 */

describe("ClearBlade Users", function () {
  it("gets user info", function () {
    var user = cb.User();
    var expectedData = {
      method: 'GET',
      endpoint: 'api/v/1/user/info',
      URI: undefined,
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var callNum = ClearBlade.request.calls.count();
    user.getUser(function (err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("Updates a users information", function () {
    var user = cb.User();
    var expectedData = {
      method: 'PUT',
      endpoint: 'api/v/1/user/info',
      URI: undefined,
      body: {
	height: 70
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var callNum = ClearBlade.request.calls.count();
    user.setUser({height: 70}, function (err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("Gets all the users", function () {
    var user = cb.User();
    var expectedData = {
      method: 'GET',
      endpoint: 'api/v/1/user',
      URI: undefined,
      qs: '',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var callNum = ClearBlade.request.calls.count();
    user.allUsers(function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });
});
