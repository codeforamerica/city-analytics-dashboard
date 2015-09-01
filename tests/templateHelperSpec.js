describe("templateHelper", function() {
  beforeEach(function() {
    subject = window.templateHelper;
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });
  describe("#compileTemplate", function() {
    it("returns a template function", function() {
      expect(subject.compileTemplate("test")).be.instanceOf(Function);
    });
  });
  describe("#getTemplate", function() {
    context("template was not compiled before", function() {
      it("calls compileTemplate to compile the template", function() {
        sandbox.stub(document, "getElementById").returns({ innerHTML: ""});
        mock = sandbox.mock(subject).expects("compileTemplate").once();
        subject.getTemplate("test");
        mock.verify();
      });
    });
    context("template was compiled before", function() {
      beforeEach(function() {
        subject.templates["foo"] = "bar";
      });
      it("returns a template the saved template function", function() {
        expect(subject.getTemplate("foo")).to.eql("bar");
      });
    });
  });
  describe("#renderTemplate", function() {
    beforeEach(function() {
      element = { innerHTML: "" };
      templateFunction = function(e) { return "test" };
    });
    it("sets the innerHTML to contents of the template", function() {
      sandbox.stub(subject, "getTemplate").returns(templateFunction);
      subject.renderTemplate(element, "", {});
      expect(element.innerHTML).to.eq("test");
    });
  });
  describe("#prependTemplate", function() {
    beforeEach(function() {
      element = { innerHTML: "Test" };
      templateFunction = function(e) { return "test" };
    });
    it("sets the innerHTML to contents of the template", function() {
      sandbox.stub(subject, "getTemplate").returns(templateFunction);
      subject.prependTemplate(element, "", {});
      expect(element.innerHTML).to.eq("testTest");
    });
  });
  describe("#appendTemplate", function() {
    beforeEach(function() {
      element = { innerHTML: "Test" };
      templateFunction = function(e) { return "test" };
    });
    it("sets the innerHTML to contents of the template", function() {
      sandbox.stub(subject, "getTemplate").returns(templateFunction);
      subject.appendTemplate(element, "", {});
      expect(element.innerHTML).to.eq("Testtest");
    });
  });
  describe("#registerHelpers", function() {
    it("registers helper with Handlebars", function() {
      mock = sandbox.mock(Handlebars).expects("registerHelper").once();
      subject.registerHelpers();
      mock.verify();
    });
  });
});
