describe('traffic', function() {
  beforeEach(function() {
    window.matrix.settings = {
      profileId: ''
    };
    subject =  window.matrix.content;
    sandbox = sinon.sandbox.create();
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    sandbox.restore();
    server.restore();
  });
  it('empty pages', function() {
    expect(subject.pages).to.eql([]);
  });
  describe('#init', function() {
    it("calls reload", function() {
      mock = sandbox.mock(subject).expects("reload").once();
      subject.init();
      mock.verify();
    });
    it("calls reload with interval of 30 minute", function() {
      clock = sinon.useFakeTimers(Date.now());
      mock = sandbox.mock(subject).expects("reload").twice();
      subject.init();
      clock.tick(1800000);
      mock.verify();
      clock.restore();
    });
  });
  describe('#reload', function() {
    it("calls endpoint", function() {
      sandbox.stub(d3, "json");
      mock = sandbox.mock(subject).expects("endpoint").once();
      subject.reload();
      mock.verify();
    });
    context('json returned', function(){
      beforeEach(function() {
        stub = sandbox.stub(d3, 'json');
      });
      it("calls parseResponse", function() {
        mock = sandbox.mock(subject).expects("parseResponse").once();
        subject.reload();
        stub.callArgWith(1, {}, {});
        mock.verify();
      });
    });
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      expect(subject.endpoint()).to.eql('/realtime?ids=ga:&metrics=rt:pageviews&dimensions=rt:pageTitle,rt:pagePath&max-results=10&sort=-rt%3Apageviews');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
      expect(subject.endpoint()).to.eql('/realtime?ids=ga:Test&metrics=rt:pageviews&dimensions=rt:pageTitle,rt:pagePath&max-results=10&sort=-rt%3Apageviews');
      });
    });
  });
});
