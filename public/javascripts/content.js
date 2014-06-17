/* This is for the top pages */
(function(root){
  "use strict"
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var content = {
    pages: [],
    el: false,

    endpoint: function(){
      return "/realtime?ids=ga:"+matrix.settings.profileId+"&metrics=rt%3Apageviews&dimensions=rt%3ApageTitle&max-results=10&sort=-rt%3Apageviews"
    },
    parseResponse: function(data){
      var i, _i;

      content.pages = [];
      for(i=0,_i=data.rows.length; i<_i; i++){
        content.pages.push({
          title: data.rows[i][0],//.split(' — ').slice(0,-1).join(' - '),
          visits: data.rows[i][1]
          //displayHits: root.matrix.numberWithCommas(data.rows[i].week2),
          //percentageUp: root.matrix.numberWithCommas(Math.round(data.rows[i].percent_change)) + "%"
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
