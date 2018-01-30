require 'sinatra'
require 'csv'
require 'pg'
require_relative 'databasefunc.rb'
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
        info = getinfo()
        erb :tag_2
    end
end