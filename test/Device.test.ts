/*
 * JavaScript tests to test the device table functionality
 */

import { cb, platformUrl } from "./utils";

var device: Device;
var query: QueryObj;
beforeEach(function() {
  device = cb.Device();
  query = cb.Query();
});

describe("ClearBlade Device", function() {
  it("gets device info by name", function() {
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

  it("updates a device's information by name", function() {
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

  it("deletes a device's information by name", function() {
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/2/devices/fakeSystemKey/fakeName",
      URI: platformUrl,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.deleteDeviceByName("fakeName", function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch list of all devices", function() {
    var expectedData = {
      method: "GET",
      endpoint: "api/v/2/devices/fakeSystemKey",
      URI: platformUrl,
      qs: "query=%7B%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.fetch(query, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("updates all devices", function() {
    var newData = {
      state: "on",
      causeTrigger: false
    };
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/2/devices/fakeSystemKey",
      URI: platformUrl,
      body: { $set: newData, query: undefined },
      causeTrigger: false,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.update(query, newData, false, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("deletes all devices", function() {
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/2/devices/fakeSystemKey",
      URI: platformUrl,
      qs: "query=%5B%5D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.delete(query, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("creates a device", function() {
    var newDevice = {
      name: "fakeDevice",
      type: "device"
    };
    var expectedData = {
      method: "POST",
      endpoint: "api/v/2/devices/fakeSystemKey/fakeDevice",
      URI: platformUrl,
      body: newDevice,
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    var callNum = ClearBlade.request.mock.calls.length;
    device.create(newDevice, function(err, body) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
