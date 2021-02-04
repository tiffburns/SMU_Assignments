// width & height
var svgWidth = 960;
var svgHeight = 500;

// margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append
var groupchart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var cxaxis = "poverty";
var cyaxis = "obesity";

// function used for updating x scale and x axis
function scales(censusData, cxaxis) {
    // create scales
    var linearXscale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[cxaxis]) * 0.8,
            d3.max(censusData, d => d[cxaxis]) * 1.2
        ])
        .range([0, width]);

    return linearXscale;
}

function yScale(censusData, cyaxis) {
    // create scales
    var linearYscale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[cyaxis]) * 0.8,
            d3.max(censusData, d => d[cyaxis]) * 1.2
        ])
        .range([height, 0]);

    return linearYscale;
}

function renderXAxes(newscales, xAxis) {
    var bottoma = d3.axisBottom(newscales);

    xAxis.transition()
        .duration(1000)
        .call(bottoma);

    return xAxis;
}

function rendery(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function circlemaker(circlesGroup, newscales, cxaxis, newYScale, cyaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newscales(d[cxaxis]))
        .attr("cy", d => newYScale(d[cyaxis]));

    return circlesGroup;
}

function toolbox(cxaxis, cyaxis, circlesGroup) {

    var xLabel;

    if (cxaxis === "poverty") {
        xLabel = "Poverty Rate: ";
    } else if (cxaxis === "age") {
        xLabel = "Age (Median): ";
    } else {
        xLabel = "Household Income (Median): ";
    }

    var yLabel;

    if (cyaxis === "obesity") {
        yLabel = "Obesity: ";
    } else if (cyaxis === "smokes") {
        yLabel = "Smokes: ";
    } else {
        yLabel = "Healthcare: ";
    }

    var toolbox = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            if (cxaxis === "poverty") {
                return (`${d.state}<br>${xLabel} ${d[cxaxis]}%<br>${yLabel} ${d[cyaxis]}%`);
            } else if (cxaxis === "age") {
                return (`${d.state}<br>${xLabel} ${d[cxaxis]}yrs<br>${yLabel} ${d[cyaxis]}%`);
            } else {
                return (`${d.state}<br>${xLabel} $${d[cxaxis]}<br>${yLabel} ${d[cyaxis]}%`);
            }
        });

    circlesGroup.call(toolbox);

    // event-handling
    circlesGroup.on("mouseover", function(data) {
            toolbox.show(data);
        })
        .on("mouseout", function(data, index) {
            toolbox.hide(data);
        });

    return circlesGroup;
}

// load data from data.csv
d3.csv("/assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
    console.log(censusData);

    // parse that data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    var linearXscale = scales(censusData, cxaxis);

    var linearYscale = yScale(censusData, cyaxis);


    var bottoma = d3.axisBottom(linearXscale);
    var leftAxis = d3.axisLeft(linearYscale);

    // append x axis
    var xAxis = groupchart.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottoma);

    // append y axis
    var yAxis = groupchart.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    // append circles
    var circlesGroup = groupchart.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => linearXscale(d[cxaxis]))
        .attr("cy", d => linearYscale(d[cyaxis]))
        .attr("r", 20)
        .attr("class", "stateCircle")
        .attr("opacity", ".5");

    var textLabel = groupchart.selectAll(null)
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => linearXscale(d[cxaxis]))
        .attr("y", d => linearYscale(d[cyaxis]) + 5)
        .text(d => d.abbr)
        .attr("class", "stateText");


    function renderAbbr(textsAbbr, newscales, newYScale, cxaxis, cyaxis) {
        textsAbbr.transition()
            .duration(1000)
            .attr("x", d => newscales(d[cxaxis]))
            .attr("y", d => newYScale(d[cyaxis]) + 5);

        return textsAbbr;
    }

    var xLabelsGroup = groupchart.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var yLabelsGroup = groupchart.append("g")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .classed("axis-text", true);

    var obesityLabel = yLabelsGroup.append("text")
        .attr("x", 0 - (height / 2) - 10)
        .attr("y", -80)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", 0 - (height / 2) - 10)
        .attr("y", -60)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", 0 - (height / 2) - 20)
        .attr("y", -40)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");


    var circlesGroup = toolbox(cxaxis, cyaxis, circlesGroup);

    xLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");

            if (value !== cxaxis) {

                cxaxis = value;

                linearXscale = scales(censusData, cxaxis);

                xAxis = renderXAxes(linearXscale, xAxis);

                circlesGroup = circlemaker(circlesGroup, linearXscale, cxaxis, linearYscale, cyaxis);
                circlesGroup = toolbox(cxaxis, cyaxis, circlesGroup);
                textLabel = renderAbbr(textLabel, linearXscale, linearYscale, cxaxis, cyaxis);

                if (cxaxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else if (cxaxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    yLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value !== cyaxis) {

                cyaxis = value;

                linearYscale = yScale(censusData, cyaxis);

                yAxis = rendery(linearYscale, yAxis);

                circlesGroup = circlemaker(circlesGroup, linearXscale, cxaxis, linearYscale, cyaxis);
                circlesGroup = toolbox(cxaxis, cyaxis, circlesGroup);
                textLabel = renderAbbr(textLabel, linearXscale, linearYscale, cxaxis, cyaxis);

                if (cyaxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else if (cyaxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});