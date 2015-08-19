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
  describe('#parseResponse', function() {
    context("error parsing json", function() {
      it("does not display the results", function() {
        mock = sandbox.mock(subject).expects("displayResults").never();
        subject.parseResponse({}, null);
        mock.verify();
      });
    });
    context("no error parsing json", function() {
      context("has data from GA", function() {
        beforeEach(function() {
          data = { rows: [["Titel 1","url 1","DESKTOP","1"]] };
          subject.pages = [];
        });
        it("displays the results", function() {
          mock = sandbox.mock(subject).expects("displayResults").once();
          subject.parseResponse(null, {rows: []});
          mock.verify();
        });
        it("adds new items to pages", function() {
          sandbox.stub(subject, "displayResults");
          expect(function() {
            return subject.pages.length;
          }).to.change.by(1).when(function() { subject.parseResponse(null, data)});
        });
        it("adds new items to terms", function() {
          sandbox.stub(subject, "displayResults");
          result = { title: 'Titel 1', url: "url 1", visits: 1 };
          subject.parseResponse(null, data);
          expect(subject.pages[0]).to.eql(result);
        });
      });
      context("no rows (no data from GA)", function() {
        it("does not parse data", function() {
          sandbox.stub(subject, "displayResults");
          expect(function() {
            return subject.pages.length;
          }).to.not.change.when(function() { subject.parseResponse(null, {})});
        });
      });
    });
    it("calls the template rendering", function() {
      templateSpy = sandbox.spy();
      window.matrix.template = templateSpy;
      subject.displayResults();
      expect(templateSpy).to.have.been.calledOnce
    });
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      expect(subject.endpoint()).to.eql('/historic?ids=ga:&metrics=ga:pageviews&dimensions=ga:pageTitle,ga:pagePath,ga:deviceCategory&start-date=today&end-date=today&max-results=1000&sort=-ga%3Apageviews');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
      expect(subject.endpoint()).to.eql('/historic?ids=ga:Test&metrics=ga:pageviews&dimensions=ga:pageTitle,ga:pagePath,ga:deviceCategory&start-date=today&end-date=today&max-results=1000&sort=-ga%3Apageviews');
      });
    });
  });
});
