require 'rubygems'
require 'sinatra'

set :public_folder, 'public'

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/token' do
  params = {
    'client_id' => ENV['CLIENT_ID'],
    'client_secret' => ENV['CLIENT_SECRET'],
    'refresh_token' => ENV['REFRESH_TOKEN'],
    'grant_type' => 'refresh_token'
  }
  
  `curl 'https://accounts.google.com/o/oauth2/token' --data '#{params.map {|key, value| "#{key}=#{URI.encode_www_form_component(value)}"}.join('&')}' --compressed`
end
