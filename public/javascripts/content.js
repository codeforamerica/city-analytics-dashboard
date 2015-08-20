/* This is for the top pages */
(function(root){
  "use strict"
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var content = {
    pages: [],
    el: false,

  endpoint: function(){
    return "/historic?"+
    "ids=ga:"+matrix.settings.profileId+"&"+
    "metrics=ga:pageviews&"+
    "dimensions=ga:pageTitle,ga:pagePath,ga:deviceCategory&"+
    "start-date=yesterday&end-date=today&"+
    "max-results=1000&"+
    "sort=-ga%3Apageviews"
    },
    parseData: function(data) {
      var i, _i,
      row, url, device, oldRow, visits, visitsDevice,
      titleColumn = 0, urlColumn= 1, deviceColumn = 2, visitsColumn = 3;
      for(i=0,_i=data.rows.length; i<_i; i++){
        row = data.rows[i];
        url = row[urlColumn];
        device = row[deviceColumn].toLowerCase();
        visits = parseInt(row[visitsColumn]);
        if(oldRow = window.dataHelper.findWithUrl(content.pages, url)) {
          oldRow.visits[device] += visits;
        }else {
          visitsDevice = { desktop: 0, mobile: 0 };
          visitsDevice[device] += visits;
          content.pages.push({
            title: data.rows[i][titleColumn],
            url: data.rows[i][urlColumn],
            visits: visitsDevice
          });
        }
      }
    },
    parseResponse: function(error, data){
      if(error) { return -1; }
      if(!data.hasOwnProperty("rows")) { return -1; }
      content.pages = [];
      content.parseData(data);
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
