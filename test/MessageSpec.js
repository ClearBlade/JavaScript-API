describe("ClearBlade Messaging", function () {
  it("connects to MQTT broker", function () {
    var user = cb.Messaging({}, function(err, data) {
      expect(err).toBeNull();
    });
  });
