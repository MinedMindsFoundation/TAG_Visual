require 'sinatra'
require 'csv'



get '/' do 
    erb :choice
end 

post '/choice' do
    choice = params[:choose]
    if choice == "Tag_1"
        erb :tag_1
    elsif choice == "Tag_2"
        erb :tag_2
    end
end