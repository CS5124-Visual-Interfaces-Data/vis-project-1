import { ChoroplethMapVis } from "./choropleth.js";

// Read Data
d3.csv("../data/desired_data.csv").then(function (data) {
  console.log(data);

  data.forEach(function (d) {
    // convert values from strings to numbers
    d.cnty_fips = +d.cnty_fips;
    d.percent_inactive = +d.percent_inactive;
    d.percent_smoking = +d.percent_smoking;
    d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
    d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
    d.percent_stroke = +d.percent_stroke;
    d.percent_high_cholesterol = +d.percent_high_cholesterol;
    d.NonVetsDisabilty = +d.VetsDisabilty;
  });

  // Create an instance (for example in main.js)
  const choroplethMapVis = new ChoroplethMapVis(
    {
      parentElement: "#choropleth",
      containerHeight: 1100,
      containerWidth: 1000,
    },
    data
  );
});
