import { getMessageTopic } from './utils';

describe('get message topic', function () {
  it('match identical destination and topic', function () {
    const destinationName = 'dbupdate/_monitor/_area/123/status';
    const callbackDict = {
      'dbupdate/_monitor/_area/123/status': () => {},
      'placeholder/+': () => {},
      'dbupdate/placeholder/_monitor/two': () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual('dbupdate/_monitor/_area/123/status');
  });
  it('match destination to topic with only +', function () {
    const destinationName = 'dbupdate/_monitor/_area/123/status';
    const callbackDict = {
      'dbupdate/_monitor/_area/different/status': () => {},
      'placeholder/+': () => {},
      'dbupdate/placeholder/_monitor/two': () => {},
      '+/+/+/+/+': () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual('+/+/+/+/+');
  });
  it('match destination to topic that includes +', function () {
    const destinationName = 'dbupdate/_monitor/_area/123/status';
    const callbackDict = {
      'dbupdate/_monitor/_area/+/status': () => {},
      'placeholder/+': () => {},
      'dbupdate/placeholder/_monitor/two': () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual('dbupdate/_monitor/_area/+/status');
  });
  it('match destination to topic with only #', function () {
    const destinationName = 'dbupdate/_monitor/_area/123/status';
    const callbackDict = {
      'dbupdate/_monitor/_area/different/status': () => {},
      'placeholder/+': () => {},
      'dbupdate/placeholder/_monitor/two': () => {},
      '#': () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual('#');
  });
  it('match destination to topic that includes #', function () {
    const destinationName = 'dbupdate/_monitor/_area/123/status';
    const callbackDict = {
      'dbupdate/_monitor/_area/different/status': () => {},
      'placeholder/+': () => {},
      'dbupdate/placeholder/_monitor/two': () => {},
      'dbupdate/_monitor/_area/#': () => {},
    };
    const topic = getMessageTopic(destinationName, callbackDict);

    expect(topic).toEqual('dbupdate/_monitor/_area/#');
  });
});
