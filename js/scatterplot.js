export class ScatterPlot {
  constructor(_config, _data, barGraph, type) {
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

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.xScale = d3.scaleLinear().domain([0, 4000]).range([0, vis.width]);
    vis.chart
      .append("g")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(d3.axisBottom(vis.xScale));

    // Add Y axis
    vis.yScale = d3.scaleLinear().domain([0, 500000]).range([vis.height, 0]);
    vis.chart.append("g").call(d3.axisLeft(vis.yScale));

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.renderVis();
  }

  async renderVis() {
    let vis = this;

    // Update path fill function
    const scatterPlot = vis.chart
      .selectAll("dot")
      .data(vis.data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return vis.xScale(d.VetsDisabilty);
      })
      .attr("cy", function (d) {
        return vis.yScale(d.NonVetsDisabilty);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
  }
}
