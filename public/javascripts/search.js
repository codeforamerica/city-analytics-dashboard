(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var search = {
    terms: [],
    newTerms: [],
    $el: false,
    nextRefresh: 0,

    endpoint: function(profileId){
      return "/realtime?"
        + "ids=ga:"+ profileId +"&"
        + "metrics=ga:activeVisitors&"
        + "dimensions=ga:pageTitle,ga:pagePath&"
        + "filters="+ encodeURIComponent("ga:pagePath==/search") +"&"
        + "sort=-ga:activeVisitors&"
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
      // Nothing that is like a NI number
      if(term.match(/^[A-Za-z]{2}\s+?[0-9]{2}\s+?[0-9]{2}\s+?[0-9]{2}\s+?[A-Za-z]$/)){
        return false;
      }
      // No 503 requests
      if(term === "Sorry, we are experiencing technical difficulties (503 error)"){
        return false;
      }
      return true;
    },
    addTerm: function(term, count){
      var i, _i;
      for(i=0, _i=search.terms.length; i<_i;  i++){
        if(search.terms[i].term === term){
          search.terms[i].nextTick = count;
          return true;
        }
      }
      search.terms.push({
        term: term,
        total: 0,
        nextTick: count,
        currentTick: 0,
      });
    },
    zeroNextTicks: function(){
      var i, _i, newTerms = [];
      for(i=0, _i=search.terms.length; i<_i;  i++){
        search.terms[i].nextTick = 0;
      }
    },
    addNextTickValues: function(data){
      var i, _i, term;
      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][0].split(' - ');
        if(term[0] !== 'Search' && search.safeTerm(term[0])){
          search.addTerm(term[0], root.parseInt(data.rows[i][2], 10));
        }
      }
    },
    addTimeIndexValues: function(){
      var i, _i, j, _j, term, time, newPeople, nonZeroTerms = [];
      for(i=0, _i=search.terms.length; i<_i;  i++){
        term = search.terms[i];
        newPeople = term.currentTick < term.nextTick ? term.nextTick - term.currentTick : 0;
        term.total = term.total + newPeople;
        term.currentTick = term.nextTick;
        if(newPeople > 0){
          for(j=0,_j=newPeople; j<_j; j++){
            search.newTerms.push(term.term);
          }
        }
        if(term.currentTick > 0){
          nonZeroTerms.push(term);
        }
      }
      search.newTerms.sort(function(){ return Math.floor((Math.random() * 3) - 1) });
      search.terms = nonZeroTerms;
    },
    parseResponse: function(data){
      var term, i, _i;

      search.zeroNextTicks();
      search.addNextTickValues(data);
      search.addTimeIndexValues();
    },
    displayResults: function(){
      var term = search.newTerms.pop();
      if(term){
        search.$el.prepend('<li>'+$('<div>').text(term).html()+'</li>');
        search.$el.find('li:gt(20)').remove();
        root.setTimeout(search.displayResults, (search.nextRefresh - Date.now())/search.newTerms.length);
      } else {
        root.setTimeout(search.displayResults, 5e3);
      }
    },
    init: function(){
      search.$el = $('#search');

      search.reload();
      search.displayResults();
      window.setInterval(search.reload, 60e3);
    },
    reload: function(){
      var endpoint = search.endpoint(root.matrix.settings.profileId);

      search.nextRefresh = Date.now() + 60e3;
      $.ajax({ dataType: 'json', url: endpoint, success: search.parseResponse});
    }
  };

  root.matrix.search = search;
}).call(this);
