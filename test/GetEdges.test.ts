/*
 * Tests for getting the list of edges on a system
 */

import { cb, platformUrl } from "./utils";

describe("ClearBlade Get Edges", function() {
  it("gets a list of edges", function() {
    const callNum = ClearBlade.request.mock.calls.length;
    const expectedData = {
      method: "GET",
      endpoint: "api/v/2/edges/fakeSystemKey",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    cb.getEdges(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
