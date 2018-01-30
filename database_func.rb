require 'pg'

load './local_env.rb' if File.exist?('./local_env.rb')

def check_connection()
    db_params = {
        host: ENV['host'],
        port: ENV['port'],
        dbname: ENV['dbname'],
        user: ENV['user'],
        password: ENV['password']
    }

    db= PG::Connection.new(db_params)
    p "connected"
    db.close
end

def getinfo()
    db_params = {
        host: ENV['host'],
        port: ENV['port'],
        dbname: ENV['dbname'],
        user: ENV['user'],
        password: ENV['password']
    }
    db= PG::Connection.new(db_params)
    data = [] 
	db.exec( "SELECT * FROM tag_rx_table" ) do |result|
	      result.each do |row|
	          data << row.values
	        end
	         p "#{data} data is here"
        end
    db.close    
	data    
end