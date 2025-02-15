// overall structure is from https://codesandbox.io/p/sandbox/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-choropleth-map?file=%2Fjs%2FchoroplethMap.js%3A9%2C20-18%2C27

export class BarGraph {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 0, right: 0, bottom: 0, left: 0 },
      tooltipPadding: 10,
      legendBottom: 25,
      legendLeft: 100,
      legendRectHeight: 12,
      legendRectWidth: 150,
    };

    this.data = _data;

    this.initVis();
  }
  initVis() {
    let vis = this;

    // Width and height as the inner dimensions of the chart area
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Add <svg> element (drawing space)
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Define health indicators array
    vis.healthIndicators = [
      { displayName: "Percent Inactive", columnName: "percent_inactive" },
      { displayName: "Percent Smoking", columnName: "percent_smoking" },
      {
        displayName: "Percent High Blood Pressure",
        columnName: "percent_high_blood_pressure",
      },
      {
        displayName: "Percent Coronary Heart Disease",
        columnName: "percent_coronary_heart_disease",
      },
      { displayName: "Percent Stroke", columnName: "percent_stroke" },
      {
        displayName: "Percent High Cholesterol",
        columnName: "percent_high_cholesterol",
      },
    ];

    // Initialize scales
    vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.2);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale);

    // Add axes groups
    vis.chart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    vis.chart.append("g").attr("class", "y-axis");

    // change to just show us overall
    //vis.updateVis();
  }

  updateVis() {
    let vis = this;

    // Update scales domains
    vis.xScale.domain(vis.healthIndicators.map((d) => d.displayName));
    vis.yScale.domain([
      0,
      Math.max(
        +d.percent_inactive,
        +d.percent_smoking,
        +d.percent_high_blood_pressure,
        +d.percent_coronary_heart_disease,
        +d.percent_stroke,
        +d.percent_high_cholesterol
      ),
    ]);

    // Update axes
    vis.chart.select(".x-axis").call(vis.xAxis);

    vis.chart.select(".y-axis").call(vis.yAxis);

    // Add bars
    const bars = vis.chart.selectAll(".bar").data(vis.data);

    // Enter new bars
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(300)
      .attr("x", (d, i) => vis.xScale(vis.healthIndicators[i].displayName))
      .attr("y", (d) => vis.yScale(+d.percent_inactive))
      .attr("width", vis.xScale.bandwidth())
      .attr("height", (d) => vis.height - vis.yScale(+d.percent_inactive));

    // Remove old bars
    bars.exit().remove();
  }
}
