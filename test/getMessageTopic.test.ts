import { getMessageTopic } from "../index";

describe("get message topic", function () {
  it("prefers exact match over wildcard", function () {
    const destinationName = "dbupdate/_monitor/_asset/123/locationAndStatus";
    const callbackDict = {
      "dbupdate/_monitor/_asset/+/locationAndStatus": () => {},
      "dbupdate/_monitor/_asset/123/locationAndStatus": () => {},
      "placeholder/+": () => {},
    };
    expect(getMessageTopic(destinationName, callbackDict)).toBe(
      "dbupdate/_monitor/_asset/123/locationAndStatus"
    );
  });
  it("match identical destination and topic", function () {
    const destinationName = "dbupdate/_monitor/_area/123/status";
    const callbackDict = {
      "dbupdate/_monitor/_area/123/status": () => {},
      "placeholder/+": () => {},
      "dbupdate/placeholder/_monitor/two": () => {},
    };

    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual("dbupdate/_monitor/_area/123/status");
  });
  it("match destination to topic with only +", function () {
    const destinationName = "dbupdate/_monitor/_area/123/status";
    const callbackDict = {
      "dbupdate/_monitor/_area/different/status": () => {},
      "placeholder/+": () => {},
      "dbupdate/placeholder/_monitor/two": () => {},
      "+/+/+/+/+": () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual("+/+/+/+/+");
  });
  it("match destination to topic that includes +", function () {
    const destinationName = "dbupdate/_monitor/_area/123/status";
    const callbackDict = {
      "dbupdate/_monitor/_area/+/status": () => {},
      "placeholder/+": () => {},
      "dbupdate/placeholder/_monitor/two": () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual("dbupdate/_monitor/_area/+/status");
  });
  it("match destination to topic with only #", function () {
    const destinationName = "dbupdate/_monitor/_area/123/status";
    const callbackDict = {
      "dbupdate/_monitor/_area/different/status": () => {},
      "placeholder/+": () => {},
      "dbupdate/placeholder/_monitor/two": () => {},
      "#": () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual("#");
  });
  it("match destination to topic that includes #", function () {
    const destinationName = "dbupdate/_monitor/_area/123/status";
    const callbackDict = {
      "dbupdate/_monitor/_area/different/status": () => {},
      "placeholder/+": () => {},
      "dbupdate/placeholder/_monitor/two": () => {},
      "dbupdate/_monitor/_area/#": () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual("dbupdate/_monitor/_area/#");
  });
});
