// overall structure is from https://codesandbox.io/p/sandbox/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-choropleth-map?file=%2Fjs%2FchoroplethMap.js%3A9%2C20-18%2C27
export const ChoroplethMapTypes = {
  Vet: "Vet",
  NonVet: "NonVet",
  Combo: "Combo",
};
export class ChoroplethMap {
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
    this.barGraph = barGraph;
    this.type = type;

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

    // get popup for handling click events
    vis.popup = document.getElementById("#popup");

    // Initialize projection and path generator
    vis.projection = d3
      .geoAlbersUsa()
      .translate([vis.width / 2, vis.height / 2])
      .scale(vis.width);
    vis.geoPath = d3.geoPath().projection(vis.projection);

    // Define color scale
    vis.vetColorScale = d3.scaleQuantize().range(d3.schemeBlues[9]);
    vis.nonVetColorScale = d3.scaleQuantize().range(d3.schemeReds[9]);

    // Initialize gradients that we will later use for the legends
    vis.vetLinearGradient = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "vet-legend-gradient");
    vis.nonVetLinearGradient = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "non-vet-legend-gradient");

    // Append legends
    vis.vetLegend = vis.chart
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${vis.config.legendLeft},${
          vis.height - vis.config.legendBottom
        })`
      );
    vis.nonVetLegend = vis.chart
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${
          vis.config.legendLeft + vis.config.legendRectWidth + 100
        },${vis.height - vis.config.legendBottom})`
      );

    vis.vetLegendRect = vis.vetLegend
      .append("rect")
      .attr("width", vis.config.legendRectWidth)
      .attr("height", vis.config.legendRectHeight);
    vis.nonVetLegendRect = vis.nonVetLegend
      .append("rect")
      .attr("width", vis.config.legendRectWidth)
      .attr("height", vis.config.legendRectHeight);

    vis.vetLegendTitle = vis.vetLegend
      .append("text")
      .attr("class", "vet-legend-title")
      .attr("dy", ".35em")
      .attr("y", -10)
      .text("Disabled Veterans");
    vis.nonVetLegendTitle = vis.nonVetLegend
      .append("text")
      .attr("class", "non-vet-legend-title")
      .attr("dy", ".35em")
      .attr("y", -10)
      .text("Disabled Non-veterans");

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    // get extents (color range / domain)
    const vetColorScaleExtent = d3.extent(vis.data, (d) => d.VetsDisabilty);
    const nonVetColorScaleExtent = d3.extent(
      vis.data,
      (d) => d.NonVetsDisabilty
    );
    // Update color scales
    vis.vetColorScale.domain(vetColorScaleExtent);
    vis.nonVetColorScale.domain(nonVetColorScaleExtent);

    // Define begin and end of the color gradients (legend)
    vis.vetLegendStops = [
      {
        color: vis.vetColorScale(vetColorScaleExtent[0]),
        value: vetColorScaleExtent[0],
        offset: 0,
      },
      {
        color: vis.vetColorScale(vetColorScaleExtent[1]),
        value: vetColorScaleExtent[1],
        offset: 100,
      },
    ];

    vis.nonVetLegendStops = [
      {
        color: vis.nonVetColorScale(nonVetColorScaleExtent[0]),
        value: nonVetColorScaleExtent[0],
        offset: 0,
      },
      {
        color: vis.nonVetColorScale(nonVetColorScaleExtent[1]),
        value: nonVetColorScaleExtent[1],
        offset: 100,
      },
    ];

    vis.renderVis();
  }

  async renderVis() {
    let vis = this;

    // Convert compressed TopoJSON to GeoJSON format
    const us = await d3.json("../data/counties-10m.json");
    const counties = topojson.feature(us, us.objects.counties);
    const states = topojson.feature(us, us.objects.states);

    // Defines the scale of the projection so that the geometry fits within the SVG area
    vis.projection.fitSize([vis.width, vis.height], counties);

    // Create SVG definitions for patterns
    const defs = vis.chart.append("defs");

    // Define pattern for veteran disabilities
    const vetPattern = defs
      .append("pattern")
      .attr("id", "vet-striped")
      .attr("height", 1)
      .attr("width", 0.05)
      .attr("patternTransform", "rotate(45)");

    vetPattern
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", (d) => vis.vetColorScale(d));

    vetPattern
      .append("rect")
      .attr("x", 5)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "1%")
      .attr("fill", "white");

    // Define pattern for non-veteran disabilities
    const nonVetPattern = defs
      .append("pattern")
      .attr("id", "nonvet-striped")
      .attr("height", 1)
      .attr("width", 0.05)
      .attr("patternTransform", "rotate(-45)");

    nonVetPattern
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", (d) => vis.nonVetColorScale(d));

    nonVetPattern
      .append("rect")
      .attr("x", 5)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "1%")
      .attr("fill", "white");

    // Update path fill function
    const countyPath = vis.chart
      .selectAll(".county")
      .data(counties.features)
      .join("path")
      .attr("class", "county")
      .attr("d", vis.geoPath)
      .attr("fill", (d) => {
        const vetVal = vis.data.find(
          (f) => f.cnty_fips === +d.id
        )?.VetsDisabilty;
        const nonVetVal = vis.data.find(
          (f) => f.cnty_fips === +d.id
        )?.NonVetsDisabilty;

        if (vetVal && nonVetVal) {
          return `url(#${vis.createStripedPattern(
            vis.vetColorScale(vetVal),
            vis.nonVetColorScale(nonVetVal)
          )})`;
        } else if (vetVal) {
          return vis.vetColorScale(vetVal);
        } else if (nonVetVal) {
          return vis.nonVetColorScale(nonVetVal);
        }
        return "url(#lightstripe)";
      })
      .attr("stroke", "white");

    countyPath
      .on("mousemove", (event, d) => {
        const popDensity = d.properties.pop_density
          ? `<strong>${d.properties.pop_density}</strong> pop. density per km<sup>2</sup>`
          : "No data available";
        d3
          .select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.properties.name}</div>
              <div>${popDensity}</div>
            `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      })
      .on("click", function (event, d) {
        // Create new data object with selected county highlighted
        const regionSpecificData = vis.data.find((f) => f.cnty_fips === +d.id);

        // Update vis.data and trigger update
        vis.barGraph.data = regionSpecificData;
        vis.barGraph.updateVis();

        vis.popup.style.display = "block";
      });

    // Add legend labels
    vis.vetLegend
      .selectAll(".vet-legend-label")
      .data(vis.vetLegendStops)
      .join("text")
      .attr("class", "vet-legend-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", 20)
      .attr("x", (d, index) => {
        return index == 0 ? 0 : vis.config.legendRectWidth;
      })
      .text((d) => Math.round(d.value * 10) / 10);
    vis.nonVetLegend
      .selectAll(".non-vet-legend-label")
      .data(vis.nonVetLegendStops)
      .join("text")
      .attr("class", "non-vet-legend-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", 20)
      .attr("x", (d, index) => {
        return index == 0 ? 0 : vis.config.legendRectWidth;
      })
      .text((d) => Math.round(d.value * 10) / 10);

    // Update gradient for legends
    vis.vetLinearGradient
      .selectAll("stop")
      .data(vis.vetLegendStops)
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);
    vis.nonVetLinearGradient
      .selectAll("stop")
      .data(vis.nonVetLegendStops)
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    vis.vetLegendRect.attr("fill", "url(#vet-legend-gradient)");
    vis.nonVetLegendRect.attr("fill", "url(#non-vet-legend-gradient)");
  }

  createStripedPattern(firstStripeColor, secondStripeColor) {
    // Generate ID from colors (removing # for hex values)
    const id = `striped-${firstStripeColor.replace(
      "#",
      ""
    )}-${secondStripeColor.replace("#", "")}`;

    // Check if pattern already exists FIRST
    const existingPattern = document.querySelector(`#${id}`);
    if (existingPattern) {
      return id; // Early return if pattern exists
    }

    // Only proceed with creation if pattern doesn't exist
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "5");
    svg.setAttribute("width", "5");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);

    const pattern = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "pattern"
    );
    pattern.setAttribute("id", id);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "5");
    pattern.setAttribute("height", "5");
    pattern.setAttribute("patternTransform", "rotate(-45)");
    defs.appendChild(pattern);

    // First stripe (transparent)
    const firstStripe = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    firstStripe.setAttribute("x", "0");
    firstStripe.setAttribute("y", "0");
    firstStripe.setAttribute("width", "2.5");
    firstStripe.setAttribute("height", "5");
    firstStripe.setAttribute("fill", firstStripeColor);
    pattern.appendChild(firstStripe);

    // Second stripe (colored)
    const secondStripe = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    secondStripe.setAttribute("x", "2.5");
    secondStripe.setAttribute("y", "0");
    secondStripe.setAttribute("width", "2.5");
    secondStripe.setAttribute("height", "5");
    secondStripe.setAttribute("fill", secondStripeColor);
    pattern.appendChild(secondStripe);

    const existingSvg = document.querySelector("svg");
    if (existingSvg) {
      existingSvg.insertBefore(svg, existingSvg.firstChild);
    } else {
      const container = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      container.style.visibility = "hidden";
      container.style.position = "absolute";
      container.appendChild(svg);
      document.body.appendChild(container);
    }

    return id;
  }
}
