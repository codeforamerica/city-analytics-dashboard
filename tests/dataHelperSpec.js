describe('dataHelper', function() {
  beforeEach(function() {
    subject =  window.dataHelper;
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
    server.restore();
  });
  describe('findWithUrl', function() {
    beforeEach(function() {
      entry1 = { url: "test.de", title: "Test" };
      entry2 = { url: "test2.de", title: "Test 2" };
      data = [entry1, entry2];
    });
    it("returns object with the same url", function() {
      expect(subject.findWithUrl(data, "test.de")).to.eql(entry1);
    });
    it("returns undefined if url not found", function() {
      expect(subject.findWithUrl(data, "tost.de")).to.eql(undefined);
    });
    it("returns the first result not every", function() {
      entry2 = { url: "test.de", title: "Test 2" };
      data = [entry1, entry2];
      expect(subject.findWithUrl(data, "test.de")).to.eql(entry1);
    });
  });
});
