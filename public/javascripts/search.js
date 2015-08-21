/* Inbound search terms */
(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  var search = {
    terms: [],
    urls: [],
    newTerms: [],
    newURLs: [],
    el: false,
    nextRefresh: 0,
    limit: 20,

    endpoint: function(){
      return "/realtime?"
        + "ids=ga:"+matrix.settings.profileId+"&"
        + "metrics=rt:pageViews&"
        + "dimensions=rt:pagePath,rt:keyword,rt:minutesAgo,rt:deviceCategory&"
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
      // filter out pages that don't have associated search terms
      if(term.match("(not set)")){
        return false;
      }
      if(term.match("(not provided)")){
        return false;
      }
      // No 503 requests
      if(term === "Sorry, we are experiencing technical difficulties (503 error)"){
        return false;
      }
      return true;
    },
    addTerm: function(term, count, url){
      var i;
      for(i=0;i<count;i++) {
        search.terms.push({
          term: term,
          total: count,
          url: url
        });
      }
    },
    parseData: function(data) {
      var i, _i, term, url, source, minutesAgo,
      termColumn = 1, urlColumn = 0,
      minutesAgoColumn = 2, countColumn = 4, maxMinutes = 2;

      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][termColumn];
        url = data.rows[i][urlColumn];
        minutesAgo = root.parseInt(data.rows[i][minutesAgoColumn]);
        if(minutesAgo < maxMinutes) {
          if(term !== 'Search' && search.safeTerm(term)){
            search.addTerm(term, root.parseInt(data.rows[i][countColumn], 10), url);
          }
        }else {
          break;
        }

      }
    },
    parseResponse: function(error, data){
      if(error) { return -1; }
      if(data.hasOwnProperty('rows')) {
        search.terms = [];
        search.parseData(data);
        search.refreshResults();
      }else {
        return -1;
      }
    },
    refreshResults: function() {
      templateHelper.prependTemplate(search.el, "search-result-items", {pages: search.terms });
    },
    init: function(){
      search.el = document.getElementById('search-terms');
      search.reload();
      window.setInterval(search.reload, 60e3);
    },
    reload: function(){
      d3.json(search.endpoint(), search.parseResponse);
    }
  };

  root.matrix.search = search;
}).call(this, this);
