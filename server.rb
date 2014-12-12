require 'rubygems'
require 'sinatra'
require 'json'
require 'rack-cache'
require 'net/http'
require 'net/https'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/object'

use Rack::Cache
set :public_folder, 'public'
set :bind, '0.0.0.0'

if ENV['USERNAME'] && ENV['PASSWORD']
  use Rack::Auth::Basic, 'Demo area' do |user, pass|
    user == ENV['USERNAME'] && pass = ENV['PASSWORD']
  end
end

get '/' do
  html = File.read(File.join('public', 'index.html'))
  html.sub!('$PROFILE_ID', JSON.dump(ENV['GA_VIEW_ID']))
  html.sub!('$DOMAIN_URL', JSON.dump(ENV['GA_WEBSITE_URL']))
  return html
end

get '/realtime' do
  cache_control :public, :max_age => 20
  query = { :access_token => get_token }.merge(params)

  http = Net::HTTP.new('www.googleapis.com', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/analytics/v3alpha/data/realtime?#{query.to_param}")
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

get '/setup' do
  File.read(File.join('public', 'setup.html'))
end

def get_token
  if @token.nil? || @token_timeout < Time.now
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
    data = JSON.parse(response.body)
    @token_timeout = Time.now + data["expires_in"]
    @token = data["access_token"]
  end
  @token
end

configure do
    set :protection, except: [:frame_options]
end