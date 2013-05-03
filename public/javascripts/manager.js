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
    },
  };
  root.matrix.manager = manager;
}).call(this);
