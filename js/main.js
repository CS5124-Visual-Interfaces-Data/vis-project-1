import { ChoroplethMapTypes, ChoroplethMap } from "./choropleth.js";
import { BarGraph } from "./bargraph.js";

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
    d.VetsDisabilty = +d.VetsDisabilty;
    d.NonVetsDisabilty = +d.NonVetsDisabilty;
  });

  document.getElementById("popup-exit").addEventListener("click", (event) => {
    document.getElementById("popup").style.display = "none";
  });

  // handle combining
  const vetC = document.getElementById("vetChoropleth");
  const nonVetC = document.getElementById("nonVetChoropleth");
  const comboC = document.getElementById("comboChoropleth");

  let currentlyChanging = false;
  document
    .getElementById("combine")
    .addEventListener("toggle", async (event) => {
      const combine = document.getElementById("combine");
      if (currentlyChanging) {
        combine.checked = !combine.checked;
        return;
      }
      currentlyCombining = true;
      if (combine) {
        comboC.style.opacity = 1;
        await setTimeout(() => {}, 300);
        comboC.style.opacity = 0;
      }
    });

  const barGraph = new BarGraph(
    {
      parentElement: "#bargraph",
      containerHeight: 625,
      containerWidth: 850,
    },
    data
  );
  const vetChoroplethMap = new ChoroplethMap(
    {
      parentElement: "#vetChoropleth",
      containerHeight: 625,
      containerWidth: 850,
    },
    data,
    barGraph,
    ChoroplethMapTypes.Vet
  );
  const nonVetChoroplethMap = new ChoroplethMap(
    {
      parentElement: "#nonVetChoropleth",
      containerHeight: 625,
      containerWidth: 850,
    },
    data,
    barGraph,
    ChoroplethMapTypes.NonVet
  );
  const comboChoroplethMap = new ChoroplethMap(
    {
      parentElement: "#comboChoropleth",
      containerHeight: 625,
      containerWidth: 850,
    },
    data,
    barGraph,
    ChoroplethMapTypes.Combo
  );
});
