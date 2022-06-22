/*
 * Javascript tests for Analytics
 */

import { cb, platformUrl, mockRequest } from "./utils";

var analytics: Analytics;
beforeAll(function () {
  analytics = cb.Analytics();
});

describe("ClearBlade Analytics", function () {
  it("gets storage data", function () {
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/analytics/storage",
      method: "GET",
      qs: "query={}",
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    analytics.getStorage({}, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("gets count", function () {
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/analytics/count",
      method: "GET",
      qs: "query={}",
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    analytics.getCount({}, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("gets event list", function () {
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/analytics/eventlist",
      method: "GET",
      qs: "query={}",
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    analytics.getEventList({}, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("gets event totals", function () {
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/analytics/eventtotals",
      method: "GET",
      qs: "query={}",
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    analytics.getEventTotals({}, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("gets user events", function () {
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/2/analytics/userevents",
      method: "GET",
      qs: "query={}",
      user: { authToken: "testUserToken", email: "test@fake.com" },
    };
    analytics.getUserEvents({}, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
