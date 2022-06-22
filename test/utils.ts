import "../lib/mqttws31";
import { ClearBlade } from "../index";

const platformUrl = "http://fakeUrl.com";
const systemKey = "fakeSystemKey";

const mockRequest = jest.fn(({}, cb) => {
  cb(null, { fake: "data", DATA: [] });
});
const cb = new ClearBlade({
  request: mockRequest,
});

cb.init({
  systemKey,
  systemSecret: "fake",
  useUser: { email: "test@fake.com", authToken: "testUserToken" },
  URI: platformUrl,
});
cb.setUser("test@fake.com", "testUserToken");

export { cb, platformUrl, systemKey, mockRequest, ClearBlade };
