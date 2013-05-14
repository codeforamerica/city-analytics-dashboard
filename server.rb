require 'rubygems'
require 'sinatra'
require 'json'
require 'net/http'
require 'active_support/core_ext/hash'

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
  http = Net::HTTP.new('accounts.google.com', 443)
  http.use_ssl = true
  req = Net::HTTP::Post.new('/o/oauth2/token')
  req.form_data = params
  response = http.request(req)
  response.body
end

get '/feed' do
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new('/government/feed.atom')
  response = http.request(req)
  Hash.from_xml(response.body).to_json
end
