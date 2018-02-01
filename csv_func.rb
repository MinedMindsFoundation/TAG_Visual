def writejson(info)
    array = []
    File.open("public/json/tag_rx.json","w") do |f|
        info.each do |row|
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
        array << tempHash
        end
        f.write(array.to_json)
    end
end

def data_converter(data)
    array = []
    data.each do |values|
        tempHash = {
        "campaign_id" => "#{values[0]}",
        "campaign_product_id" => "#{values[1]}",
        "generic_name" => "#{values[2]}",
        "compare_to" => "#{values[3]}",
        "strength" => "#{values[4]}",
        "form" => "#{values[5]}",
        "size" => "#{values[6]}",
        "gold_standard_id" => "#{values[7]}",
        "rolling_yearly_usage" => "#{values[8]}",
        "primary_vendor_code" => "#{values[9]}",
        "primary_ndc" => "#{values[10]}",
        "primary_bid_price" => "#{values[11]}",
        "primary_total_rebate" => "#{values[12]}",
        "primary_net_cost" => "#{values[13]}",
        "annual_gross_spend" => "#{values[14]}",
        "annual_net_spend" => "#{values[15]}",
        "annual_rebate" => "#{values[16]}",
        "bid_vendor" => "#{values[17]}",
        "ndc" => "#{values[18]}",
        "bid_price" => "#{values[19]}",
        "invoice_cost" => "#{values[20]}",
        "total_rebate" => "#{values[21]}",
        "net_cost" => "#{values[22]}",
        "annual_savings" => "#{values[23]}",
        "system_priority" => "#{values[24]}",
        }
        array << tempHash
    end
    array.to_json
end