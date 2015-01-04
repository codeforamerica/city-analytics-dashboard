# City Analytics Dashboard

This is a display screen to show real time analytics of a given website. 

This project is a fork of Edd Sowden's dashboard built for the Government Digital Service.  

His project can be found [here](https://github.com/edds/display-screen).


Using City Analytics Dashboard in your city
---------------

Deploying the app
----------

See [Dashboard Setup Instructions](http://dfd-dashboard-setup.herokuapp.com/) for the easiest way to run it. 



For developers - local setup
-----------

This is a fairly bog-standard sinatra app.  Clone the respository, bundle install.

For it to work locally, you'll need to generate some keys from the Google API Console (and turn on the Google Analytics API).  You can use @migurski's OAuth Dance app to get those values: [OAuth Dance](http://oauth-dance.herokuapp.com/)  

You also need the View ID from the Google Analytics account you're accessing (look in Admin > View Settings > View ID). 

It's probably worth generating everything you need, then creating a .env file in the root of the project with the environment variables the server calls for:

.env:

```
    CLIENT_ID=XXX.apps.googleusercontent.com
    CLIENT_SECRET=XXX
    REFRESH_TOKEN=XXX
    GA_VIEW_ID=XXX
    GA_WEBSITE_URL=www.yoursite.com
```

Then, once you've added that file, you can simply run 

```
    foreman start -e .env
```

and view the project at localhost:5000

Contributing
------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

License and Copyright
---------------------

Copyright 2013-2014 Code for America, MIT License (see LICENSE.md for details)


