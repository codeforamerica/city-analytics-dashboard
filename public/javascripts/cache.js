(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var cache = function(attr, value){
    if (typeof root.localStorage === 'undefined'){
      root.localStorage = {};
    }

    if(typeof value === 'undefined'){
      if(typeof root.localStorage[attr] !== 'undefined'){
        return JSON.parse(root.localStorage[attr]);
      } else {
        return;
      }
    } else if (!value){
      delete root.localStorage[attr];
    } else {
      try {
        root.localStorage[attr] = JSON.stringify(value);
      } catch (e){
        return false;
      }
    }
  };
  root.matrix.cache = cache;

}).call(this);
