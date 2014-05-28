/* This one gets which pages are being hit right now */
(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var landing = {
    terms: [],
    urls: [],
    newTerms: [],
    newURLs: [],
    newSources: [],
    $el: false,
    nextRefresh: 0,

    endpoint: function(profileId){
      return "/realtime?"
        + "ids=ga:"+matrix.settings.profileId+"&"
        + "metrics=ga:activeVisitors&"
        + "dimensions=ga:pageTitle,ga:pagePath,rt:source&"
        /*+ "filters="+ encodeURIComponent("ga:pagePath==/search") +"&"*/
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
    addTerm: function(term, count, url, source){

      var i, _i;
      for(i=0, _i=landing.terms.length; i<_i;  i++){
        if(landing.terms[i].term === term){
          landing.terms[i].nextTick = count;
          return true;
        }
      }
      landing.terms.push({
        term: term,
        total: 0,
        nextTick: count,
        currentTick: 0,
        url: url,
        source: source
      });
    },
    zeroNextTicks: function(){
      var i, _i, newTerms = [];
      for(i=0, _i=landing.terms.length; i<_i;  i++){
        landing.terms[i].nextTick = 0;
      }
    },
    addNextTickValues: function(data){
      var i, _i, term, url, source;
      console.log("term: "+term+" url: "+url+" source:"+source);
      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][0].split(' - ');
        url = data.rows[i][1];
        source = data.rows[i][2];
        if(term[0] !== 'Search' && landing.safeTerm(term[0])){
          landing.addTerm(term[0], root.parseInt(data.rows[i][3], 10), url, source);
        }
       
      }
    },
    addTimeIndexValues: function(){
      var i, _i, j, _j, term, time, newPeople, nonZeroTerms = [];
      for(i=0, _i=landing.terms.length; i<_i;  i++){
        term = landing.terms[i];
        newPeople = term.currentTick < term.nextTick ? term.nextTick - term.currentTick : 0;
        term.total = term.total + newPeople;
        term.currentTick = term.nextTick;
        if(newPeople > 0){
          for(j=0,_j=newPeople; j<_j; j++){
            landing.newTerms.push(term.term);
            landing.newURLs.push(term.url);
            landing.newSources.push(term.source);
          }
        }
        if(term.currentTick > 0){
          nonZeroTerms.push(term);
        }
      }
      landing.newTerms.sort(function(){ return Math.floor((Math.random() * 3) - 1) });
      landing.terms = nonZeroTerms;
    },
    parseResponse: function(data){
      var term, i, _i;

      landing.zeroNextTicks();
      landing.addNextTickValues(data);
      landing.addTimeIndexValues();
    },
    displayResults: function(){
      var term = landing.newTerms.pop();
      var url = landing.newURLs.pop();
      var source = landing.newSources.pop();
      var sourceStr = (source) ? ' <em>via: '+source+'</em>' : '';
      var linkStr = (url) ? ' <a href="http://'+url+'" target="_blank"><img src="../stylesheets/icons/external-link.png" alt="external link"  height="16px" width="16px"></a>' : '';
      if(term){
        landing.$el.prepend('<li>'+$('<div>').text(term).html()+linkStr+sourceStr);
        landing.$el.find('li:gt(10)').remove();
        root.setTimeout(landing.displayResults, (landing.nextRefresh - Date.now())/landing.newTerms.length);
      } else {
        root.setTimeout(landing.displayResults, 5e3);
      }
    },
    init: function(){
      landing.$el = $('#search');
      landing.reload();
      landing.displayResults();
      window.setInterval(landing.reload, 60e3);
    },
    reload: function(){
      var endpoint = landing.endpoint(root.matrix.settings.profileId);
      landing.nextRefresh = Date.now() + 60e3;
      $.ajax({ dataType: 'json', url: endpoint, success: landing.parseResponse});
    }
  };

  root.matrix.landing = landing;
}).call(this);
