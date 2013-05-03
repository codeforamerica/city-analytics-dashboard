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
      return "https://www.googleapis.com/analytics/v3alpha/data/realtime?"
        + "ids=ga:"+ profileId +"&"
        + "metrics=ga:activeVisitors&"
        + "dimensions=ga:pageTitle,ga:pagePath&"
        + "filters="+ encodeURIComponent("ga:pagePath==/search") +"&"
        + "sort=-ga:activeVisitors&"
        + "max-results=10000&"
        + "time=" + Date.now();
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
      var i, _i;
      for(i=0, _i=search.terms.length; i<_i;  i++){
        search.terms.nextTick = 0;
      }
    },
    addNextTickValues: function(data){
      var i, _i, term;
      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][0].split(' - ');
        if(term[0] !== 'Search'){
          search.addTerm(term[0], root.parseInt(data.rows[i][2], 10));
        }
      }
    },
    addTimeIndexValues: function(){
      var i, _i, term, time, newPeople;
      for(i=0, _i=search.terms.length; i<_i;  i++){
        term = search.terms[i];
        newPeople = term.currentTick < term.nextTick ? term.nextTick - term.currentTick : 0;
        term.total = term.total + newPeople;
        term.currentTick = term.nextTick;
        if(newPeople > 0){
          search.newTerms.push(term.term);
        }
      }
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
        search.$el.prepend('<li>'+$('<div>').text(search.newTerms.pop()).html()+'</li>');
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
      matrix.user.apiRequest(endpoint, search.parseResponse);
    }
  };

  root.matrix.search = search;
}).call(this);
