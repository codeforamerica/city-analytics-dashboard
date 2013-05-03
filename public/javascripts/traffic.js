(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,

    endpoint: function(profileId){
      return "https://www.googleapis.com/analytics/v3alpha/data/realtime?"
        + "ids=ga:"+ profileId +"&"
        + "metrics=ga:activeVisitors&"
        + "time=" + Date.now();
    },
    parseResponse: function(data){
      traffic.$el.html('<h1>' + data.rows[0][0] + '</h1>');
    },
    init: function(){
      traffic.$el = $('#traffic-count');

      traffic.reload();
      window.setInterval(traffic.reload, 60e3);
    },
    reload: function(){
      var endpoint = traffic.endpoint(root.matrix.settings.profileId);

      matrix.user.apiRequest(endpoint, traffic.parseResponse);
    }
  };

  root.matrix.traffic = traffic;
}).call(this);
