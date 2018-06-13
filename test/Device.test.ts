/*
 * JavaScript tests to test the device table functionality
 */

import { cb, platformUrl } from "./utils";

describe("ClearBlade Device", function() {
  it("gets device info", function() {
    var device = cb.Device();
    var expectedData = {
      method: "GET",
      endpoint: "api/v/2/devices/fakeSystemKey/fakeName",
      URI: platformUrl,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.getDeviceByName("fakeName", function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("Updates a device's information", function() {
    var device = cb.Device();
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/2/devices/fakeSystemKey/fakeName",
      URI: platformUrl,
      body: {
        state: "on",
        causeTrigger: false
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.updateDeviceByName("fakeName", { state: "on" }, false, function(
      err,
      body
    ) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
