(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var auth = {
    user: false,

    getUser: function(callback){
      auth.callback = callback;
      if(auth.user !== false){
        auth.callback(auth.user);
      } else {
        auth.requestAuth();
      }
    },
    requestAuth: function(){
      var request = new XMLHttpRequest(),
          response;

      request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status === 200){
          response = JSON.parse(request.responseText);
          auth.user = {
            accessToken: response.access_token,
            expires: (+new Date()) + (response.expires_in * 1000)
          };
          auth.callback(auth.user);
        }
      };
      request.open('GET', matrix.settings.authServer);
      request.send();
    }
  }

  root.matrix.auth = auth;
}).call(this);
