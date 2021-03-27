

 const NUM_EXAMPLES_1 = 10
 
export default function(data, graph_1_width, graph_1_height){

   

    let svg1 = d3.select("#graph1")
        .append("svg")
        .attr("width", graph_1_width)     // HINT: width
        .attr("height", graph_1_height)     // HINT: height
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`); 

    let y1 = d3.scaleLinear()
        .range([graph_1_height-margin.top-margin.bottom,0]);

    // TODO: Create a scale band for the y axis
    let x1 = d3.scaleBand()
        .range([0,graph_1_width-margin.left-margin.right])
        .padding(0.1);  // Improves readability

    let countRef1 = svg1.append("g");
    let x_axis_label_1 = svg1.append("g");
    let y_axis_label_1 = svg1.append("g")
    //////////////////////

    const years = filterByYear(data)
    //console.log(years)

    console.log(filterByCountry(data))

    x1.domain(years.map(function(d){ return d.year }))

    y1.domain([0,d3.max(years, function(d){return d.count})])

    x_axis_label_1
        .attr("transform", `translate(0,${y1(0)})`)
        .call(d3.axisBottom(x1).tickSize(0).tickPadding(10));
    y_axis_label_1
        .call(d3.axisLeft(y1).tickSize(2))

    let bars = svg1.selectAll("rect").data(years);

    let color = d3.scaleLinear()
        .domain([d3.min(years, function(d){return d.count}),d3.max(years, function(d){return d.count})])
        .range(["#81c2c3","#66a0e2"])

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return color(d.count) }) 
        .attr("x", function(d){return x1(d.year)})
        .attr("y", function(d){return y1(d.count)})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
        .attr("width", x1.bandwidth())
        .attr("height",  function(d){return y1(0)-y1(d.count)}); 

    let counts = countRef1.selectAll("text").data(years);
    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d){return x1(d.year)})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d){return y1(d.count) - 10})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d){return d.count});
});


function filterByYear(data) {
    let years = []
    let currentDate = 0
    data.forEach((d) => {
        if(parseInt(d.date.substring(0,4)) == currentDate){
            const lastElement = years[years.length-1]
            lastElement.count = lastElement.count += 1
        } else {
            const newElement = {year: parseInt(d.date.substring(0,4)), count: 1}
            years.push(newElement)
            currentDate = parseInt(d.date.substring(0,4))
        }
    })
    return years.slice(years.length-NUM_EXAMPLES_1,years.length-1)
}

