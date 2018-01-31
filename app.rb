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
        #  writejson(data)
            p "#{data}"
            
            data.each do |row|
                tempHash = {
                "campaign_id" => "#{row[0]}",
                "campaign_product_id" => "#{row[1]}",
                "generic_name" => "#{row[2]}",
                "compare_to" => "#{row[3]}",
                "strength" => "#{row[4]}",
                "form" => "#{row[5]}",
                "size" => "#{row[6]}",
                "gold_standard_id" => "#{row[7]}",
                "rolling_yearly_usage" => "#{row[8]}",
                "primary_vendor_code" => "#{row[9]}",
                "primary_ndc" => "#{row[10]}",
                "primary_bid_price" => "#{row[11]}",
                "primary_total_rebate" => "#{row[12]}",
                "primary_net_cost" => "#{row[13]}",
                "annual_gross_spend" => "#{row[14]}",
                "annual_net_spend" => "#{row[15]}",
                "annual_rebate" => "#{row[16]}",
                "bid_vendor" => "#{row[17]}",
                "ndc" => "#{row[18]}",
                "bid_price" => "#{row[19]}",
                "invoice_cost" => "#{row[20]}",
                "total_rebate" => "#{row[21]}",
                "net_cost" => "#{row[22]}",
                "annual_savings" => "#{row[23]}",
                "system_priority" => "#{row[24]}",
                }
        erb :tag_2
    end
end