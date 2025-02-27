export class ScatterPlot {
  constructor(_config, _data, barGraph, type) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 40, right: 40, bottom: 60, left: 80 },
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

    // Create scales based on data values
    vis.xScale = d3
      .scaleLinear()
      .domain(d3.extent(vis.data, (d) => d.VetsDisabilty))
      .range([0, vis.width]);

    vis.yScale = d3
      .scaleLinear()
      .domain(d3.extent(vis.data, (d) => d.NonVetsDisabilty))
      .range([vis.height, 0]);

    // Add X axis
    vis.chart
      .append("g")
      .attr("transform", `translate(0,${vis.height})`)
      .call(d3.axisBottom(vis.xScale));

    // Add Y axis
    vis.chart.append("g").call(d3.axisLeft(vis.yScale));

    // Add labels
    vis.chart
      .append("text")
      .attr("class", "axis-label")
      .attr("x", vis.width / 2)
      .attr("y", vis.height + 40)
      .attr("text-anchor", "middle")
      .text("Disabled Veterans");

    vis.chart
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -vis.height / 2)
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .text("Disabled Non-veterans");

    vis.updateVis();
  }

  updateVis() {
    let vis = this;
    vis.renderVis();
  }

  async renderVis() {
    let vis = this;

    // Clear previous dots
    vis.chart.selectAll("circle").remove();

    // Create groups for each data point
    const points = vis.chart
      .selectAll("g")
      .data(vis.data)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) =>
          `translate(${vis.xScale(d.VetsDisabilty)},${vis.yScale(
            d.NonVetsDisabilty
          )})`
      );

    // Add circles
    points
      .append("circle")
      .attr("r", 2)
      .style("fill", "#004473")
      .style("opacity", 0.25);

    // Add labels
    points
      .append("text")
      .attr("dy", ".31em")
      .attr("dx", "0.5em")
      .style("font-size", "10px")
      .text((d) => d.label);
  }
}
