window.templateHelper = {
  templates: [],
  deviceClasses: {
    'mobile': 'icon-mobile-phone',
    'desktop': 'icon-desktop'
  },
  deviceCategoryClass: function(deviceCategory) {
    return this.deviceClasses[deviceCategory];
  },
  compileTemplate: function(sourceHtml) {
    return Handlebars.compile(sourceHtml);
  },
  numberFormat: function(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split(".")[0];
  },
  registerHelpers: function() {
    Handlebars.registerHelper('deviceClass', this.deviceCategoryClass);
    Handlebars.registerHelper('numberFormat', this.numberFormat);
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
