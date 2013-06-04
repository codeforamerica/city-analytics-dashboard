(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var twitter = {
    $el: false,
    tweets: [],

    addNewTweet: function(tweet){
      var date = new Date(tweet.created_at);
      twitter.tweets.push({
        handle: tweet.from_user,
        from: tweet.from_user_name,
        img: tweet.profile_image_url.replace('_normal', '_bigger'),
        text: tweet.text,
        date: date,
        posted: stamp.toISOString(date)
      });
    },
    addNewTweets: function(data){
      var i, _i;

      twitter.tweets = [];

      for(i=0,_i=data.results.length; i<_i; i++){
        twitter.addNewTweet(data.results[i]);
      }
    },
    parseResponse: function(data){
      twitter.addNewTweets(data);
      twitter.displayResults();
    },
    displayResults: function(){
      twitter.tweets.sort(function(a,b){ return b.date - a.date; });
      matrix.template(twitter.$el, 'tweets', { tweets: twitter.tweets.slice(0,10) });
      twitter.$el.find("span").prettyDate();
    },
    init: function(){
      twitter.$el = $('#twitter');

      twitter.reload();
      window.setInterval(twitter.reload, 60e3);

      window.setInterval(function(){ twitter.$el.find("span").prettyDate(); }, 5e3);
    },
    reload: function(){
      $.ajax({
        dataType: 'json',
        url: '/twitter',
        success: twitter.parseResponse
      });
    }
  };

  root.matrix.twitter = twitter;
}).call(this);
