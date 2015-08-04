describe('traffic', function() {
  beforeEach(function() {
    window.matrix.settings = {
      profileId: ''
    };
    subject =  window.matrix.traffic;
    sandbox = sinon.sandbox.create();
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    sandbox.restore();
    server.restore();
  });
  it('has initial points', function() {
    expect(subject.points).to.eq(720);
  });
  it('has empty counts', function() {
    expect(subject.counts).to.eql([]);
  });
  it('has interval of 2 minutes', function() {
    expect(subject.interval).to.eq(120000);
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      expect(subject.endpoint()).to.eql('/realtime?ids=ga:&metrics=rt:activeUsers&max-results=10');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
        expect(subject.endpoint()).to.eql('/realtime?ids=ga:Test&metrics=rt:activeUsers&max-results=10');
      });
    });
  });
  describe('#historic', function() {
    it('returns the path to the servers historic endpoint', function() {
      expect(subject.historic()).to.eql('/historic?ids=ga:&dimensions=ga%3AnthMinute&metrics=ga%3Asessions&start-date=2015-08-03&end-date=2015-08-04&max-results=1000');
    });
  });
  describe('#init', function() {
    it('sets the count to the points value', function() {
      subject.init();
      expect(subject.counts.length).to.eq(subject.points);
    });
    it('fills the counts with zeros', function() {
      subject.points = 1;
      subject.init();
      expect(subject.counts[0]).to.eq(0);
    });
    it('calls the historic endpoint', function() {
      mock = sandbox.mock(subject).expects('historic').returns('');
      subject.init();
      mock.verify();
    });
  });
});
