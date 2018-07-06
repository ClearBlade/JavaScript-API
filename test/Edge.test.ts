/*
 * Javascript tests for Edges
 */

import { cb, platformUrl } from "./utils";

var edge: Edge;
beforeAll(function() {
  edge = cb.Edge();
});

describe("ClearBlade Edges", function() {
  it("create edge", function() {
    const callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeEdge";
    var newData = {
      newData: "newData"
    };
    var expectedData = {
      method: "POST",
      URI: platformUrl,
      endpoint: "api/v/3/edges/fakeSystemKey/fakeEdge",
      body: newData,
      user: {
        authToken: "testUserToken",
        email: "test@fake.com"
      }
    };
    edge.create(newData, name, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update an edge by name", function() {
    const callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeEdge";
    var newData = {
      newData: "newData"
    };
    var expectedData = {
      method: "PUT",
      URI: platformUrl,
      endpoint: "api/v/3/edges/fakeSystemKey/fakeEdge",
      body: newData,
      user: {
        authToken: "testUserToken",
        email: "test@fake.com"
      }
    };
    edge.updateEdgeByName(name, newData, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("delete an edge by name", function() {
    const callNum = ClearBlade.request.mock.calls.length;
    var name = "fakeEdge";
    var newData = {
      newData: "newData"
    };
    var expectedData = {
      method: "DELETE",
      URI: platformUrl,
      endpoint: "api/v/3/edges/fakeSystemKey/fakeEdge",
      user: {
        authToken: "testUserToken",
        email: "test@fake.com"
      }
    };
    edge.deleteEdgeByName(name, function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
