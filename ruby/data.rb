require 'csv'

class DataParser
  def contents(file)
    CSV.open(file, headers: true, header_converters: :symbol)
  end
end

class DangerousDenver
  attr_reader :file, :incidents, :output, :data

  def initialize(file)
    @incidents = []
    @output = {}
    @data ||= DataParser.new.contents(file)
  end

  def traffic(type)
    data.map do |row|
      incidents << {id: row[:incident_id],
                    incident_address: row[:incident_address],
                    neighborhood_id: row[:neighborhood_id],
                    offense_category_id: row[:offense_category_id]}
    end
  end

  def frequency(data)
    if output[:"#{data}"]
      output[:"#{data}"] += 1
    else
      output[:"#{data}"] = 1
    end
  end

  def resulting_logic(type, incident)
    !(type == "crime" && incident[:offense_category_id] == "traffic-accident")
  end

  def sorting_logic(incident, key, type)
    if incident[:"#{key}"] && resulting_logic(type, incident)
      frequency(incident[:"#{key}"])
    end
  end

  def parse_incidents(incidents, key, type)
    incidents.map do |incident|
      sorting_logic(incident, key, type)
    end
  end

  def sort_the_data(type, key)
    traffic(type)
    parse_incidents(incidents, key, type)
    sorted_output = output.max_by(5) { |k, v| v }
    puts sorted_output
  end
end

puts "Traffic Accidents By Address: "
DangerousDenver.new("./data/traffic-accidents.csv").sort_the_data("traffic", "incident_address")

puts "Traffic Accidents By Neighborhood: "
DangerousDenver.new("./data/traffic-accidents.csv").sort_the_data("traffic", "neighborhood_id")

puts "Crime By Neighborhood: "
DangerousDenver.new("./data/crime.csv").sort_the_data("crime", "neighborhood_id")
