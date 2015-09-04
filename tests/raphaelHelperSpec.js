describe("raphaelHelper", function() {
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    date = new Date();
    options = { gridTextSize: 0, gridTextFamily: '', gridTextWeight: 0, padding: 0 };
    data = [];
    chart = { data: data, options: options, elementHeight: 0, raphael: {} };
    subject = raphaelHelper();
  });
  afterEach(function() {
    sandbox.restore();
  });
  describe("#labelFormat", function() {
    it("returns a date in 12h format", function() {
      date.setHours(10,0,0);
      expect(subject.labelFormat(date)).to.eq("10 AM");
    });
    it("returns a date in 12h format without leading zero", function() {
      date.setHours(8,0,0);
      expect(subject.labelFormat(date)).to.eq("8 AM");
    });
    it("shows the weekday for 12AM", function() {
      date.setHours(0,0,0);
      currentDay = date.getDay();
      date.setDate(date.getDate() + 3 - currentDay); //set Date to a wednesday
      expect(subject.labelFormat(date)).to.eq("Wed 12 AM");
    });
  });
  describe("shouldDrawLabelForDate", function() {
    context("returns true", function() {
      it("for 6AM", function() {
        date.setHours(6,0,0);
        expect(subject.shouldDrawLabelForDate(date)).to.eq(true);
      });
      it("for 6PM", function() {
        date.setHours(18,0,0);
        expect(subject.shouldDrawLabelForDate(date)).to.eq(true);
      });
    });
    context("returns false", function() {
      it("for 6:30 AM", function() {
        date.setHours(6,30,0);
        expect(subject.shouldDrawLabelForDate(date)).to.eq(false);
      });
      it("for 7AM", function() {
        date.setHours(7,0,0);
        expect(subject.shouldDrawLabelForDate(date)).to.eq(false);
      });
    });
  });
  describe("#drawLabel", function() {
    beforeEach(function() {
      attrSpy = sandbox.stub();
      text = { attr: attrSpy }
      attrSpy.returns(text);
      textSpy = sandbox.stub().returns(text);
      raphael = { text: textSpy }
      chart.raphael = raphael;
      subject(chart);
    });
    it("calls raphaels text method", function() {
      subject.drawLabel(0,0,"");
      expect(textSpy.withArgs(0,0,"")).to.have.been.calledOnce;
    });
  });
  describe("#redrawAllLabels", function() {
    context("no data", function() {
      beforeEach(function() {
        subject(chart);
      });
      it("does not redrawLabels", function() {
        mock = sandbox.mock(subject).expects("drawLabel").never();
        subject.redrawAllLabels();
        mock.verify();
      });
    });
    context("has data", function() {
      beforeEach(function() {
        date = new Date();
        date.setHours(6,0,0);
        differentDate = new Date();
        differentDate.setHours(8,0,0);
        data = [{src: { date: date}, _x: 0}, {src: { date: differentDate}, _x: 0}];
        chart.data = data;
        subject(chart);
      });
      it("does redrawLabels", function() {
        mock = sandbox.mock(subject).expects("drawLabel").once();
        subject.redrawAllLabels();
        mock.verify();
      });
    });
  });
});
