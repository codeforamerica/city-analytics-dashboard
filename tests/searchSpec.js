describe('traffic', function() {
  beforeEach(function() {
    window.matrix.settings = {
      profileId: ''
    };
    subject =  window.matrix.search;
    sandbox = sinon.sandbox.create();
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    sandbox.restore();
    server.restore();
  });
  describe('#init', function() {
    beforeEach(function() {
      $('body').append('<div id="search-terms"></div>');
      sandbox.stub(Handlebars, 'compile');
    });
    it("calls reload", function() {
      mock = sandbox.mock(subject).expects("reload").once();
      subject.init();
      mock.verify();
    });
    it("calls reload with interval of 1 minute", function() {
      clock = sinon.useFakeTimers(Date.now());
      mock = sandbox.mock(subject).expects("reload").twice();
      subject.init();
      clock.tick(60000);
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
      it("returns withpout parsing", function() {
        mock = sandbox.mock(subject).expects("parseData").never();
        subject.parseResponse({}, null);
        mock.verify();
      });
      it("does not refresh the results", function() {
        mock = sandbox.mock(subject).expects("refreshResults").never();
        subject.parseResponse({}, null);
        mock.verify();
      });
    });
    context("no error parsing json", function() {
      context("has data from GA", function() {
        it("calls parseData", function() {
          sandbox.stub(subject, 'refreshResults');
          mock = sandbox.mock(subject).expects("parseData").once();
          subject.parseResponse(null, {rows: []});
          mock.verify();
        });
        it("refreshes the results", function() {
          mock = sandbox.mock(subject).expects("refreshResults").once();
          subject.parseResponse(null, {rows: []});
          mock.verify();
        });
      });
      context("no rows (no data from GA)", function() {
        it("does not call parseData", function() {
          mock = sandbox.mock(subject).expects("parseData").never();
          subject.parseResponse(null, {});
          mock.verify();
        });
      });
    });
  });
  describe('#parseData', function() {
    beforeEach(function() {
      data = { rows: [ ["url1", "keyword 1", "00", "DESKTOP", "1"],["url1", "keyword 2", "01", "DESKTOP", "1"],["url1", "keyword 3", "01", "DESKTOP", "1"],["url1", "keyowrd 4", "02", "DESKTOP", "1"]]};
    });
    it("calls addTerm for every row less than two minutes ago", function() {
      mock = sandbox.mock(subject).expects("addTerm").thrice();
      subject.parseData(data);
      mock.verify();
    });
    it("calls addTerm for every row", function() {
      data = { rows: [ ["url1", "keyword", "00", "DESKTOP", "1"]]};
      mock = sandbox.mock(subject).expects("addTerm").withArgs("keyword", 1, "url1");
      subject.parseData(data);
      mock.verify();
    });
    context('Search Term', function() {
      beforeEach(function(){
      data = { rows: [ ["url1", "Search", "00", "DESKTOP", "1"]]};
      });
      it("does not call addTerm for the row", function() {
        mock = sandbox.mock(subject).expects("addTerm").never();
        subject.parseData(data);
        mock.verify();
      });
    });
  });
  describe('#addTerm', function() {
    beforeEach(function() {
      subject.terms = [];
    });
    it("adds new items to terms", function() {
      result = { term: 'Test', total: 1, url: 'url' }
      subject.addTerm("Test", 1, "url", "source");
      expect(subject.terms[0]).to.eql(result);
    });
  });
  describe('#refreshResults', function() {
    beforeEach(function() {
      subject.terms = [{ term: 'Test', total: 1, url: 'url', source: 'source' }];
    });
    it("shows all terms", function() {
    });
    it("calls handlebars template", function() {
    });
  });
  describe('#endpoint', function() {
    it('returns the path to the servers realtime endpoint', function() {
      var result = '/realtime?ids=ga:&'+
        'metrics=rt:pageViews&'+
        'dimensions=rt:pagePath,rt:keyword,rt:minutesAgo,rt:deviceCategory&'+
        'sort=rt:minutesAgo&max-results=10000';
      expect(subject.endpoint()).to.eql(result);
    });
    context('with profileId', function() {
      beforeEach(function() {
        window.matrix.settings = {
          profileId: 'Test'
        };
      });
      it('returns correct profile Id in the endpoint path', function() {
      var result = '/realtime?ids=ga:Test&'+
        'metrics=rt:pageViews&'+
        'dimensions=rt:pagePath,rt:keyword,rt:minutesAgo,rt:deviceCategory&'+
        'sort=rt:minutesAgo&max-results=10000';
      expect(subject.endpoint()).to.eql(result);
      });
    });
  });
  describe("safeTerm", function() {
    context("email address", function() {
      it("is not safe", function() {
        expect(subject.safeTerm("iw@jwi.de")).to.eq(false);
      });
    });
    context("just numbers", function() {
      it("is not safe", function() {
        expect(subject.safeTerm("432913")).to.eq(false);
      });
    });
    context("no search term", function() {
      it("is not safe", function() {
        expect(subject.safeTerm("(not set)")).to.eq(false);
      });
    });
    context("search term secured by google", function() {
      it("is not safe", function() {
        expect(subject.safeTerm("(not provided)")).to.eq(false);
      });
    });
    context("503 request", function() {
      it("is not safe", function() {
        expect(subject.safeTerm("Sorry, we are experiencing technical difficulties (503 error)")).to.eq(false);
      });
    });
  });
});
