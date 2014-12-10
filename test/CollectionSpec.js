/*
 * Javascript tests for Collections
 */

describe("ClearBlade Collections", function () {
  it("can fetch with id", function() {
    var col = cb.Collection({
      collectionID: "fakeCollectionID"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'GET',
      endpoint: 'api/v/1/data/fakeCollectionID',
      URI: undefined,
      qs: 'query=%7B%22FILTERS%22%3A%5B%5D%7D',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    col.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can fetch with name", function () {
    var col = cb.Collection({
      collectionName: "fakeCollectionName"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'GET',
      endpoint: 'api/v/1/collection/fakeSystemKey/fakeCollectionName',
      URI: undefined,
      qs: 'query=%7B%22FILTERS%22%3A%5B%5D%7D',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    col.fetch(function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can create with id", function() {
    var col = cb.Collection({
      collectionID: "fakeCollectionID"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/data/fakeCollectionID',
      URI: undefined,
      body: {
	column1: "val1",
	column2: "val2"
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var newItem = {
      column1: "val1",
      column2: "val2"
    };
    col.create(newItem, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can create with name", function() {
    var col = cb.Collection({
      collectionName: "fakeCollectionName"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'POST',
      endpoint: 'api/v/1/collection/fakeSystemKey/fakeCollectionName',
      URI: undefined,
      body: {
	column1: "val1",
	column2: "val2"
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var newItem = {
      column1: "val1",
      column2: "val2"
    };
    col.create(newItem, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can update with id", function() {
    var col = cb.Collection({
      collectionID: "fakeCollectionID"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'PUT',
      endpoint: 'api/v/1/data/fakeCollectionID',
      body: {
	$set: {
	  column1: "val1",
	  column2: "val2"
	},
	query: [[{EQ:[{name: 'john'}]}]]
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var changes = {
      column1: "val1",
      column2: "val2"
    };
    var query = cb.Query();
    query.equalTo('name', 'john');
    col.create(changes, query, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can update with name", function() {
    var col = cb.Collection({
      collectionName: "fakeCollectionName"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'PUT',
      endpoint: 'api/v/1/collection/fakeSystemKey/fakeCollectionName',
      body: {
	$set: {
	  column1: "val1",
	  column2: "val2"
	},
	query: [[{EQ:[{name: 'john'}]}]]
      },
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var changes = {
      column1: "val1",
      column2: "val2"
    };
    var query = cb.Query();
    query.equalTo('name', 'john');
    col.create(changes, query, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can remove with id", function() {
    var col = cb.Collection({
      collectionID: "fakeCollectionID"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'DELETE',
      endpoint: 'api/v/1/data/fakeCollectionID',
      URI: undefined,
      qs: 'query=%5B%5B%7B%22EQ%22%3A%5B%7B%22name%22%3A%22john%22%7D%5D%7D%5D%5D',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var query = cb.Query();
    query.equalTo('name', 'john');
    col.remove(query, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });

  it("can remove with name", function() {
    var col = cb.Collection({
      collectionName: "fakeCollectionName"
    });
    var callNum = ClearBlade.request.calls.count(); // we get the call count so we can grab the right call
    var expectedData = {
      method: 'DELETE',
      endpoint: 'api/v/1/collection/fakeSystemKey/fakeCollectionName',
      URI: undefined,
      qs: 'query=%5B%5B%7B%22EQ%22%3A%5B%7B%22name%22%3A%22john%22%7D%5D%7D%5D%5D',
      user: {
	email: 'test@fake.com',
	authToken: 'testUserToken'
      }
    };
    var query = cb.Query();
    query.equalTo('name', 'john');
    col.remove(query, function (err, data) {
      expect(err).toBeNull();
      expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
    });
  });
});
