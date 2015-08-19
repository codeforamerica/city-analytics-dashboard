/* This one gets which pages are being hit right now */
(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  var landing = {
    terms: [],
    el: false,

    endpoint: function(){
      return "/realtime?"
        + "ids=ga:"+matrix.settings.profileId+"&"
        + "metrics=rt:pageViews&"
        + "dimensions=ga:pageTitle,ga:pagePath,rt:source,rt:minutesAgo&"
        /*+ "filters="+ encodeURIComponent("ga:pagePath==/search") +"&"*/
        + "sort=rt:minutesAgo&"
        + "max-results=10000";
    },
    safeTerm: function(term){
      // Nothing that looks like an email address
      if(term.indexOf('@') > -1){
        return false;
      }
      // Nothing that is just a numeber
      if(term.match(/^[0-9\s]+$/)){
        return false;
      }
      // Nothing that is like a SSN
      if(term.match(/^[0-9]{3}\s+?[0-9]{2}\s+?[0-9]{4}$/)){
        return false;
      }
      // No 503 requests
      if(term === "Sorry, we are experiencing technical difficulties (503 error)"){
        return false;
      }
      return true;
    },
    addTerm: function(term, count, url, source){
      var i;
      for(i=0;i<count;i++) {
        landing.terms.push({
          term: term,
          total: count,
          url: url,
          source: source,
          has_url: !!url,
          has_source: !!source && (source != "(not set)")
        });
      }
    },
    parseData: function(data) {
      var i, _i, term, url, source, minutesAgo,
      termColumn = 0, urlColumn = 1, sourceColumn = 2,
      minutesAgoColumn = 3, countColumn = 4, maxMinutes = 2;
      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][termColumn].split(/ \u2013|\u2014 /);
        url = data.rows[i][urlColumn];
        source = data.rows[i][sourceColumn];
        minutesAgo = root.parseInt(data.rows[i][minutesAgoColumn]);
        if(minutesAgo < maxMinutes) {
          if(term[0] !== 'Search' && landing.safeTerm(term[0])){
            landing.addTerm(term[0], root.parseInt(data.rows[i][countColumn], 10), url, source);
          }
        }else {
          break;
        }
      }
    },
    parseResponse: function(error, data){
      if(error) { return -1; }
      if(data.hasOwnProperty('rows')) {
        landing.terms = [];
        landing.parseData(data);
        landing.refreshResults();
      }else {
        return -1;
      }
    },
    refreshResults: function() {
      var html    = landing.compiledTemplate({pages: landing.terms });
      landing.el.innerHTML = html + landing.el.innerHTML;
    },
    init: function(){
      var source;
      landing.el = document.getElementById('search');
      source = document.getElementById("landing-pages-items");
      landing.compiledTemplate = Handlebars.compile(source.innerHTML);
      landing.reload();
      window.setInterval(landing.reload, 60e3);
    },
    reload: function(){
      d3.json(landing.endpoint(), landing.parseResponse);
    }
  };

  root.matrix.landing = landing;
}).call(this, this);
