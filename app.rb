require 'sinatra'
require 'csv'
require 'json'
require 'pg'
require 'json'
require_relative 'database_func.rb'
require_relative 'csv_func.rb'
load './local_env.rb' if File.exist?('./local_env.rb')

get '/' do 
    erb :choice
end 

post '/choice' do
    choice = params[:choose]
    if choice == "Tag_1"
        erb :tag_1
    elsif choice == "Tag_2"
        check_connection()
        data = getinfo()
        # writecsv(data)
        writejson(data)
    #   p  "#{data}"
        erb :tag_2
    end
end