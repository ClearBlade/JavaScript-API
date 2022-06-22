/*
 * This is the spec file for testing the query functions
 */

import { cb, platformUrl, mockRequest } from "./utils";

describe("single query operators", function () {
  it("equal to", function () {
    var query = cb.Query();
    query.equalTo("name", "john");
    var expectedQuery = [[{ EQ: [{ name: "john" }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("greater than", function () {
    var query = cb.Query();
    query.greaterThan("age", 23);
    var expectedQuery = [[{ GT: [{ age: 23 }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("less than", function () {
    var query = cb.Query();
    query.lessThan("age", 44);
    var expectedQuery = [[{ LT: [{ age: 44 }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("greater than or equal to", function () {
    var query = cb.Query();
    query.greaterThanEqualTo("age", 18);
    var expectedQuery = [[{ GTE: [{ age: 18 }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("less than or equal to", function () {
    var query = cb.Query();
    query.lessThanEqualTo("age", 18);
    var expectedQuery = [[{ LTE: [{ age: 18 }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("not equal to", function () {
    var query = cb.Query();
    query.notEqualTo("name", "john");
    var expectedQuery = [[{ NEQ: [{ name: "john" }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("regex match", function () {
    var query = cb.Query();
    query.matches("name", "Smith$");
    var expectedQuery = [[{ RE: [{ name: "Smith$" }] }]];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });
});

describe("More complex queries", function () {
  it("A few equality clauses ANDed together", function () {
    var query = cb.Query();
    query.equalTo("name", "john");
    query.equalTo("age", 23);
    query.equalTo("email", "test@fake.com");
    var expectedQuery = [
      [{ EQ: [{ name: "john" }, { age: 23 }, { email: "test@fake.com" }] }],
    ];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("Multiple Operators joined by ANDs", function () {
    var query = cb.Query();
    query.equalTo("name", "john");
    query.greaterThan("age", 23);
    query.lessThan("weight", 200);
    query.matches("email", "@fake.com$");
    var expectedQuery = [
      [
        { EQ: [{ name: "john" }] },
        { GT: [{ age: 23 }] },
        { LT: [{ weight: 200 }] },
        { RE: [{ email: "@fake.com$" }] },
      ],
    ];
    expect(query.query.FILTERS).toEqual(expectedQuery);
  });

  it("Multiple queries with an OR", function () {
    var query1 = cb.Query(),
      query2 = cb.Query(),
      query3 = cb.Query();
    query1.equalTo("name", "john");
    query2.equalTo("age", 23);
    query3.equalTo("email", "test@fake.com");
    query1.or(query2).or(query3);
    var expectedQuery = [
      [{ EQ: [{ name: "john" }] }],
      [{ EQ: [{ age: 23 }] }],
      [{ EQ: [{ email: "test@fake.com" }] }],
    ];
    expect(query1.query.FILTERS).toEqual(expectedQuery);
  });

  it("fetch getFieldValue", () => {
    const q = cb.Query();
    const field = "user_id";
    const val = "some_user_id";
    q.equalTo(field, val);
    const resp = q.getFieldValue(field);
    expect(resp).toEqual({ [field]: val });
  });
});

describe("query calls", function () {
  it("fetch with a simple equality query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.equalTo("name", "john");
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22EQ%22%3A%5B%7B%22name%22%3A%22john%22%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update with a simple equality query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.equalTo("name", "john");
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      body: {
        query: [[{ EQ: [{ name: "john" }] }]],
        $set: { name: "Bill" },
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.update({ name: "Bill" }, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("remove with a simple equality query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.equalTo("name", "john");
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22EQ%22%3A%5B%7B%22name%22%3A%22john%22%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.remove(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch with a simple greater than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.greaterThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22GT%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update with a simple greater than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.greaterThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      body: {
        query: [[{ GT: [{ num: 1 }] }]],
        $set: { num: 2 },
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.update({ num: 2 }, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("remove with a simple greater than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.greaterThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22GT%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.remove(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch with a simple less than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22LT%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update with a simple less than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      body: {
        query: [[{ LT: [{ num: 1 }] }]],
        $set: { num: 2 },
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.update({ num: 2 }, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("remove with a simple less than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThan("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22LT%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.remove(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("fetch with a simple less than or equal to query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThanEqualTo("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22LTE%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("update with a simple less than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThanEqualTo("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "PUT",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      body: {
        query: [[{ LTE: [{ num: 1 }] }]],
        $set: { num: 2 },
      },
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.update({ num: 2 }, function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("remove with a simple less than query", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.lessThanEqualTo("num", 1);
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22FILTERS%22%3A%5B%5B%7B%22LTE%22%3A%5B%7B%22num%22%3A1%7D%5D%7D%5D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.remove(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("sorts in ascending order", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.ascending("name");
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22SORT%22%3A%5B%7B%22ASC%22%3A%22name%22%7D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });

  it("sorts in descending order", function () {
    var query = cb.Query({ collectionID: "fakeCollectionID" });
    query.descending("name");
    var callNum = mockRequest.mock.calls.length;
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/data/fakeCollectionID",
      URI: platformUrl,
      qs: "query=%7B%22SORT%22%3A%5B%7B%22DESC%22%3A%22name%22%7D%5D%7D",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    query.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
    });
  });
});
