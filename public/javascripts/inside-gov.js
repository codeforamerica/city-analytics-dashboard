(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var insideGov = {
    $el: false,
    posts: [],

    addNewPage: function(page){
      var i, _i, time;
      for(i=0,_i=insideGov.posts.length; i<_i; i++){
        if(page.id === insideGov.posts[i].id){
          return;
        }
      }
      time = stamp.fromISOString(page.updated);
      if(time.getTime() > Date.now()){
        return;
      }
      insideGov.posts.push({
        id: page.id,
        type: page.title.split(': ')[0],
        title: page.title.split(': ').slice(1).join(': '),
        published: page.updated,
        date: time
      });
    },
    addNewPosts: function(data){
      var i, _i;
      for(i=0,_i=data.feed.entry.length; i<_i; i++){
        insideGov.addNewPage(data.feed.entry[i]);
      }
    },
    parseResponse: function(data){
      insideGov.addNewPosts(data);
      insideGov.displayResults();
    },
    displayResults: function(){
      insideGov.posts.sort(function(a,b){ return b.date - a.date; });
      matrix.template(insideGov.$el, 'inside-gov-posts', { posts: insideGov.posts.slice(0,10) });
      insideGov.$el.find("span").prettyDate();
    },
    init: function(){
      insideGov.$el = $('#inside-gov');

      insideGov.reload();
      window.setInterval(insideGov.reload, 60e3);

      window.setInterval(function(){ insideGov.$el.find("span").prettyDate(); }, 5e3);
    },
    reload: function(){
      $.ajax({
        dataType: 'json',
        url: '/feed',
        success: insideGov.parseResponse
      });
    }
  };

  root.matrix.insideGov = insideGov;
}).call(this);
