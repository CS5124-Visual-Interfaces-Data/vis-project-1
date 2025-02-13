//import { Choropleth } from "@d3/choropleth";

export class ChoroplethMapVis {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, right: 50, bottom: 10, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15,
    };

    this.data = _data;

    this.initVis();
  }

  async initVis() {
    let vis = this;

    // Width and height as the inner dimensions of the chart area- as before
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    // Add <svg> element (drawing space)
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Create Choropleth https://observablehq.com/@d3/choropleth
    const us = await d3.json("../data/counties-albers-10m.json");
    const counties = topojson.feature(us, us.objects.counties);
    const states = topojson.feature(us, us.objects.states);
    const statemap = new Map(states.features.map((d) => [d.id, d]));
    const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

    // Define color scale
    const colorScale = d3
      .scaleQuantize()
      .domain([1, 10])
      .range(d3.schemeBlues[9]);

    // Add state borders
    vis.svg
      .append("path")
      .datum(statemesh)
      .attr("class", "states")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-linejoin", "round");

    // Create counties group
    const countyGroup = vis.svg.append("g").attr("class", "counties");

    // Add counties
    countyGroup
      .selectAll("path")
      .data(counties.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("fill", (d) =>
        colorScale(vis.data.find((f) => f.cnty_fips === d.id)?.VetsDisabilty)
      )
      .attr("d", d3.geoPath(d3.geoAlbersUsa()));

    // Add tooltips
    const tooltip = d3
      .select("#choropleth")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add event listeners for interactivity
    countyGroup
      .selectAll(".county")
      .on("mouseover", function (event, d) {
        const dataPoint = vis.data.find((f) => f.cnty_fips === d.id);
        if (dataPoint) {
          const stateName = statemap.get(d.id.slice(0, 2)).properties.name;
          tooltip
            .style("opacity", 1)
            .html(
              `${d.properties.name}, ${stateName}<br>${dataPoint.VetsDisabilty}%`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        }
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // Add CSS styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
    .counties path {
        stroke: #fff;
        stroke-width: 0.5px;
    }
    
    .tooltip {
        position: absolute;
        padding: 8px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 4px;
        pointer-events: none;
        font-size: 14px;
    }
`;
    document.head.appendChild(styleSheet);

    /*vis.chart = vis.svg
        .append("g")
        .attr(
          "transform",
          `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
        );
  
      // Initialize linear and ordinal scales (input domain and output range)
      vis.xScale = d3.scaleLinear().domain([0, 365]).range([0, vis.width]);
  
      vis.yScale = d3
        .scaleLinear()
        .domain([
          d3.max(vis.data, (d) => d.year),
          d3.min(vis.data, (d) => d.year),
        ])
        .range([0, vis.height]);
  
      vis.rScale = d3
        .scaleLinear()
        .domain(d3.extent(vis.data, (d) => d.cost))
        .range([5, 100]);
  
      // Construct a new ordinal scale with a range of ten categorical colours
      vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
      vis.colorPalette.domain(
        "tropical-cyclone",
        "drought-wildfire",
        "severe-storm",
        "flooding"
      );
  
      // Initialize axes
      vis.xAxis = d3.axisTop(vis.xScale);
      vis.yAxis = d3.axisLeft(vis.yScale);
  
      // Draw the axis
      vis.xAxisGroup = vis.chart
        .append("g")
        .attr("class", "axis x-axis")
        .call(vis.xAxis);
  
      vis.yAxisGroup = vis.chart
        .append("g")
        .attr("class", "axis y-axis")
        .call(vis.yAxis);*/

    //vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.circles = vis.chart
      .selectAll("circle")
      .data(vis.data)
      .join("circle")
      .attr("fill", (d) => vis.colorPalette(d.category))
      .attr("opacity", 0.8)
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("r", (d) => vis.rScale(d.cost))
      .attr("cy", (d) => vis.yScale(d.year))
      .attr("cx", (d) => vis.xScale(d.daysFromYrStart));

    vis.circles
      .on("mouseover", (event, d) => {
        console.log("mouse over! ");
        console.log(event);
        console.log(d);

        d3
          .select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <h2>${d.name}</h2>  
              Duration: ${d.start}-${d.end}<br>
              Category: ${d.category}<br>
              Cost: ${d.cost}<br>
              `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      });
  }

  renderVis() {}
}
