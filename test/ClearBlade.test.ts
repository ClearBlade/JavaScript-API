import { cb, mockRequest } from "./utils";

describe("ClearBlade initialization should", function () {
  beforeEach(function () {
    var initOptions = {
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
    };
    cb.init(initOptions);
  });

  it("have the systemKey stored", function () {
    expect(cb.systemKey).toEqual("fakeSystemKey");
  });

  it("have the systemSecret stored", function () {
    expect(cb.systemSecret).toEqual("fakeSystemSecret");
  });

  it("have defaulted the URI to the Platform", function () {
    expect(cb.URI).toEqual("https://platform.clearblade.com");
  });

  it("have defaulted the logging to false", function () {
    expect(cb.logging).toEqual(false);
  });

  it("have defaulted the callTimeout to 30000", function () {
    expect(cb._callTimeout).toEqual(30000);
  });
});

describe("ClearBlade user setup", function () {
  beforeEach(function () {
    var initOptions = {
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
    };
    cb.init(initOptions);
  });

  it("should register a new user correctly", function () {
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    cb.registerUser("test@fake.com", "testPass", function (err, data) {});
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/reg",
      useUser: true,
      user: {
        email: "test@fake.com",
        authToken: undefined,
      },
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      authToken: undefined,
      timeout: 30000,
      URI: "https://platform.clearblade.com",
      body: {
        email: "test@fake.com",
        password: "testPass",
      },
    };
    // expect(mockRequest.calls.argsFor(callNum)[0]).toEqual(expectedData);
    expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
  });

  it("should login as anon", function () {
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    cb.loginAnon(function (err, data) {});
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/anon",
      useUser: false,
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      timeout: 30000,
      URI: "https://platform.clearblade.com",
    };
    expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
  });

  it("should login as user", function () {
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    var initOptions = {
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      email: "test@fake.com",
      password: "testPass",
    };
    cb.init(initOptions);
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/auth",
      useUser: false,
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      timeout: 30000,
      URI: "https://platform.clearblade.com",
      body: {
        email: "test@fake.com",
        password: "testPass",
      },
    };
    expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
  });

  it("should check to see if the user is authed", function () {
    cb.setUser("test@fake.com", "testUserToken");
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    cb.isCurrentUserAuthenticated(function (err, data) {});
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/checkauth",
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      timeout: 30000,
      URI: "https://platform.clearblade.com",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
  });

  it("should log out user", function () {
    cb.setUser("test@fake.com", "testUserToken");
    var callNum = mockRequest.mock.calls.length; // we get the call count so we can grab the right call later
    cb.logoutUser(function (err, data) {});
    var expectedData = {
      method: "POST",
      endpoint: "api/v/1/user/logout",
      systemKey: "fakeSystemKey",
      systemSecret: "fakeSystemSecret",
      timeout: 30000,
      URI: "https://platform.clearblade.com",
      user: {
        email: "test@fake.com",
        authToken: "testUserToken",
      },
    };
    expect(mockRequest.mock.calls[callNum][0]).toEqual(expectedData);
  });
});
