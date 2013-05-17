(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,
    counts: [],

    endpoint: function(profileId){
      return "/realtime?"
        + "ids=ga:"+ profileId +"&"
        + "metrics=ga:activeVisitors";
    },
    parseResponse: function(data){
      var points = 180;
      traffic.$el.html('<h1>' + root.matrix.numberWithCommas(data.rows[0][0]) + '</h1>');
      traffic.counts.push(parseInt(data.rows[0][0],10));
      if(traffic.counts.length > points){
        traffic.counts = traffic.counts.slice(traffic.counts.length - points);
      }
      if(typeof traffic.sparkline === 'undefined'){
        traffic.sparkline = root.matrix.sparkline('#traffic-count-graph', {
          data: traffic.counts,
          points: points,
          height: 118,
          width: traffic.$graphEl.width()
        });
      } else {
        traffic.sparkline.update(traffic.counts);
      }
      traffic.$lineTime.text(Math.floor((traffic.counts.length / 3)) + " minutes");
    },
    init: function(){
      traffic.$el = $('#traffic-count');
      traffic.$graphEl = $('#traffic-count-graph');
      traffic.$lineTime = $('#traffic-count-graph .line-time');

      traffic.reload();
      window.setInterval(traffic.reload, 20e3);
    },
    reload: function(){
      var endpoint = traffic.endpoint(root.matrix.settings.profileId);

      $.ajax({ dataType: 'json', url: endpoint, success: traffic.parseResponse});
    }
  };

  root.matrix.traffic = traffic;
}).call(this);
