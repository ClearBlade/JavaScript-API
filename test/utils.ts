import '../lib/mqttws31';
import '../index';

const platformUrl = 'http://fakeUrl.com';
const systemKey = 'fakeSystemKey';

const cb = new ClearBlade();
cb.init({
  systemKey,
  systemSecret: 'fake',
  useUser: { email: 'test@fake.com', authToken: 'testUserToken' },
  URI: platformUrl,
});
cb.setUser('test@fake.com', 'testUserToken');

ClearBlade.request = jest.fn(({}, cb) => cb(null, { fake: 'data', DATA: [] }));

export { cb, platformUrl, systemKey };

export const getMessageTopic = (
  destinationName: string,
  callbackDict: Record<string, Function>
): string | undefined => {
  const destArr = destinationName.split('/');
  for (const topic in callbackDict) {
    const topicArr = topic.split('/');
    for (let i = 0; i < destArr.length; i++) {
      if (topicArr[i] === '#') {
        return topic;
      }
      if (destArr[i] !== topicArr[i] && topicArr[i] !== '+') {
        break;
      }
      if (i === destArr.length - 1) {
        return topic;
      }
    }
  }
};
