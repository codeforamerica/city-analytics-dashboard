window.templateHelper = {
  templates: [],
  compileTemplate: function(sourceHtml) {
    return Handlebars.compile(sourceHtml);
  },
  getTemplate: function(id) {
    var templ = this.templates[id];
    if(!templ) {
      this.templates[id] = templ = this.compileTemplate(document.getElementById(id).innerHTML);
    }
    return templ;
  },
  renderTemplate: function(element, id, context) {
    element.innerHTML = this.getTemplate(id)(context);
  },
  prependTemplate: function(element, id, context) {
    element.innerHTML = this.getTemplate(id)(context) + element.innerHTML;
  },
  appendTemplate: function(element, id, context) {
    element.innerHTML = element.innerHTML + this.getTemplate(id)(context);
  }
}