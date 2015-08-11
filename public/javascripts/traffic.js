/* This gets the data for the total people currently online and the sparkline */
(function(root){
  "use strict"
  var debug = 0;
  var debugCountLimit = 1000;
  var debugRand = function() {
    return (Math.random() * debugCountLimit) | 0;
  };

  var today = new Date().toISOString();
    today = today.split("T"[0]);
  
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString();
  yesterday = yesterday.split("T"[0]);

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
      return "/historic?ids=ga:"+matrix.settings.profileId+"&dimensions=ga%3AdeviceCategory,ga%3Adate,ga%3Ahour,ga%3Aminute&metrics=ga%3Asessions&start-date=yesterday&end-date=today&max-results=2000"
    },
    parseResponse: function(data){

      var counts = traffic.counts;
      var users = parseRows(data.rows)
      var activeUsers = parseInt(users['DESKTOP'], 10);
      var activeUsersMobile = parseInt(users['MOBILE'], 10);
      traffic.el.innerText = activeUsers;
      traffic.elMob.innerText = activeUsersMobile;

      counts.unshift(activeUsers);
      counts.length = traffic.points;
      if(typeof traffic.sparkline === 'undefined'){
     
        traffic.sparkline = root.matrix.sparklineGraph(
          '#traffic-count-graph',
          { data: counts,
            points: traffic.points,
            height: 120,
            width: traffic.graphEl.offsetWidth
          }
        );
      }
      traffic.sparkline.update(counts,
        "Traffic over the past " + (Math.round(traffic.points/30)) + " hours");
    },
    init: function(){
      traffic.el = document.getElementById('traffic-count');
      traffic.elMob = document.getElementById('traffic-count-mobile');
      traffic.graphEl = document.getElementById('traffic-count-graph');
      traffic.counts.length = traffic.points;
      
      

      // Zero fill the points
      for (var i = 0; i < traffic.points; i++) {
        traffic.counts[i] = 0;
        // Dummy data in debug mode
        if (debug) { traffic.counts[i] = debugRand(); }
      }
       d3.json(traffic.historic(), function(error, json) {
          if (error) return console.warn(error);

          // going over each historic item
          var i = traffic.points;
          var j = 0;
          while(i--) {
            traffic.counts[j] = json.rows[i][1];
            j++;
          }
          traffic.reload();
        });
       
      
      
      // Check the traffic intermittently
      window.setInterval(traffic.reload, traffic.interval);
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
      d3.json(endpoint, traffic.parseResponse);

    }
  };

  root.matrix.traffic = traffic;
}).call(this, this);
