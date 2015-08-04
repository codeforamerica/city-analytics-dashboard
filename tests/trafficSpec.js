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
      expect(subject.endpoint()).to.eql('/realtime?ids=ga:&metrics=rt:activeUsers&dimensions=rt:deviceCategory&max-results=10');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
        expect(subject.endpoint()).to.eql('/realtime?ids=ga:Test&metrics=rt:activeUsers&dimensions=rt:deviceCategory&max-results=10');
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
    context('no json returned', function() {
      beforeEach(function() {
        stub = sandbox.stub(d3, 'json');
      });
      it('returns without reloading', function() {
        mock = sandbox.mock(subject).expects('reload').never();
        subject.init();
        stub.callArgWith(1, {}, null)
        mock.verify();
      });
    });
    context('returns json', function() {
      beforeEach(function() {
        stub = sandbox.stub(d3, 'json');
        subject.points = 1;
      });
      it('set the count to row value', function() {
        subject.init();
        stub.callArgWith(1, null, {rows: [["000000",1],["000001",1]]});
        expect(subject.counts[0]).to.eql(1);
      });
      it('reloads', function() {
        mock = sandbox.mock(subject).expects('reload').once();
        subject.init();
        stub.callArgWith(1, null, {rows: [["000000",1],["000001",1]]});
        mock.verify();
      });
    });
  });
  describe('#parseResponse', function() {
    context('realtime data', function() {
      beforeEach(function() {
        sparkline =  window.matrix.sparklineGraph('body',{});
        subject.sparkline = sandbox.stub(sparkline);
        realtimeData = { totalsForAllResults: { 'rt:activeUsers': 3 }, rows: [["DESKTOP", 1], ["MOBILE", 2]] };
      });
      it('sets the activeUser count on the el', function() {
        el = document.createElement();
        elMob = document.createElement();
        subject.el = el;
        subject.elMob = elMob;
        subject.parseResponse(realtimeData);
        expect(el.innerText).to.eq('1')
      });
      it('sets the mobile user count to #traffic-count-mobile', function() {
        $('body').append('<div id="traffic-count"></div>')
        $('body').append('<div id="traffic-count-mobile"></div>')
        subject.init()
        subject.parseResponse(realtimeData);
        expect($('#traffic-count-mobile')).to.have.text('2')
      });
      it('sets the activeUser count to #traffic-count', function() {
        $('body').append('<div id="traffic-count"></div>')
        $('body').append('<div id="traffic-count-mobile"></div>')
        subject.init()
        subject.parseResponse(realtimeData);
        expect($('#traffic-count')).to.have.text('1')
      });
    });
  });
});
