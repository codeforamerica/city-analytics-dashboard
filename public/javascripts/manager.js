(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  root.matrix.numberWithCommas = function(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  var now = function() { return window.performance.now(); };

  var animationDuration = 500;
  var animateDownBy = function(elements, height) {
    var start = now();
    var prev = start;
    var last = 0;
    var lasty = 0;
    var _animateDownBy = function() {
      var current = now();
      var dt = current - start;
      var x = Math.min(dt / animationDuration, 1);
      var y = Bezier.cubicBezier(0.4, 0, 0.2, 1, x, animationDuration);
      var topDelta = (y - lasty) * height;
      elements.forEach(function(e) {
        var t = parseFloat(e.style.top);
        e.style.top = (t+topDelta)+"px";
      });
      var prev = current;
      lasty = y;
      if (dt <= animationDuration) {
        window.requestAnimationFrame(_animateDownBy);
      }
    };
    window.requestAnimationFrame(_animateDownBy);
  };

  root.addEvent = function(evnt, elem, myfunc) {
    if (elem.addEventListener){
        elem.addEventListener(evnt, myfunc);
    } else if (elem.attachEvent){
       elem.attachEvent("on"+ev, myfunc);
    } else {
      elem["on"+evnt] = myfunc;
    }
  }

  var manager =
  root.matrix.manager = {
    animationDuration: 500,
    init: function(){
      var body = document.body;
      if(body.offsetWidth < body.offsetHeight){
        body.classList.add('tall');
      }
      window.templateHelper.registerHelpers();
      matrix.traffic.init();
      matrix.landing.init();
      matrix.search.init();
      matrix.content.init();
    }
  };
}).call(this, this);
