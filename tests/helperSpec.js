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
  describe("deviceMinuteIntervalResults", function() {
    beforeEach(function() {
      window.matrix.settings.timezoneOffset = "-7";
      clock = sinon.useFakeTimers(Date.now());
      var timeZoneOffSet = 7;
      var yesterday = -(1000*60*60*24);
      endDate = new Date();
      var currentTimeZoneOffSet = endDate.getTimezoneOffset()/60;
      currentTimeZoneOffsetMidnight = timeZoneOffSet-currentTimeZoneOffSet;
      clock.tick(yesterday);
      startDate = new Date();
      startDate.setHours(currentTimeZoneOffsetMidnight, 0,0);
      endDate.setHours(currentTimeZoneOffsetMidnight, 0,0);
      f = timeFormat.format("%Y%m%d");
      resultsMinuteDate = [["desktop",f(startDate),"00","02","1"],["desktop",f(startDate),"00","25","1"],["desktop",f(startDate),"00","29","2"],["desktop",f(startDate),"01","30","1"],["desktop",f(startDate),"01","31","1"]];
    });
    context("every 30 minutes", function() {
      it("returns results for 30 minutes", function() {
        expect(Object.keys(subject.deviceMinuteIntervalResults(resultsMinuteDate, 30, startDate, endDate)).length).to.eql(48);
      });
      it("returns zero for results not in google results", function() {
        var oneOClock = currentTimeZoneOffsetMidnight+1;
        var d = new Date();
        d.setHours(oneOClock,0,0);
        expect(subject.deviceMinuteIntervalResults(resultsMinuteDate, 30, startDate, endDate)[d].desktop).to.eq(0);
      });
      it("returns result aggregated by 15 minutes and device", function() {
        var d = new Date();
        d.setHours(currentTimeZoneOffsetMidnight,0,0);
        expect(subject.deviceMinuteIntervalResults(resultsMinuteDate, 30, startDate, endDate)[d].desktop).to.eq(4);
      });
    });
  });
  describe("#timeZoneZeors", function() {
    context("single digit", function() {
      it("returns the number with leading and trailing zeros zero", function() {
        expect(subject.timeZoneZeros(1)).to.eql("+0100")
      });
      it("returns the number with leading and trailing zeros zero", function() {
        expect(subject.timeZoneZeros(-1)).to.eql("-0100")
      });
    });
    context("double digit", function() {
      it("returns the number with trailing zeros", function() {
        expect(subject.timeZoneZeros(10)).to.eql("+1000")
      });
      it("returns the number with trailing zeros", function() {
        expect(subject.timeZoneZeros(-10)).to.eql("-1000")
      });
    });
  });
  describe("leadingZero", function() {
    context("single digit", function() {
      it("returns the number with leading zero", function() {
        expect(subject.leadingZero(1)).to.eql("01")
      });
    });
    context("double digit", function() {
      it("returns the number", function() {
        expect(subject.leadingZero(10)).to.eql("10")
      });
    });
  });
  describe("#arrayFromObject", function() {
    beforeEach(function() {
      dataObject = {test: {test: 'Test'}, bla: {bla: 'Bla'}};
    });
    it("returns array with objects", function() {
      expect(subject.arrayFromObject(dataObject).length).to.eql(2);
    });
    it("first element is object", function() {
      expect(subject.arrayFromObject(dataObject)[0]).to.eql({test: 'Test'});
    });
  });
});

