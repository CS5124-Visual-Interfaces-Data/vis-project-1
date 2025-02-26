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
  const vetC = document.getElementById("vetC-container");
  const nonVetC = document.getElementById("nonVetC-container");
  const comboC = document.getElementById("comboC-container");
  const combineCheckbox = document.getElementById("combine");

  let isAnimating = false;
  async function combineElements() {
    if (isAnimating) return;
    isAnimating = true;

    // Start moving elements toward center
    vetC.style.transform = "translateX(50%)";
    nonVetC.style.transform = "translateX(-50%)";

    // Fade out side elements
    vetC.style.opacity = "0";
    nonVetC.style.opacity = "0";

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Hide side elements completely
    //vetC.style.display = "none";
    //nonVetC.style.display = "none";

    // Show and fade in combined element
    comboC.style.display = "block";
    comboC.style.opacity = "1";

    isAnimating = false;
  }

  async function separateElements() {
    if (isAnimating) return;
    isAnimating = true;

    // Fade out combined element
    comboC.style.opacity = "0";

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Hide combined element completely
    //comboC.style.display = "none";

    // Show side elements
    vetC.style.display = "block";
    nonVetC.style.display = "block";
    vetC.style.opacity = "1";
    nonVetC.style.opacity = "1";

    // Reset positions
    vetC.style.transform = "translateX(0)";
    nonVetC.style.transform = "translateX(0)";

    isAnimating = false;
  }

  // Event listener
  combineCheckbox.addEventListener("change", async (event) => {
    if (isAnimating) {
      event.target.checked = !event.target.checked;
      return;
    }

    if (event.target.checked) {
      await combineElements();
    } else {
      await separateElements();
    }
  });

  const barGraph = new BarGraph(
    {
      parentElement: "#bargraph",
      containerHeight: 625,
      containerWidth: document.width,
    },
    data
  );
  let smolWidth = window.innerWidth / 2.25;
  let smolHeight = smolWidth / 1.25;
  const vetChoroplethMap = new ChoroplethMap(
    {
      parentElement: "#vetChoropleth",
      containerHeight: smolHeight,
      containerWidth: smolWidth,
    },
    data,
    barGraph,
    ChoroplethMapTypes.Vet
  );
  const nonVetChoroplethMap = new ChoroplethMap(
    {
      parentElement: "#nonVetChoropleth",
      containerHeight: smolHeight,
      containerWidth: smolWidth,
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
