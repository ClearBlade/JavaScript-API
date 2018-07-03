/*
 * Javascript tests for Portals
 */

import { cb, platformUrl } from "./utils";

var portal: Portal;
beforeAll(function() {
  portal = cb.Portal("fakePortal");
});

describe("ClearBlade Portals", function() {
  it("fetches portal data", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/portals/fakeSystemKey/fakePortal",
      method: "GET",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    portal.fetch(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("updates portal", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var newData = {
      name: "newFakePortalName"
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/portals/fakeSystemKey/fakePortal",
      body: newData,
      method: "PUT",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    portal.update(newData, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
