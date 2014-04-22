/* This gets the data for the total people currently online and the sparkline */
(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,
    points: 720,

    endpoint: function(){
      return "/realtime?ids=ga:41226190&metrics=rt:activeUsers&max-results=50"
    },
    parseResponse: function(data){
      console.log(data)
      console.log(data.totalsForAllResults['rt:activeUsers'])
      var counts = [],
          i, _i;
      traffic.$el.html('<h1>' + data.totalsForAllResults['rt:activeUsers'] + '</h1>');
      /*for(i=0,_i=data.data.length; i<_i; i++){
        counts.unshift(parseInt(data.data[i].unique_visitors, 10));
      }
      if(typeof traffic.sparkline === 'undefined'){
        traffic.sparkline = root.matrix.sparklineGraph('#traffic-count-graph', { data: counts, points: traffic.points, height: 120, width: traffic.$graphEl.width() });
        traffic.sparkline.update(counts, "Traffic over the past " + (Math.round(traffic.points / 30)) + " hours");
      } else {
        traffic.sparkline.update(counts, "Traffic over the past " + (Math.round(traffic.points / 30)) + " hours");
      }*/
    },
    init: function(){
      traffic.$el = $('#traffic-count');
      traffic.$graphEl = $('#traffic-count-graph');

      traffic.reload();
      window.setInterval(traffic.reload, 20e3);
    },
    reload: function(){
      var endpoint = traffic.endpoint();

      $.ajax({ dataType: 'json', url: endpoint, success: traffic.parseResponse});
    }
  };

  root.matrix.traffic = traffic;
}).call(this);
