(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  root.matrix.numberWithCommas = function(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  var templateStrings = {};

  var template =
  root.matrix.template =
  function(node, id, context){
    var templ = templateStrings[id];
    if (!templ) {
       templateStrings[id] = templ = document.getElementById(id).textContent;
    }
    node.innerHTML = Mustache.render(templ, context);
  };

  var def = function(o, p, v) {
    Object.defineProperty(o, p, {
      writable: true,
      enumerable: false,
      configurable: true,
      value: v,
    });
  }

  def(HTMLElement.prototype, "prepend", function(e) {
    if(this.childNodes.length) {
      this.insertBefore(e, this.firstChild);
    } else {
      this.appendChild(e);
    }
  });
  def(HTMLElement.prototype, "append", function(e) { this.appendChild(e); });

  def(HTMLElement.prototype, "maxChildren", function(count) {
    var c = this.children;
    if (c.length < count) return;
    while(c.length > count) { this.removeChild(c[c.length-1]); }
  });

  var setElementProperties = function(e, args) {
    Object.keys(args).forEach(function(key) {
      switch(key) {
        case "innerHTML":
          e.innerHTML = args.innerHTML; break;
        case "className":
          e.setAttribute("class", args.className); break;
        case "classList":
          args.classList.forEach(function(cn) { e.classList.add(cn); });
          break;
        case "children":
          args.children.forEach(function(child) {
            e.appendChild(child);
          });
          break;
        default:
          e.setAttribute(key, args[key]);
          break;
      }
    });
  };

  var makeElement = function(en, args) {
    var e = document.createElement(en);
    if(args) { setElementProperties(e, args); }
    return e;
  };

  ["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "del", "details", "dfn", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"].forEach(function(en) {
    def(HTMLElement.prototype, en, makeElement.bind(document, en));
  });

  def(HTMLElement.prototype, "template", function(id, context) {
    template(this, id, context);
    return this;
  });


  var manager =
  root.matrix.manager = {
    init: function(){
      var body = document.body;
      if(body.offsetWidth < body.offsetHeight){
        body.classList.add('tall');
      }
      matrix.traffic.init();
      matrix.landing.init();
      matrix.search.init();
      matrix.content.init();
    },
  };

}).call(this, this);
