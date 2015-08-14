describe('traffic', function() {
  beforeEach(function() {
    window.matrix.settings = {
      profileId: ''
    };
    subject =  window.matrix.landing;
    sandbox = sinon.sandbox.create();
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    sandbox.restore();
    server.restore();
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      expect(subject.endpoint()).to.eql('/realtime?ids=ga:&metrics=ga:activeVisitors&dimensions=ga:pageTitle,ga:pagePath,rt:source&sort=-ga:activeVisitors&max-results=10000');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
      expect(subject.endpoint()).to.eq('/realtime?ids=ga:Test&metrics=ga:activeVisitors&dimensions=ga:pageTitle,ga:pagePath,rt:source&sort=-ga:activeVisitors&max-results=10000');
      });
    });
  });
});
