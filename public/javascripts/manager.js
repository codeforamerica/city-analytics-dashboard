(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var manager = {
    selects: {},
    init: function(){
      matrix.traffic.init();
      matrix.search.init();
      matrix.content.init();
      matrix.insideGov.init();
    },
  };
  root.matrix.manager = manager;

  root.matrix.numberWithCommas = function(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
}).call(this);
