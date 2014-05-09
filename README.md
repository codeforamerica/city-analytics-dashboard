# Display Dashboard

This is a display screen to show real time analytics of a given website. 

It's a bit shonky right now.

This project is a fork of Edd Sowden's dashboard built for the Government Digital Service.  

His project can be found [here](https://github.com/edds/display-screen), and his licence below.

# Running this application

This is a fairly bog-standard sinatra app.  Clone the respository, bundle install.

For it to work, you'll need to generate some keys from the Google API Console.  It's probably worth generating everything you need, then creating a .env file in the root of the project with the environment variables the server calls for:

.env:

CLIENT_ID=XXX.apps.googleusercontent.com
CLIENT_SECRET=XXX
REFRESH_TOKEN=XXX

Then, once you've added that file, you can simple run foreman start -e .env and view the project at localhost:5000

# Licence

Copyright (C) 2013 Edd Sowden

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
