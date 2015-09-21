/* This gets the data for the total people currently online and the sparkline */
(function(root){
  "use strict"
  var debug = 0;
  var debugCountLimit = 1000;
  var debugRand = function() {
    return (Math.random() * debugCountLimit) | 0;
  };

  var parseRows = function(rows) {
    var rowObj = {},
    length = rows.length;
    for(var i=0;i<length;i++){
      rowObj[rows[i][0]] = rows[i][1];
    }
    return rowObj;
  }

  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    el: false,
    points: 720,
    // FIXME(slightlyoff):
    //    since we don't have the GDS traffic middleware, be dumb: keep a
    //    trailing log of counts in memory. Would be better to store on server.
    counts: [],
    // Every half second in debug mode or every 2 minutes when charting fer
    // realz.
    interval: (debug) ? 500 : 2 * 60 * 1000,

    endpoint: function(){
      return "/realtime?ids=ga:"+matrix.settings.profileId+"&metrics=rt:activeUsers&dimensions=rt:deviceCategory&max-results=10"
    },
    historic: function(){
      return "/historic?ids=ga:"+matrix.settings.profileId+"&dimensions=ga%3AdeviceCategory,ga%3Adate,ga%3Ahour,ga%3Aminute&metrics=ga%3Asessions&start-date=2daysAgo&end-date=today&max-results=10000"
    },
    parseResponse: function(data){
      if(data && data.hasOwnProperty('rows')){
        var users = parseRows(data.rows);
        var activeUsers = parseInt(users['DESKTOP'], 10) | 0;
        var activeUsersMobile = parseInt(users['MOBILE'], 10) | 0;
        traffic.el.innerHTML = activeUsers;
        traffic.elMob.innerHTML = activeUsersMobile;

        var dataArray = helper.arrayFromObject(traffic.counts);
        if(typeof traffic.chart === 'undefined'){
          traffic.chart = new Morris.Bar({
            data: dataArray,
            element: 'traffic-count-graph',
            xkey: 'date',
            ykeys: ['desktop', 'mobile'],
            labels: ['Desktop', 'Mobile'],
            stacked: true,
            barColors: ["#265c8d", "#B96425"],
            hideHover: 'always',
            xLabelFormat: function(data){
              return "";
            },
          });
        }
        traffic.chart.setData(dataArray);
        var chartHelper = window.raphaelHelper();
        chartHelper(traffic.chart);
        chartHelper.redrawAllLabels();
      }
    },
    init: function(){
      traffic.el = document.getElementById('traffic-count');
      traffic.elMob = document.getElementById('traffic-count-mobile');
      traffic.graphEl = document.getElementById('traffic-count-graph');
      traffic.counts.length = traffic.points;

      // Check the traffic intermittently
      traffic.loadHistory();
      window.setInterval(traffic.loadHistory, traffic.interval*4);
      window.setInterval(traffic.reload, traffic.interval);
    },
    loadHistory: function() {
      xhr.json(traffic.historic(), function(error, json) {
        if (error) return console.warn(error);
        var endDate = new Date();
        var startDate = time.day.offset(endDate, -2);
        traffic.counts = window.helper.deviceMinuteIntervalResults(json.rows, 30, startDate, endDate);
        traffic.reload();
      });
    },
    reload: function(){
      var endpoint = traffic.endpoint();

      if (debug) {
        traffic.parseResponse({
          totalsForAllResults: {
            'rt:activeUsers': debugRand()
          }
        });
        return;
      }
      xhr.json(endpoint, traffic.parseResponse);

    }
  };

  root.matrix.traffic = traffic;
}).call(this, this);
