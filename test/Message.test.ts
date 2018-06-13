import { cb, platformUrl } from "./utils";

var msg;
beforeEach(function() {
  spyOn(Paho.MQTT, "Client").and.callFake(function() {
    return {
      connect: function() {}
    };
  });
  cb.user = {};
  cb.user.authToken = "testUserToken";
  msg = cb.Messaging({}, function() {});
});

describe("get message history test", function() {
  it("calls get message history", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    msg.getMessageHistory("topic", 1000, 10, function() {});
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/message/fakeSystemKey",
      qs: "topic=topic&count=10&last=1000&start=-1&stop=-1",
      authToken: "testUserToken",
      timeout: 30000,
      URI: platformUrl
    };
    expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
  });

  it("calls get message history with timeframe", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    msg.getMessageHistoryWithTimeFrame(
      "topic",
      25,
      -1,
      12345,
      123456,
      function() {}
    );
    var expectedData = {
      method: "GET",
      endpoint: "api/v/1/message/fakeSystemKey",
      qs: "topic=topic&count=25&last=-1&start=12345&stop=123456",
      authToken: "testUserToken",
      timeout: 30000,
      URI: platformUrl
    };
    expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
  });
});

describe("delete message history test", function() {
  it("calls get and delete message history", function() {
    var callNum = ClearBlade.request.mock.calls.length;
    msg.getAndDeleteMessageHistory(
      "topic",
      25,
      -1,
      12345,
      123456,
      function() {}
    );
    var expectedData = {
      method: "DELETE",
      endpoint: "api/v/1/message/fakeSystemKey",
      qs: "topic=topic&count=25&last=-1&start=12345&stop=123456",
      authToken: "testUserToken",
      timeout: 30000,
      URI: platformUrl
    };
    expect(ClearBlade.request.mock.calls[callNum][0]).toEqual(expectedData);
  });
});
