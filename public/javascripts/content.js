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
    addPage: function(title, count){
      var i, _i, page;
      for(i=0, _i=content.pages.length; i<_i;  i++){
        if(content.pages[i].title === title){
          page = content.pages[i];

          // Number of standard deviations from the norm
          page.difference = (count - (page.sum / page.n))/(page.stdDev > 0 ? page.stdDev : 1);

          page.sumSquares = page.sumSquares + (count * count);
          page.sum = page.sum + count;
          page.n = page.n + 1;
          page.stdDev = Math.sqrt((page.sumSquares - ((page.sum * page.sum)/page.n))/(page.n - 1));
          page.currentHits = count;
          page.displayHits = root.matrix.numberWithCommas(count);
          return true;
        }
      }
      content.pages.push({
        title: title,
        difference: 0,
        sumSquares: count * count,
        sum: count,
        n: 1,
        stdDev: 100, // high enough to not let pages apear on the second hit
        currentHits: count,
        displayHits: root.matrix.numberWithCommas(count)
      });
    },
    zeroDifferences: function(){
      var i, _i;
      for(i=0, _i=content.pages.length; i<_i;  i++){
        content.pages.difference = 0;
      }
    },
    addNewPages: function(data){
      var i, _i, page;
      for(i=0,_i=data.rows.length; i<_i; i++){
        page = data.rows[i][0].split(' - ');
        content.addPage(page[0], root.parseInt(data.rows[i][1], 10));
      }
    },
    parseResponse: function(data){
      var term, i, _i;

      content.zeroDifferences();
      content.addNewPages(data);
      content.displayResults();
    },
    displayResults: function(){
      content.pages.sort(function(a,b){
        if(b.currentHits < 10){
          return -1;
        }
        return b.currentHits - a.currentHits;
      });
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
