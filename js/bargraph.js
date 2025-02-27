// overall structure is from https://codesandbox.io/p/sandbox/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-choropleth-map?file=%2Fjs%2FchoroplethMap.js%3A9%2C20-18%2C27
export const HealthIndicators = [
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
export class BarGraph {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 20, right: 20, bottom: 40, left: 60 },
      tooltipPadding: 10,
      legendBottom: 25,
      legendLeft: 100,
      legendRectHeight: 12,
      legendRectWidth: 150,
    };

    // Ensure data exists
    this.data = _data || {};

    this.initVis();
  }

  initVis() {
    let vis = this;

    // Calculate dimensions
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;

    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Create SVG element
    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Create chart group
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Initialize scales
    vis.xScale = d3
      .scaleBand()
      .range([0, vis.width])
      .domain(
        HealthIndicators.map(function (d) {
          return d.displayName;
        })
      )
      .padding(0.2);

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

    // Update visualization only if data is populated
    if (vis.data?.length > 0) {
      vis.updateVis();
    }
  }

  updateVis() {
    let vis = this;

    // Get data values
    const nameValues = HealthIndicators;
    const dataValues = [
      +vis.data.percent_inactive,
      +vis.data.percent_smoking,
      +vis.data.percent_high_blood_pressure,
      +vis.data.percent_coronary_heart_disease,
      +vis.data.percent_stroke,
      +vis.data.percent_high_cholesterol,
    ];

    // Update scales domains
    vis.xScale.domain(HealthIndicators.map((d) => d.displayName));

    // Set y-scale domain with padding
    const maxVal = Math.max(...dataValues.filter((v) => !isNaN(v)));
    vis.yScale.domain([0, maxVal * 1.1]);

    // Update axes
    vis.chart.select(".x-axis").call(vis.xAxis);
    vis.chart.select(".y-axis").call(vis.yAxis);

    // Create bars
    const bars = vis.chart.selectAll(".bar").data(nameValues);

    // Enter new bars
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(300)
      .attr("x", (d) => vis.xScale(d.displayName))
      .attr("width", vis.xScale.bandwidth())
      .attr("y", (d) => vis.yScale(Math.max(0, +vis.data[d.columnName])))
      .attr(
        "height",
        (d) => vis.height - vis.yScale(Math.max(0, +vis.data[d.columnName]))
      )
      .attr("fill", "#6da4d1");

    // Remove old bars
    //bars.exit().remove();
  }
}
