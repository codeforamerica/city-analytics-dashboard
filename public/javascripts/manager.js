(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  root.matrix.numberWithCommas = function(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    },
    positionFixups: function(column) {
      // Clobber all previous position data and measure/place elements
      // synchronously; called only during visibility change handlers, so
      // flashing and layout shouldn't be a problem. We go to great lengths to
      // prevent this in other methods.
      var totalHeight = 0;
      column.el.kids().forEach(function(k) {
        k.style.top = totalHeight + "px";
        k.style.opacity = null;
        totalHeight += k.offsetHeight;
      });
    },
    animateInto: function(element, column, limit) {
      // Insert the element into the bottom of the column to calculate
      // dimensions, then remove.
      var width = 0;
      var height = 0;

      element.style.opacity = 0;
      element.style.position = "absolute";
      element.style.left = "0px";
      element.style.top = "0px";
      column.prepend(element);
      // get layout at next rAF
      if (document.visibilityState != "visible") {
        return;
      }
      window.requestAnimationFrame(function() {
        column.maxChildren(limit);

        width = element.offsetWidth;
        height = element.offsetHeight;

        // Position
        element.style.opacity = null;
        element.style.top = -height + "px";

        // Now grab all of the elements and schedule them to slide down
        animateDownBy(column.kids(), height);
      });
    },
  };



}).call(this, this);
