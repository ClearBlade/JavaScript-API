/*
 * Javascript tests for Items
 */

import { cb, platformUrl } from "./utils";

describe("ClearBlade Items", function() {
  it("save item", function() {
    var item = cb.Item({ item_id: 1, name: "john" }, "fakeCollectionID");
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      body: {
        $set: { item_id: 1, name: "john" },
        query: [[{ EQ: [{ item_id: 1 }] }]]
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    item.save(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("refresh item", function() {
    var item = cb.Item({ item_id: 1, name: "john" }, "fakeCollectionID");
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs:
        "query=%7B%22FILTERS%22%3A%5B%5B%7B%22EQ%22%3A%5B%7B%22item_id%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    item.refresh(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("destroy item", function() {
    var item = cb.Item({ item_id: 1, name: "john" }, "fakeCollectionID");
    var callNum = ClearBlade.request.mock.calls.length;
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs:
        "query=%7B%22FILTERS%22%3A%5B%5B%7B%22EQ%22%3A%5B%7B%22item_id%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken"
      }
    };
    item.destroy(function(err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
