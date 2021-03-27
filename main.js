// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 100, bottom: 40, left: 120 };

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH / 2 - 10,
  graph_1_height = 250;
let graph_2_width = MAX_WIDTH / 1.5 - 10,
  graph_2_height = 500;
let graph_3_width = MAX_WIDTH / 2,
  graph_3_height = 575;

const NUM_EXAMPLES_1 = 10;

d3.csv("../data/football.csv").then(function (data) {
  graph1(data);
  graph2(data);
});
function setData(year) {
  d3.csv("../data/football.csv").then(function (data) {
    d3.select("#graph3").select("svg").remove();
    graph3(data, year);
  });
}

function graph1(data) {
  let svg1 = d3
    .select("#graph1")
    .append("svg")
    .attr("width", graph_1_width) // HINT: width
    .attr("height", graph_1_height) // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let y1 = d3
    .scaleLinear()
    .range([graph_1_height - margin.top - margin.bottom, 0]);

  // TODO: Create a scale band for the y axis
  let x1 = d3
    .scaleBand()
    .range([0, graph_1_width - margin.left - margin.right])
    .padding(0.1); // Improves readability

  let countRef1 = svg1.append("g");
  let x_axis_label_1 = svg1.append("g");
  let y_axis_label_1 = svg1.append("g");
  //////////////////////

  const years = filterByYear(data);

  x1.domain(
    years.map(function (d) {
      return d.year;
    })
  );

  y1.domain([
    0,
    d3.max(years, function (d) {
      return d.count;
    }),
  ]);

  x_axis_label_1
    .attr("transform", `translate(0,${y1(0)})`)
    .call(d3.axisBottom(x1).tickSize(0).tickPadding(10));
  y_axis_label_1.call(d3.axisLeft(y1).tickSize(2));

  svg1
    .append("text")
    .attr(
      "transform",
      `translate(${(graph_1_width - margin.left - margin.right) / 2},-25)`
    ) // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text(`Football Matches Played Worldwide Per Year`);

  svg1
    .append("text")
    .attr(
      "transform",
      `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                    ${graph_1_height - margin.bottom - 4})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Year");

  svg1
    .append("text")
    .attr(
      "transform",
      `translate(-50,
            ${(graph_1_height - margin.bottom - margin.top) / 2})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("# Matches");

  let bars = svg1.selectAll("rect").data(years);

  //   let color = d3
  //     .scaleLinear()
  //     .domain([
  //       d3.min(years, function (d) {
  //         return d.count;
  //       }),
  //       d3.max(years, function (d) {
  //         return d.count;
  //       }),
  //     ])
  //     .range(["#81c2c3", "#66a0e2"]);
  let color = d3
    .scaleOrdinal()
    .domain(
      data.map(function (d) {
        return d.year;
      })
    )
    .range(
      d3.quantize(d3.interpolateHcl("#81c2c3", "#66a0e2"), NUM_EXAMPLES_1)
    );

  bars
    .enter()
    .append("rect")
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("fill", function (d) {
      return color(d.count);
    })
    .attr("x", function (d) {
      return x1(d.year);
    })
    .attr("y", function (d) {
      return y1(d.count);
    }) // HINT: Use function(d) { return ...; } to apply styles based on the data point
    .attr("width", x1.bandwidth())
    .attr("height", function (d) {
      return y1(0) - y1(d.count);
    });

  let counts = countRef1.selectAll("text").data(years);
  counts
    .enter()
    .append("text")
    .merge(counts)
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x1(d.year) + 9;
    }) // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
    .attr("y", function (d) {
      return y1(d.count) - 10;
    }) // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
    .style("text-anchor", "start")
    .text(function (d) {
      return d.count;
    });

  bars.exit().remove();
  counts.exit().remove();
}

function graph2(data) {
  const countries = filterCountriesByWinPercentage(data);
  const topTen = countries
    .filter((a) => {
      return a.win + a.loss + a.draw > 100;
    })
    .map((d) => {
      return {
        ...d,
        total: parseFloat((100 * d.win) / (d.win + d.draw + d.loss)).toFixed(2),
      };
    })
    .sort((a, b) => {
      return b.total - a.total;
    })

    .slice(0, 10);
  console.log(topTen);
  let svg = d3
    .select("#graph2")
    .append("svg")
    .attr("width", graph_2_width) // HINT: width
    .attr("height", graph_2_height) // HINT: height
    .append("g")
    .attr("transform", `translate(0, ${margin.top})`);

  svg
    .append("text")
    .attr("transform", `translate(${(graph_2_width + 40) / 2},30)`) // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text(`Football Match Win Percentage by Country`);

  svg
    .append("text")
    .attr(
      "transform",
      `translate(${margin.left + 140},${graph_2_height / 2 + margin.top})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text(`Top 10 Countries (Win %) `);
  svg
    .append("text")
    .attr(
      "transform",
      `translate(${margin.left + 140},${graph_2_height / 2 + margin.top + 15})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text(`With Over 100 Games Played`);

  let tooltip = d3
    .select("#graph2") // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let x1 = d3.scaleLinear().range([0, 140]);

  // TODO: Create a scale band for the y axis
  let y1 = d3.scaleBand().range([0, 120]).padding(0.1);

  // Map and projection
  var path = d3.geoPath();
  var projection = d3
    .geoMercator()
    .scale(100)
    .center([0, 40])
    .translate([graph_2_width / 2, graph_2_height / 2]);

  // Data and color scale
  var data = d3.map();
  var colorScale = d3
    .scaleLinear()
    .domain([0, 65])
    .range(["#b0def5", "#000080"]);

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
  const json = d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  );

  Promise.all([json]).then(function (values) {
    values[0].features.forEach(function (d) {
      const { name } = d.properties;
      const record = existsInCountriesData(name);
      if (record) {
        data.set(name, record);
      } else {
        data.set(name, { country: name, win: 0, loss: 0, draw: 0 });
      }
    });
    ready(values[0]);
  });

  function ready(topo) {
    let mouseOver = function (d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black");
      const record = data.get(d.properties.name);

      let color_span = `<span style="color:white;">`;
      let html = `${color_span} Country: ${record.country}</span> <br/>
                            ${color_span} Win %: ${(
        (100 * record.win) /
        (record.win + record.loss + record.draw)
      ).toFixed(2)}</span> <br/>
                            ${color_span} W-D-L: ${record.win} - ${
        record.draw
      } - ${record.loss}</span>
                            `;
      tooltip
        .html(html)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 10}px`)
        //.style("box-shadow", `2px 2px 5px ${color(d.song)}`)    // OPTIONAL for students
        .transition()
        .duration(200)
        .style("opacity", 1);
    };

    let mouseLeave = function (d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 0.8)
        .style("stroke", "transparent");
      d3.select(this).transition().duration(200).style("stroke", "transparent");
      tooltip.transition().duration(200).style("opacity", 0);
    };

    y1.domain(
      topTen.map(function (d) {
        return d.country;
      })
    );

    x1.domain([
      0,
      d3.max(topTen, function (d) {
        return d.total;
      }),
    ]);

    let bars = svg.selectAll("rect").data(topTen);

    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y1(d.country);
      })
      .attr("x", function (d) {
        return x1(0);
      }) // HINT: Use function(d) { return ...; } to apply styles based on the data point
      .attr("height", y1.bandwidth())
      .attr("width", function (d) {
        return x1(d.total);
      })
      .attr("fill", function (d) {
        const record = data.get(d.country);
        d.total =
          (100 * record.win) / (record.win + record.loss + record.draw) || 0;
        return colorScale(d.total);
      })
      .attr(
        "transform",
        `translate(${margin.left + 70},${graph_2_height - 190})`
      );

    let countRef = svg.append("g");
    let countryRef = svg.append("g");
    let counts = countRef.selectAll("text").data(topTen);
    let countryLabels = countryRef.selectAll("text").data(topTen);
    countryLabels
      .enter()
      .append("text")
      .merge(countryLabels)
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        return x1(0) + 4;
      }) // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
      .attr("y", function (d) {
        return y1(d.country) + 8;
      }) // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
      .style("text-anchor", "start")
      .text(function (d) {
        return `  ${d.country}`;
      })
      .style("fill", "#ffffff")
      .style("font-size", "8")
      .attr(
        "transform",
        `translate(${margin.left + 70},${graph_2_height - 190})`
      );
    counts
      .enter()
      .append("text")
      .merge(counts)
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        return x1(d.total) - 2;
      }) // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
      .attr("y", function (d) {
        return y1(d.country) + 8;
      }) // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
      .style("text-anchor", "end")
      .text(function (d) {
        return `${parseFloat(d.total).toFixed(2)}%`;
      })
      .style("fill", "#ffffff")
      .style("font-size", "8")
      .attr(
        "transform",
        `translate(${margin.left + 70},${graph_2_height - 190})`
      );

    // Draw the map
    let maps = svg.selectAll("path").data(topo.features);

    maps
      .enter()
      .append("path")
      .merge(maps)
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", function (d) {
        const record = data.get(d.properties.name);
        d.total =
          (100 * record.win) / (record.win + record.loss + record.draw) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function (d) {
        return "Country";
      })
      .style("opacity", 0.8)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave);
  }

  function zoomed() {
    svg
      .selectAll("path") // To prevent stroke width from scaling
      .attr("transform", d3.event.transform);
  }

  function existsInCountriesData(name) {
    const match = countries.filter((d) => {
      return d.country === name;
    });
    if (match.length == 0) {
      return false;
    } else {
      return match[0];
    }
  }
}

function graph3(data, year) {
  const wc = filterCountriesByWorldCup(data, year);
  console.log(wc);

  let svg3 = d3
    .select("#graph3") // HINT: div id for div containing scatterplot
    .append("svg")
    .attr("width", graph_3_width) // HINT: width
    .attr("height", graph_3_height) // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.selectAll("button").attr("transform", `translate(${margin.left})`);

  let extent = d3.extent(wc, function (d) {
    return d.sov.win / (d.sov.win + d.sov.loss + d.sov.draw);
  });

  let x = d3
    .scaleLinear()
    .domain(extent)
    .range([0, graph_3_width - margin.left - margin.right]);

  svg3
    .append("g")
    .attr(
      "transform",
      `translate(0, ${graph_3_height - margin.top - margin.bottom})`
    ) // HINT: Position this at the bottom of the graph. Make the x shift 0 and the y shift the height (adjusting for the margin)
    .call(d3.axisBottom(x));

  let tooltip = d3
    .select("#graph2") // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let mouseover = function (d) {
    let color_span = `<span style="color:white;">`;
    let html = `${color_span} Country: ${d.country}</span> <br/>
                              ${color_span} Win %: ${(
      (100 * d.record.win) /
      (d.record.win + d.record.loss + d.record.draw)
    ).toFixed(2)}</span> <br/>
                              ${color_span} W-D-L: ${d.record.win} - ${
      d.record.draw
    } - ${d.record.loss}</span>
                              `;
    tooltip
      .html(html)
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY - 10}px`)
      //.style("box-shadow", `2px 2px 5px ${color(d.song)}`)    // OPTIONAL for students
      .transition()
      .duration(200)
      .style("opacity", 1);
  };

  let mouseout = function (d) {
    // Set opacity back to 0 to hide
    tooltip.transition().duration(200).style("opacity", 0);
  };

  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(wc, function (d) {
        console.log(d);
        return d.record.win;
      }),
    ])
    .range([graph_3_height - margin.top - margin.bottom, 0]);

  svg3.append("g").call(d3.axisLeft(y).ticks(6));

  let color = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(wc, function (d) {
        return (
          (d.record.win * d.sov.win) / (d.sov.win + d.sov.loss + d.sov.draw)
        );
      }),
    ])
    .range(["#b0def5", "#000080"]);

  let dots = svg3.selectAll("dot").data(wc);
  // TODO: Render the dot elements on the DOM
  dots
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.sov.win / (d.sov.win + d.sov.loss + d.sov.draw));
    }) // HINT: Get x position by parsing the data point's date field
    .attr("cy", function (d) {
      return y(d.record.win);
    }) // HINT: Get y position with the data point's position field
    .attr("r", 6) // HINT: Define your own radius here
    .style("fill", function (d) {
      return color(
        (d.record.win * d.sov.win) / (d.sov.win + d.sov.loss + d.sov.draw)
      );
    })
    .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
    .on("mouseout", mouseout);

  svg3
    .append("text")
    .attr("transform", "translate(300,-10)") // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text(`Performance of ${year} World Cup Teams`);

  svg3
    .append("text")
    .attr(
      "transform",
      `translate(${(graph_3_width - margin.left - margin.right) / 2},
                                    ${graph_3_height - margin.bottom - 4})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Strength of Victory");

  svg3
    .append("text")
    .attr(
      "transform",
      `translate(-40,
            ${(graph_3_height - margin.bottom - margin.top) / 2})`
    ) // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("# Wins");

  dots.exit().remove();
}

function filterByYear(data) {
  let years = [];
  let currentDate = 0;
  data.forEach((d) => {
    if (parseInt(d.date.substring(0, 4)) == currentDate) {
      const lastElement = years[years.length - 1];
      lastElement.count = lastElement.count += 1;
    } else {
      const newElement = { year: parseInt(d.date.substring(0, 4)), count: 1 };
      years.push(newElement);
      currentDate = parseInt(d.date.substring(0, 4));
    }
  });
  return years.slice(years.length - NUM_EXAMPLES_1, years.length);
}

function filterByCountry(data) {
  let countries = [];
  let currentCty = "";
  data.sort((a, b) => {
    return a.country.localeCompare(b.country);
  });
  data.forEach((d) => {
    if (d.country == currentCty) {
      const lastElement = countries[countries.length - 1];
      lastElement.count = lastElement.count += 1;
    } else {
      const newElement = { year: d.country, count: 1 };
      countries.push(newElement);
      currentCty = d.country;
    }
  });
  return countries;
}

function filterCountriesByWinPercentage(data) {
  let countriesWinLoss = [];
  data.forEach((d) => {
    if (d["home_score"] > d["away_score"]) {
      countriesWinLoss.push({ country: d["home_team"], tally: 1 });
      countriesWinLoss.push({ country: d["away_team"], tally: -1 });
    } else if (d["home_score"] < d["away_score"]) {
      countriesWinLoss.push({ country: d["home_team"], tally: -1 });
      countriesWinLoss.push({ country: d["away_team"], tally: 1 });
    } else {
      countriesWinLoss.push({ country: d["home_team"], tally: 0 });
      countriesWinLoss.push({ country: d["away_team"], tally: 0 });
    }
  });
  countriesWinLoss.sort((a, b) => {
    return a.country.localeCompare(b.country);
  });
  let currentCountry = "";
  countries = [];
  countriesWinLoss.forEach((d) => {
    switch (d.country) {
      case "China PR":
        d.country = "China";
        break;
      case "United States":
        d.country = "USA";
        break;
      case "DR Congo":
        d.country = "Democratic Republic of the Congo";
        break;
      case "Congo":
        d.country = "Republic of the Congo";
        break;
      case "Republic of Ireland":
        d.country = "Ireland";
        break;
      case "Tanzania":
        d.country = "United Republic of Tanzania";
        break;
      case "Serbia":
        d.country = "Republic of Serbia";
        break;
      case "North Macedonia":
        d.country = "Macedonia";
    }

    if (d.country == currentCountry) {
      const lastElement = countries[countries.length - 1];
      if (d.tally == 1) {
        lastElement.win = lastElement.win += 1;
      } else if (d.tally == -1) {
        lastElement.loss = lastElement.loss += 1;
      } else if (d.tally == 0) {
        lastElement.draw = lastElement.draw += 1;
      }
    } else {
      let newElement = { country: d.country, win: 0, loss: 0, draw: 0 };

      if (d.tally == 1) {
        newElement.win = newElement.win += 1;
      } else if (d.tally == -1) {
        newElement.loss = newElement.loss += 1;
      } else if (d.tally == 0) {
        newElement.draw = newElement.draw += 1;
      }
      countries.push(newElement);
      currentCountry = d.country;
    }
  });
  return countries;
}

function filterCountriesByWorldCup(data, year) {
  const wc1 = data.filter((d) => {
    return d.tournament === "FIFA World Cup" && d.date.substring(0, 4) === year;
  });
  const opponents = {};
  wc1.forEach((d) => {
    if (d["home_score"] > d["away_score"]) {
      if (d["home_team"] in opponents) {
        opponents[d["home_team"]] = opponents[d["home_team"]].concat(
          d["away_team"]
        );
      } else {
        opponents[d["home_team"]] = [].concat(d["away_team"]);
      }
    } else if (d["home_score"] < d["away_score"]) {
      if (d["away_team"] in opponents) {
        opponents[d["away_team"]] = opponents[d["away_team"]].concat(
          d["home_team"]
        );
      } else {
        opponents[d["away_team"]] = [].concat(d["home_team"]);
      }
    }
  });
  console.log(opponents);
  //console.log(opponents)
  const wdlChart = filterCountriesByWinPercentage(wc1);
  const strengthOfVictory = [];
  Object.entries(opponents).forEach((key) => {
    const record = { win: 0, loss: 0, draw: 0 };
    const homeRecord = wdlChart.filter((d) => {
      if (d.country === "USA") {
        d.country = "United States";
      }
      if (d.country === "Republic of Serbia") {
        d.country = "Serbia";
      }
      return d.country === key[0];
    })[0];
    value = key[1];
    value.forEach((opp) => {
      const oppRecord = wdlChart.filter((d) => {
        return d.country === opp;
      })[0];
      if (oppRecord) {
        record.win += oppRecord.win;
        record.loss += oppRecord.loss;
        record.draw += oppRecord.draw;
      }
    });
    strengthOfVictory.push({
      country: key[0],
      sov: record,
      record: homeRecord,
    });
  });
  return strengthOfVictory;
}
setData("2014");
