/* This is for the top pages */
(function(root){
  "use strict"
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var content = {
    pages: [],
    el: false,

  endpoint: function(){
    return "/realtime?"+
    "ids=ga:"+matrix.settings.profileId+"&"+
    "metrics=rt:pageviews&"+
    "dimensions=rt:pageTitle,rt:pagePath&"+
    "max-results=10&"+
    "sort=-rt%3Apageviews"
    },
    parseResponse: function(error, data){
      var i, _i;
      if(error) { return -1; }
      if(!data.hasOwnProperty("rows")) { return -1; }
      content.pages = [];
      for(i=0,_i=data.rows.length; i<_i; i++){
        content.pages.push({
          title: data.rows[i][0],
          url: data.rows[i][1],
          visits: parseInt(data.rows[i][2])
        });
      }

      content.displayResults();
    },
    displayResults: function(){
      matrix.template(content.el,
                      'content-results',
                      { pages: content.pages.slice(0,10) }
      );
    },
    init: function(){
      content.el = document.getElementById('content');
      content.reload();

      // FIXME(slightlyoff): persist in-memory data to local storage before
      // refreshing

      // refresh every 30 minutes
      window.setInterval(content.reload, 1800000);
    },
    reload: function(){ d3.json(content.endpoint(), content.parseResponse); }
  };

  root.matrix.content = content;
}).call(this, this);
