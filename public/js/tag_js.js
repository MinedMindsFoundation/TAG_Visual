function tag_js(converted) {
    var legendsvg = d3.select("#scatterlegend").append("svg")
        .attr("width", 150)
        .attr("height", 50);

    legendsvg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(10,10)");

    var categories = ["Not Selected", "Selected"];

    var ordinal = d3.scaleOrdinal()
        .domain(categories)
        .range(["lightblue", "#4292c6"]);
    var legendOrdinal = d3.legendColor()
        .shape('circle')
        .scale(ordinal);

    legendsvg.select(".legendOrdinal")
        .call(legendOrdinal);
    // var converted = <%=converted_data%>;
    // console.log("converted", converted);

    //console.log(typeof data)
    var unitSoldArray = [];
    var savingsArray = [];
    var productDetails = {};
    var currentNetCostByProduct = [];
    converted.forEach(function(d) {
        if (d.system_priority == 1) {
            productDetails["id"] = (d.campaign_product_id);
            productDetails["primary_vendor"] = (d.primary_vendor_code);
            productDetails["generic_name"] = (d.generic_name);
            productDetails["unitSold"] = (d.rolling_yearly_usage);
            productDetails["primary_manufacturer"] = (d.primary_vendor_code);
            productDetails["primary_bid_price"] = (d.primary_bid_price);
            productDetails["primary_total_rebate"] = (d.primary_total_rebate);
            productDetails["primary_net_cost"] = (d.primary_net_cost);
            productDetails["numOneManufacturer"] = (d.bid_vendor);
            productDetails["numberOneNetCost"] = (d.net_cost);
            productDetails["numberOneSavings"] = (d.annual_savings);
            productDetails["numberOnePriority"] = (d.system_priority);
            unitSoldArray.push(parseFloat(d.rolling_yearly_usage));
            currentNetCostByProduct.push(productDetails);
            savingsArray.push(parseFloat(d.annual_savings));
            productDetails = {};
        };
    });
    //console.log("this is the new data", currentNetCostByProduct)
    var data = currentNetCostByProduct;
    //console.log("yo", data)
    var tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    var margin = {
        top: 50,
        right: 255,
        bottom: 30,
        left: 40
    };
    width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width])
        .nice();
    var y = d3.scaleLinear()
        .range([height, 0]);
    var xAxis = d3.axisBottom(x).ticks(10),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);
    var brush = d3.brush().extent([
            [0, 0],
            [width, height]
        ]).on("end", brushended),
        idleTimeout,
        idleDelay = 350;
    var svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);
    var xExtent = d3.extent(savingsArray, function(d) {
        return d;
    });
    var yExtent = d3.extent(unitSoldArray, function(d) {
        return d;
    });
    x.domain(d3.extent(savingsArray, function(d) {
        return d;
    })).nice();
    y.domain(d3.extent(unitSoldArray, function(d) {
        return d;
    })).nice();
    var scatter = svg.append("g")
        .attr("id", "scatterplot")
        .attr("clip-path", "url(#clip)");
    scatter.append("g")
        .attr("class", "brush")
        .call(brush);

    scatter.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function(d) {
            return x(parseFloat(d.numberOneSavings));
        })
        .attr("cy", function(d) {
            return y(parseFloat(d.unitSold));
        })
        .attr("opacity", 0.5)
        .style("fill", "#4292c6")
        .on('mouseover', function(d) {
            tooltip.transition()
                .duration(100)
                .style('opacity', .9);
            tooltip.html((d.generic_name) + "<br>" + "Manufacturer:" + (d.numOneManufacturer) + "<br>" + "Net Cost $" + (d.numberOneNetCost) + "<br>" + "Projected Savings $" + (d.numberOneSavings))
                .style('left', `${d3.event.pageX + 2}px`)
                .style('top', `${d3.event.pageY - 18}px`);
        })
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(400)
                .style('opacity', 0);
        })
        .on('click', function(product) {
            d3.select(this).style("fill", "blue")
            clearBarChart()
            buildBarChart(product);
            builtdPieChart(currentNetCostByProduct);
            builtdDonutChart(currentNetCostByProduct)
        })

    // x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .style("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 8)
        .text("Savings");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("text-decoration", "underline")
        .text("This can be a Name");
    // y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Units Sold");

    function brushended() {
        var s = d3.event.selection;
        if (!s) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
            x.domain(d3.extent(data, function(d) {
                return parseFloat(d.numberOneSavings);
            })).nice();
            y.domain(d3.extent(data, function(d) {
                return parseFloat(d.unitSold);
            })).nice();
        } else {
            x.domain([s[0][0], s[1][0]].map(x.invert, x));
            y.domain([s[1][1], s[0][1]].map(y.invert, y));
            scatter.select(".brush").call(brush.move, null);
        }
        zoom();
    }

    function idled() {
        idleTimeout = null;
    }

    function zoom() {
        var t = scatter.transition().duration(750);
        svg.select("#axis--x").transition(t).call(xAxis);
        svg.select("#axis--y").transition(t).call(yAxis);
        scatter.selectAll("circle").transition(t)
            .attr("cx", function(d) {
                return x(parseFloat(d.numberOneSavings));
            })
            .attr("cy", function(d) {
                return y(parseFloat(d.unitSold));
            });
    }

    function clearBarChart() {
        d3.select("#barChart").remove();
    }


    function padExtent(e, p) {
        if (p === undefined) p = 1;
        return ([e[0] - p, e[1] + p]);
    }

    function buildBarChart(product) {
        // console.log("this is the data from th onclick", product);



        var stackBarChartData = [];
        var primaryVendorData = {};
        primaryVendorData["manufacturer_code"] = product.primary_manufacturer;
        primaryVendorData["priority"] = "CURRENT #1";
        primaryVendorData["net_cost"] = parseFloat(product.primary_net_cost);
        primaryVendorData["total_rebate"] = parseFloat(product.primary_total_rebate);
        stackBarChartData.push(primaryVendorData)
        converted.forEach(function(d) {
            //console.log("this is the data that is in the foreach", d)
            if (d.campaign_product_id == product.id) {
                barChartHash = {};
                primaryHash = {};
                barChartHash["manufacturer_code"] = d.bid_vendor;
                barChartHash["priority"] = d.system_priority;
                barChartHash["net_cost"] = parseFloat(d.net_cost);
                barChartHash["total_rebate"] = parseFloat(d.total_rebate);
                stackBarChartData.push(barChartHash);
            };
        })

        //stackBarChartData.shift();
        // console.log("stackBarChartData", stackBarChartData);
        // console.log("primaryVendorData", primaryVendorData);
        var data = stackBarChartData;
        var tooltip = d3.select('body').append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);
        var margin = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        };
        var width = 500 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        var svg = d3.select("#stackedChart").append("svg")
            .attr("id", "barChart")
            .attr("width", width + margin.left + margin.bottom)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        };
        // min/max
        var xExtent;
        var yExtent = d3.extent(data, function(d) {
            //console.log("Net_C", d.net_cost);
            //console.log("rebate", d.total_rebate);
            //console.log(d.net_cost + d.total_rebate);
            var nicer = d.net_cost + d.total_rebate;
            // console.log("THIS", round(nicer, 2));
            return round(nicer, 2)
        });
        //console.log("heigh", height)
        //console.log("y", yExtent)
        // domain
        var xScale = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.priority;
            }))
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, yExtent[1] * 1.1])
            .range([height, 0]);
        var x = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.priority;
            }))
            .range([0, width]);
        var stack = d3.stack()
            .keys(["net_cost", "total_rebate"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        var series = stack(data);
        var groups = svg.selectAll("g")
            .data(stack(data))
            .enter()
            .append("g");
        var rects = groups.selectAll("rect")
            .data(function(d) {
                return d
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return xScale(d.data.priority)
            })
            .attr("y", function(d) {
                if (d[0] != 0) {
                    return yScale(round(d[0], 2))
                } else {
                    var total = d.data.total_rebate + d.data.net_cost
                    return yScale(round(total, 2))
                };
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                if (d[0] != 0) {
                    return round(height - yScale(round(d[0], 2)), 2)
                } else {
                    var total = d.data.net_cost + d.data.total_rebate;
                    return round(height - yScale(round(total, 2)), 2);
                };
            })
            .attr("id", function(d) {
                return d.priority
            })
            .style("fill", function(d) {
                if (d.data.priority == "CURRENT #1") {
                    return "orange"
                }
                if (d.data.manufacturer_code == stackBarChartData[0].manufacturer_code) {
                    //   console.log("Current", d);
                    return "green"
                } else {
                    return "blue"
                }
            })
            .style("fill-opacity", "0.5")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                tooltip.html("Manufacturer:" + (d.data.manufacturer_code) + "<br>" + "Net Cost $" + (d.data.net_cost) + "<br>" + "Total Rebate $" + (d.data.total_rebate) + "<br>" + "Bid Price $" + (round(d.data.net_cost + d.data.total_rebate, 2)))
                    // div.html("Product Details" + "<br>" + "Manufacturer:" + (d.numOneManufacturer) + "<br>" + "Generic Name:" + (d.generic_name) + "<br>" + "Priority:" + (d.numberOnePriority) + "<br>" + "Net Cost $" + (d.numberOneNetCost) + "<br>" + "Projected Savings $" + (d.numberOneSavings))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(yScale));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Bid Price ");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "25px")
            .style("text-decoration", "underline")
            .text("This can be a name");
        var legendsvg = d3.select("#stackedChart").append("svg")
            .attr("x", 450)
            .attr("width", 250)
            .attr("height", 500);

        legendsvg.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(10,10)");

        var categories = ["Current Net Cost", "Current Total Rebate", "Same Current Net Cost", "Same Current Total Rebate", "Other Net Cost", "Other Total Rebate"];

        var ordinal = d3.scaleOrdinal()
            .domain(categories)
            .range(["orange", "rgb(255, 203, 106)", "green", "rgba(98, 252, 98, 0.857)", "blue", "#4292c6"]);
        var legendOrdinal = d3.legendColor()
            .scale(ordinal);

        legendsvg.select(".legendOrdinal")
            .call(legendOrdinal);
    }



    function builtdPieChart(currentNetCostByProduct) {
        //console.log("this is what we what to look at ", currentNetCostByProduct);
        var svg = d3.select("#pieChart"),
            width = +svg.attr("width"),
            height = +svg.attr("height") + 20,
            radius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 11)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Pie Chart");
        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        var tooltip = d3.select('body').append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);
        var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });
        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);
        var label = d3.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);
        var pieChartData = [];
        converted.forEach(function(d) {
            //console.log("this is d", d)
            if (d.system_priority == "1") {
                //console.log("this is the for each do", product.id);
                //console.log("thid is d", d);
                pieChartData.push(d)
            }
        });
        //console.log("pieChartData", pieChartData);
        var priorityCount = {};
        pieChartData.forEach(function(d) {
            if (d.bid_vendor in priorityCount) {
                //console.log("post-results", priorityCount[d.manufacturer_code] += 1)
                priorityCount[d.bid_vendor] += 1
            } else {
                //console.log("this is here", d)
                priorityCount[d.bid_vendor] = 1
            };
        });

        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        };

        function getSum(total, num) {
            return round(total, 2) + round(num, 2);
        }

        function getPercentage(total, num) {
            max = num * 100
            return round(max / total, 2)
        }
        //console.log("results", Object.keys(priorityCount))
        //console.log("other results", Object.values(priorityCount))
        //console.log("this is a hash", priorityCount);
        var pieChartArray = [];
        var pieKeys = Object.keys(priorityCount);
        var pieValues = Object.values(priorityCount);
        pieKeys.forEach(function(d, i) {
            var pieChartHash = {};
            //console.log(d)
            //console.log(pieValues[i])
            pieChartHash["manufacturer"] = d
            pieChartHash["value"] = pieValues[i]
            pieChartArray.push(pieChartHash)
        });
        //  console.log("lookatmenow", pieChartArray)
        var arc = g.selectAll(".arc")
            .data(pie(pieChartArray))
            .enter().append("g")
            .attr("class", "arc")
        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                // console.log("look at me", d)
                return color(d.data.manufacturer);
            })
            .on('mouseover', function(d) {
                tooltip.transition()
                    .duration(100)
                    .style('opacity', .9);
                tooltip.html("Manufacturer:" + (d.data.manufacturer) + "<br>" + round(getPercentage(round(pieValues.reduce(getSum), 2), d.data.value), 2) + "%")
                    .style('left', `${d3.event.pageX + 2}px`)
                    .style('top', `${d3.event.pageY - 18}px`)
                    .style("width", "150px")
                    .style("height", "30px")
                    .style("background", "lightsteelblue")
                    .style("text-align", "center");
            })
            .on('mouseout', function(d) {
                tooltip.transition()
                    .duration(400)
                    .style('opacity', 0);
            })
        arc.append("text")
            .attr("transform", function(d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .attr("dy", "0.35em")
            .text(function(d) {
                return d.data.manufacturer
            }); //console.log("this is after each do", pieChartData);
    };

    function builtdDonutChart(currentNetCostByProduct) {
        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        };
        var doughnutChartCurrent = [];
        var doughnutChart1 = [];
        var percentage1Total = [];
        var percentageCurrentTotal = [];
        currentNetCostByProduct.forEach(function(d) {
            // console.log("Donut", d)
            var doughnutChartHashCurrent = {};
            var doughnutChartHash = {};
            doughnutChartHash["manufacturer"] = d.numOneManufacturer;
            doughnutChartHashCurrent["manufacturer"] = d.primary_manufacturer;
            doughnutChartHash["total"] = round(parseFloat(d.unitSold) * parseFloat(d.numberOneNetCost), 2);
            doughnutChartHashCurrent["total"] = round(parseFloat(d.unitSold) * parseFloat(d.primary_net_cost), 2);
            doughnutChartCurrent.push(doughnutChartHashCurrent);
            doughnutChart1.push(doughnutChartHash);
        });
        // console.log("1", doughnutChart1)
        // console.log("current", doughnutChartCurrent)

        function getSum(total, num) {
            return round(total, 2) + round(num, 2);
        }

        function getPercentage(total, num) {
            max = num * 1000
            return round(max / total, 2)
        }
        currentBeforeConfigure = {};
        oneBeforeConfigure = {};
        doughnutChart1.forEach(function(d) {
            if (d.manufacturer in oneBeforeConfigure) {
                oneBeforeConfigure[d.manufacturer] += d.total
            } else {
                oneBeforeConfigure[d.manufacturer] = d.total
            }
        })
        doughnutChartCurrent.forEach(function(d) {
            if (d.manufacturer in currentBeforeConfigure) {
                currentBeforeConfigure[d.manufacturer] += d.total
            } else {
                currentBeforeConfigure[d.manufacturer] = parseFloat(d.total)
            }
        })
        var doughnutChartCurrent = [];
        var doughnutChart1 = [];
        var currentKeys = Object.keys(currentBeforeConfigure);
        var currentValues = Object.values(currentBeforeConfigure);
        // console.log("Keys", currentKeys)
        // console.log("Values", currentValues)
        // console.log(currentValues.reduce(getSum))
        // console.log(round(getPercentage(currentValues.reduce(getSum), currentValues[2]), 2))
        currentKeys.forEach(function(d, i) {
            var doughnutChartHashCurrent = {};
            doughnutChartHashCurrent["manufacturer"] = d
            doughnutChartHashCurrent["total"] = currentValues[i]
            doughnutChartCurrent.push(doughnutChartHashCurrent)
        });
        var oneKeys = Object.keys(oneBeforeConfigure);
        var oneValues = Object.values(oneBeforeConfigure);
        oneKeys.forEach(function(d, i) {
            var doughnutChartHash = {};
            doughnutChartHash["manufacturer"] = d
            doughnutChartHash["total"] = oneValues[i]
            doughnutChart1.push(doughnutChartHash)
        });

        // console.log("current", currentBeforeConfigure)
        //  console.log("one", oneBeforeConfigure)
        // console.log("Other", doughnutChartCurrent)
        // console.log("here", doughnutChart1)
        var dataset = doughnutChart1
        var tooltip = d3.select('body').append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select('#donutChart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');
        svg.append("text")
            .attr("id", "dChartTitle")
            .attr("y", -39)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "underline")
            .text("You pick name Jon..lol");

        var donutWidth = 75;

        var arc = d3.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);



        var pie = d3.pie()
            .value(function(d) {
                return d.total;
            })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.manufacturer);

            });


        path.on('mouseover', function(d) {
            var total = d3.sum(dataset.map(function(d) {
                return d.total;
            }));
            var percent = Math.round(1000 * d.data.total / total) / 10;
            svg.append('text')
                .attr('class', 'toolCircle')
                .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html('<tspan x="0">' + "Manufacturer" + ': ' + d.data.manufacturer + '</tspan>' + '<tspan x="0" dy="1.2em">' + "Total $" + (d.data.total) + "</tspan>" + '<tspan x="0" dy="1.5em">' + round(getPercentage(currentValues.reduce(getSum), d.data.total), 2) + "%" + "</tspan>") // add text to the circle.
                .style('font-size', '.9em')
                .style('text-anchor', 'middle');
            svg.append('circle')
                .attr('class', 'toolCircle')
                .attr('r', radius * 0.55) // radius of tooltip circle
                .style('fill', color(d.data.manufacturer)) // colour based on category mouse is over
                .style('fill-opacity', 0.35);
        });

        path.on('mouseout', function() {
            d3.selectAll('.toolCircle').remove();
        });
    };
}