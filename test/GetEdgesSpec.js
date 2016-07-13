/*
 * Tests for getting the list of edges on a system
 */

describe("ClearBlade Get Edges", function () {
  it("gets a list of edges", function () {
    
	callNum = ClearBlade.request.calls.count(),
	expectedData = {
	  method: 'GET',
	  endpoint: 'api/v/2/edges/fakeSystemKey',
      URI: undefined,
	  user: {
	    email: 'test@fake.com',
	    authToken: 'testUserToken'
	  }
	};
    cb.getEdges(function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });
});
