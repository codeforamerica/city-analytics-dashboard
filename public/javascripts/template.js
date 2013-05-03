(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var template = function($node, template, context){
    // TODO: add some caching
    var mustache = $('#'+template).html();
    $node.html(Mustache.render(mustache, context));
  };

  root.matrix.template = template;
}).call(this);
