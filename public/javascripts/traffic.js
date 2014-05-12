/* This gets the data for the total people currently online and the sparkline */
(function(){
  "use strict"
  var debug = 0;
  var debugCountLimit = 1000;
  var debugRand = function() {
    return (Math.random() * debugCountLimit) | 0;
  };
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,
    points: 720,
    // FIXME(slightlyoff):
    //    since we don't have the GDS traffic middleware, be dumb: keep a
    //    trailing log of counts in memory. Would be better to store on server.
    counts: [],
    // Every half second in debug mode or every 2 minutes when charting fer
    // realz.
    interval: (debug) ? 500 : 2 * 60 * 1000,

    endpoint: function(){
      return "/realtime?ids=ga:56899021&metrics=rt:activeUsers&max-results=10"
    },
    parseResponse: function(data){
      var i, _i;
      var counts = traffic.counts;
      traffic.$el.html(data.totalsForAllResults['rt:activeUsers']);

      counts.unshift(parseInt(data.totalsForAllResults['rt:activeUsers'], 10));
      counts.length = traffic.points;
      if(typeof traffic.sparkline === 'undefined'){
        traffic.sparkline = root.matrix.sparklineGraph(
          '#traffic-count-graph',
          { data: counts,
            points: traffic.points,
            height: 120,
            width: traffic.$graphEl.width()
          }
        );
      }
      traffic.sparkline.update(counts,
        "Traffic over the past " + (Math.round(traffic.points / 30)) + " hours");
    },
    init: function(){
      traffic.$el = $('#traffic-count');
      traffic.$graphEl = $('#traffic-count-graph');
      traffic.counts.length = traffic.points;
      // Zero fill the points
      for (var i = 0; i < traffic.points; i++) {
        traffic.counts[i] = 0;
        // Dummy data in debug mode
        if (debug) { traffic.counts[i] = debugRand(); }
      }

      traffic.reload();
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

      // FIXME(slightlyoff): it's nuts that this isn't using D3's methods
      $.ajax({
        dataType: 'json',
        url: endpoint,
        success: traffic.parseResponse
      });
    }
  };

  root.matrix.traffic = traffic;
}).call(this);
