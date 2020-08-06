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
