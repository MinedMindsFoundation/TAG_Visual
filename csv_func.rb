def writecsv(info)
    CSV.open("public/csv/coffee.csv", "wb") do |csv|
        csv << ["campaign_id", "campaign_product_id", "generic_name", "compare_to", "strength", "form", "size", "gold_standard_id", "rolling_yearly_usage", "primary_vendor_code", "primary_ndc", "primary_bid_price", "primary_total_rebate", "primary_net_cost", "annual_gross_spend", "annual_net_spend", "annual_rebate", "bid_vender", "ndc", "bid_price", "invoice_cost", "total_rebate", "net_cost", "annual_savings", "system_priority"]
        info.each do |row|
            csv << ["#{row[0]}", "#{row[1]}", "#{row[2]}", "#{row[3]}", "#{row[4]}", "#{row[5]}", "#{row[6]}", "#{row[7]}", "#{row[8]}", "#{row[9]}", "#{row[10]}", "#{row[11]}", "#{row[12]}", "#{row[13]}", "#{row[14]}", "#{row[15]}", "#{row[16]}", "#{row[17]}", "#{row[18]}", "#{row[19]}", "#{row[20]}", "#{row[21]}", "#{row[22]}", "#{row[23]}", "#{row[24]}", "#{row[25]}"]
        end
    end
end