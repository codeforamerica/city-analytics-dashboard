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
  it('has initial points', function() {
    expect(subject.pages).to.eql([]);
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
