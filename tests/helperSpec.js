describe("helper", function() {
  beforeEach(function() {
    subject = window.helper;
  });
  describe("deviceHourResults", function() {
    beforeEach(function() {
      results = [["desktop","00","76"],["desktop","01","68"],["desktop","02","56"],["desktop","03","34"],["mobile","00","28"],["mobile","01","31"],["mobile","02","28"],["mobile","03","14"]];
    });
    it("returns results for every hour", function() {
      expect(subject.deviceHourResults(results).desktop.length).to.eql(24);
    });
    it("returns zero for results not in google results", function() {
      expect(subject.deviceHourResults(results).desktop[4]).to.eql(0);
    });
    it("returns result aggregated by hour and device", function() {
      expect(subject.deviceHourResults(results).desktop[0]).to.eq(76);
    });
  });
  describe("deviceMinuteInterval", function() {
    beforeEach(function() {
      resultsMinute = [["desktop","00","02","1"],["desktop","00","25","1"],["desktop","00","29","2"],["desktop","00","30","1"],["desktop","00","31","1"]];
    });
    context("every 30 minutes", function() {
      it("returns results for 30 minutes", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 30).desktop.length).to.eql(48);
      });
      it("returns zero for results not in google results", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 30).desktop[2]).to.eql(0);
      });
      it("returns result aggregated by 30 minutes and device", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 30).desktop[1]).to.eql(2);
      });
    });
    context("every 15 minutes", function() {
      it("returns results for 30 minutes", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 15).desktop.length).to.eql(96);
      });
      it("returns zero for results not in google results", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 15).desktop[4]).to.eql(0);
      });
      it("returns result aggregated by 15 minutes and device", function() {
        expect(subject.deviceMinuteInterval(resultsMinute, 15).desktop[1]).to.eql(3);
      });

    });
  });
});

