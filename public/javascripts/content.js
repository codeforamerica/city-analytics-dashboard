(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var content = {
    pages: [],
    $el: false,

    endpoint: function(profileId){
      return "/realtime?"
        + "ids=ga:"+ profileId +"&"
        + "metrics=ga:activeVisitors&"
        + "dimensions=ga:pageTitle&"
        + "sort=-ga:activeVisitors&"
        + "max-results=1000";
    },
    addNewPages: function(data){
      var i, _i, page, newPages = [];
      for(i=0,_i=data.rows.length; i<_i; i++){
        page = data.rows[i][0].split(' - ');
        newPages.push({
          title: page[0],
          currentHits: root.parseInt(data.rows[i][1], 10),
          displayHits: root.matrix.numberWithCommas(root.parseInt(data.rows[i][1], 10))
        });
      }
      content.pages = newPages;
    },
    parseResponse: function(data){
      var term, i, _i;

      content.addNewPages(data);
      content.displayResults();
    },
    displayResults: function(){
      content.pages.sort(function(a,b){ return b.currentHits - a.currentHits; });
      matrix.template(content.$el, 'content-results', { pages: content.pages.slice(0,10) });
    },
    init: function(){
      content.$el = $('#content');

      content.reload();
      window.setInterval(content.reload, 60e3);
    },
    reload: function(){
      var endpoint = content.endpoint(root.matrix.settings.profileId);

      $.ajax({ dataType: 'json', url: endpoint, success: content.parseResponse});
    }
  };

  root.matrix.content = content;
}).call(this);
