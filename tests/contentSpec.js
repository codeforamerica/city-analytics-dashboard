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
      sandbox.stub(xhr, "json");
      mock = sandbox.mock(subject).expects("endpoint").once();
      subject.reload();
      mock.verify();
    });
    context('json returned', function(){
      beforeEach(function() {
        stub = sandbox.stub(xhr, 'json');
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
        it("displays the results", function() {
          mock = sandbox.mock(subject).expects("displayResults").once();
          subject.parseResponse(null, {rows: []});
          mock.verify();
        });
        it("parses the data", function() {
          data = {rows: []};
          sandbox.stub(subject, "displayResults");
          mock = sandbox.mock(subject).expects("parseData").withArgs(data).once();
          subject.parseResponse(null, data);
          mock.verify();
        });
        it("calls reorderData", function() {
          sandbox.stub(subject, "displayResults");
          sandbox.stub(subject, "parseData");
          mock = sandbox.mock(subject).expects("reorderData").once();
          subject.parseResponse(null, data);
          mock.verify();
        });
      });
      context("no rows (no data from GA)", function() {
        it("does not call parseData", function() {
          sandbox.stub(subject, "displayResults");
          mock = sandbox.mock(subject).expects("parseData").never();
          subject.parseResponse(null, {});
          mock.verify();
        });
        it("does not parse data", function() {
          sandbox.stub(subject, "displayResults");
          expect(function() {
            return subject.pages.length;
          }).to.not.change.when(function() { subject.parseResponse(null, {})});
        });
      });
    });
    it("calls the template rendering", function() {
      mock = sandbox.mock(window.templateHelper).expects("renderTemplate").once();
      subject.displayResults();
      mock.verify();
    });
  });
  describe('#parseData', function() {
    beforeEach(function() {
      data = { rows: [["Titel 1","url 1","DESKTOP","1"]] };
      subject.pages = [];
    });
    it("adds new items to pages", function() {
      expect(function() {
        return subject.pages.length;
      }).to.change.by(1).when(function() { subject.parseData(data)});
    });
    it("adds new items to pages", function() {
      result = { title: 'Titel 1', url: "url 1", visits: { desktop: 1, mobile: 0 } };
      subject.parseData(data);
      expect(subject.pages[0]).to.eql(result);
    });
    it("updates items for the same url", function() {
      data = { rows: [["Titel 1","url 1","DESKTOP","1"], ["Titel 1","url 1","MOBILE","1"]] };
      result = { title: 'Titel 1', url: "url 1", visits: { desktop: 1, mobile: 1 } };
      subject.parseData(data);
      expect(subject.pages[0]).to.eql(result);
    });
    context("table data", function() {
      it("add tablets data to mobile entry", function() {
        data = { rows: [["Titel 1","url 1","TABLET","1"], ["Titel 1","url 1","MOBILE","1"]] };
        visits = { desktop: 0, mobile: 2 }
        subject.parseData(data);
        expect(subject.pages[0].visits).to.eql(visits);
      });
    });
  });
  describe('#reorderData', function() {
    it("reorders results to display the combined max on top", function() {
      result1 = { title: 'Titel 1', url: "url 1", visits: { desktop: 4, mobile: 4 } };
      result2 = { title: 'Titel 2', url: "url 2", visits: { desktop: 5, mobile: 0 } };
      subject.pages = [result2, result1];
      visits = { desktop: 4, mobile: 4 }
      subject.reorderData();
      expect(subject.pages[0].visits).to.eql(visits);
    });
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      expect(subject.endpoint()).to.eql('/historic?ids=ga:&metrics=ga:pageviews&dimensions=ga:pageTitle,ga:pagePath,ga:deviceCategory&start-date=yesterday&end-date=today&max-results=1000&sort=-ga%3Apageviews');
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
      expect(subject.endpoint()).to.eql('/historic?ids=ga:Test&metrics=ga:pageviews&dimensions=ga:pageTitle,ga:pagePath,ga:deviceCategory&start-date=yesterday&end-date=today&max-results=1000&sort=-ga%3Apageviews');
      });
    });
  });
});
