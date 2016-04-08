/*
 * JavaScript tests to test the code functionality
 */

describe("ClearBlade code", function() {
  it("executes given code service with params", function () {
    var code = cb.Code()
    var callNum = ClearBlade.request.calls.count() // we need this for later
    var params = {
      name: 'charlie',
      age: 23
    };
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/code/fakeSystemKey/fakeCodeService',
      URI: undefined,
      body: {
	name: 'charlie',
	age: 23
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    code.execute('fakeCodeService', params, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });
});
