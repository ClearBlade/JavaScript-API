/*
 * Javascript tests for Triggers
 */

import { cb, platformUrl } from "./utils";

var triggers: Triggers;
beforeEach(function() {
  triggers = cb.Triggers();
});

describe("ClearBlade Triggers", function() {
  it("fetches trigger definitions", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      URI: platformUrl,
      endpoint: "admin/triggers/definitions",
      method: "GET",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    triggers.fetchDefinitions(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("creates trigger", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeTrigger";
    var newTrigger = {
      data: "data"
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/code/fakeSystemKey/trigger/fakeTrigger",
      method: "POST",
      body: newTrigger,
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    triggers.create(name, newTrigger, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("updates trigger", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeTrigger";
    var newTrigger = {
      newData: "newData"
    };
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/code/fakeSystemKey/trigger/fakeTrigger",
      method: "PUT",
      body: newTrigger,
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    triggers.update(name, newTrigger, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("deletes trigger", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeTrigger";
    var expectedData = {
      URI: platformUrl,
      endpoint: "api/v/3/code/fakeSystemKey/trigger/fakeTrigger",
      method: "DELETE",
      user: { authToken: "testUserToken", email: "test@fake.com" }
    };
    triggers.delete(name, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
