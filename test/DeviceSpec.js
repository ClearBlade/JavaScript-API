/*
 * JavaScript tests to test the device table functionality
 */

describe("ClearBlade Device", function(){
	it("gets device info", function() {
		var device = cb.Device();
		var expectedData = {
			method: 'GET',
			endpoint: "api/v/2/devices/fakeSystemKey/fakeName",
			URI: undefined,
			user: {
				email: "test@fake.com",
				authToken: "testUserToken"
			}
		};
		var callNum = ClearBlade.request.calls.count();
		device.getDeviceByName("fakeName", function (err, body){
			expect(err).toBeNull();
      		expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
		});
	});

	it("Updates a device's information", function () {
		var device = cb.Device();
		var expectedData = {
			method: 'PUT',
			endpoint: "api/v/2/devices/fakeSystemKey/fakeName",
			URI: undefined,
			body: {
				state: "on",
				causeTrigger: false
			},
			user: {
				email: "test@fake.com",
				authToken: "testUserToken"
			}
		};
		var callNum = ClearBlade.request.calls.count();
		device.updateDevice("fakeName", {state:"on"}, false, function (err, body) {
			expect(err).toBeNull();
      		expect(ClearBlade.request.calls.argsFor(callNum)[0]).toEqual(expectedData);
		});
	});
});