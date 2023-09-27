async function geolocation() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!response.ok) {
      const message = `Geolocation failed, error: ${response.status}`;
      console.log(message);
    } else {
      const coords = await response.json();
      let newCoords = [coords.longitude, coords.latitude];
      map.setCenter(newCoords);
    }
  } catch (err) {
    console.log(err);
  }
}

const populations = ["headstart"];
const longNamePopulations = {
  desktop: {
    headstart: "Head Start",
    tanf: "Temporary Assistance to Needy Families (TANF)",
  },
  mobile: {
    headstart: "Head Start",
    tanf: "TANF",
  },
};

const programPopulations = {
  headstart: "Head Start",
  tanf: "TANF",
};
const titlePopulations = {
  headstart: "Head Start",
  tanf: "TANF",
};
const chartsPopulations = {
  tanf: [
    {
      name: "race and ethnicity",
      column: "race_dat",
      fields: {
        Asian: "Asian",
        Black: "Black",
        Hawaiian: "Hawaian",
        Hispanic: "Hispanic",
        Multiracial: "Multi-racial",
        "Native American": "Native",
        White: "White",
      },
    },
    {
      name: "age",
      column: "age_dat",
      fields: {
        "Younger than 5": "under_5",
        "Between 5 and 17": "5_and_over",
      },
    },
  ],
  headstart: [
    {
      name: "",
      column: "region",
      fields: {
        "American Indian and Alaskan Native":
          "American Indian and Alaskan Native",
        "Migrant and seasonal workers": "Migrant and Seasonal Worker",
      },
    },
  ],
};

const populationBars = {
  PCT_Black: "Black",
  PCT_API: "Asian",
  PCT_Latinx: "Hispanic/Latine",
  PCT_Two: "Multi-racial",
  PCT_AI: "Native",
  PCT_White: "White",
};

const mapButtons = ["combined map", "risk map", "head start map"];
const mapColors = {
  "combined map": "#FDBF11",
  "risk map": "#E46AA7",
  "head start map": "#1696D2",
};
const mapLabels = {
  "combined map": "Exposure + Head Start Map",
  "risk map": "Exposure map",
  "head start map": "head start map",
};

const maps = ["block-groups", "zctas"];
const longNameMaps = {
  "block-groups": "block group",
  zctas: "ZCTA",
  tracts: "tract",
};
const tooltipMaps = {
  "block-groups":
    "Block groups are subsets of Census tracts and are the smallest geographic area over which the Census collects data.",
  zctas:
    "ZCTAs are geographic representations of zip codes created by the Census Bureau. An area's ZCTA is often, but not always, the same as its zip code.",
  tracts:
    "Census tracts are subsets of counties that stay relatively consistent between each decennial census. On average, tracts have 4,000 inhabitants.",
};

const risks = {
  headstart: [
    "P_PM25",
    "P_OZONE",
    "P_DSLPM",
    "P_CANCER",
    "P_RESP",
    "P_LEAD",
    "P_PCT_IMPERVIOUS",
    "P_HEAT_RISK",
    "P_FLOOD_RISK",
    "P_FIRE_RISK",
  ],
  tanf: [
    "PM25",
    "OZONE",
    "DSLPM",
    "CANCER",
    "RESP",
    "P_LDPNT",
    "heat",
    "precipitation",
  ],
};
const risksByGeography = {
  "block-groups": [
    "P_PM25",
    "P_OZONE",
    "P_DSLPM",
    "P_CANCER",
    "P_RESP",
    "P_LEAD",
  ],
  zctas: [
    "P_PM25",
    "P_OZONE",
    "P_DSLPM",
    "P_CANCER",
    "P_RESP",
    "P_LEAD",
    "P_PCT_IMPERVIOUS",
    "P_HEAT_RISK",
    "P_FLOOD_RISK",
    "P_FIRE_RISK",
  ],
  tracts: ["P_PCT_IMPERVIOUS", "P_HEAT_RISK", "P_FLOOD_RISK", "P_FIRE_RISK"],
};

function getGeographyByRisk(risk) {
  return Object.keys(risksByGeography).filter((key) =>
    risksByGeography[key].includes(risk)
  );
}

const longNameRisk = {
  P_PM25: "Air quality",
  P_OZONE: "Ozone concentration",
  P_DSLPM: "Diesel exhaust",
  P_CANCER: "Airborne carcinogens",
  P_RESP: "Air pollution",
  P_LEAD: "Lead exposure",
  P_PCT_IMPERVIOUS: "Paved land area",
  P_HEAT_RISK: "Extreme heat",
  P_FLOOD_RISK: "Flood exposure",
  P_FIRE_RISK: "Wildfire exposure",
};

const descriptionRisk = {
  P_PM25:
    "Microscopic inhalable particles in the air caused by pollution can damage people’s lungs and heart. Repeated exposure to air pollution can lead to <a href='https://www.epa.gov/pm-pollution/health-and-environmental-effects-particulate-matter-pm' target='_blank'>long-term health effects</a> for children, such as lung and heart disease in adulthood.",
  P_OZONE:
    "Although ozone in the atmosphere helps shield the planet from harmful ultraviolet rays, at ground level, higher concentrations of ozone can negatively affect people’s lung function. For children, repeated exposure to high ozone levels can cause permanent damage to their still developing lungs.",
  P_DSLPM:
    "<a href='https://ww2.arb.ca.gov/resources/overview-diesel-exhaust-and-health' target='_blank'>The soot produced by diesel engines</a>, diesel exhaust consists of more than 40 cancer-causing substances. Studies have shown that children who ride in diesel-fueled school buses or who live along major thoroughfares may have an <a href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC121970/' target='_blank'>increased risk of asthma and of developing cancer</a> later in life.",
  P_CANCER:
    "Air toxins—hazardous air pollutants that have been shown to increase lifetime cancer risk—are produced by vehicular traffic, power plants, wildfires, and more. Children are <a href='https://www.epa.gov/pm-pollution/health-and-environmental-effects-particulate-matter-pm' target='_blank'>more sensitive to these toxins</a> as their bodies are still developing, and they breathe more air relative to their body weight.",
  P_RESP:
    "The Respiratory Hazard Index compares an area’s exposure to hazardous air pollutants with the levels that can harm a person’s health. Children are <a href='https://www.epa.gov/pm-pollution/health-and-environmental-effects-particulate-matter-pm' target='_blank'>more susceptible to airborne pollution</a>, which can lead to lung and health problems.",
  P_LEAD:
    "In 1978, the federal government banned the use of lead in consumer products because of its harmful health effects, such as brain damage. <a href='https://www.cdc.gov/nceh/features/leadpoisoning/index.html' target='_blank'>Children’s exposure to lead</a> can stunt learning and development and cause hearing and speech problems.",
  P_PCT_IMPERVIOUS:
    "Impervious surfaces, or areas paved over with asphalt and other substances that do not let rainwater through, are common in our car-dependent culture but are associated with many negative health effects. Studies show that <a href='https://www.sciencedirect.com/science/article/pii/S0160412022001222' target='_blank'>exposure to paved surfaces may negatively affect children’s development</a>, while exposure to green spaces improves it.",
  P_HEAT_RISK:
    "Over the past 60 years, heat waves have become <a href='https://www.epa.gov/climate-indicators/climate-change-indicators-heat-waves' target='_blank'>longer, more frequent, and more intense</a> in the United States. Because children have less body mass, they are <a href='https://www.epa.gov/children/protecting-childrens-health-during-and-after-natural-disasters-extreme-heat' target='_blank'>more susceptible to dehydration and death</a> during extreme heat events.",
  P_FLOOD_RISK:
    "Flooding, which is increasing in frequency because of climate change, can cause power failures and contaminated groundwater, both of which pose health risks. <a href='https://www.epa.gov/children/protecting-childrens-health-during-and-after-natural-disasters' target='_blank'>Children are more vulnerable</a> to any chemicals or toxins released into the water as their bodies are still developing.",
  P_FIRE_RISK:
    "Wildfires releases dozens of air pollutants and carcinogens into the atmosphere, all of which can cause long-term lung and heart damage. For children, <a href='https://www.epa.gov/children/protecting-childrens-health-during-and-after-natural-disasters-wildfires-volcanic-ash' target='_blank'>these risks are greater</a> as they tend to spend more time outdoors than adults and may inhale more smoke as a result. ",
};

const bins = {
  "Very high": {
    color: "#CA5800",
    value: "90% to 100%",
  },
  High: {
    color: "#E88E2D",
    value: "75% to 90%",
  },
  Medium: {
    color: "#FDBF11",
    value: "50% to 75%",
  },
  Low: {
    color: "#FDD870",
    value: "0% to 50%",
  },
};

const legendBins = [
  "Very high",
  "High",
  "Medium",
  "Low",
  "No data available<sup>a</sup>",
];

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

let state = {
  data: null,
  counties: null,
  population: null,
  risk: null,
  geoid: null,
  clicked: null,
  hovered: null,
  selected: null,
  bin: null,
  geography: null,
  map: null,
  drawer: null,
};
state.population = populations[0];
state.risk = risks[state.population][0];
state.map = mapButtons[0];
state.geoid = "GEOID";
state.bin = "Very high";
state.drawer = "drawer-scores";
d3.select("#program").html(titlePopulations[state.population]);

const maxBarLength = 120;
const barHeightHS = 30;
const barHeightTANF = 20;
const barColor = "#1696D2";

const xScale = d3.scaleLinear().range([0, maxBarLength]).domain([0, 1]);

function getGeoId(geography) {
  return geography === "zctas" ? "GEOID10" : "id";
}

function getLayer(population, risk) {
  if (population === "tanf") {
    state.geoid = "GEOID10";
  } else {
    state.geoid = "GEOID";
  }
  return getGeography(population, risk) + "-" + risk;
}

function getGeography(population, risk) {
  if (population === "tanf") {
    return "zctas";
  } else {
    return "block-groups";
  }
}

function getGeographies(population) {
  if (population === "tanf") {
    return ["zctas"];
  } else {
    return ["block-groups", "zctas", "tracts"];
  }
}

const popup = new mapboxgl.Popup({
  className: "mbCustomPopup",
  closeButton: false,
  offset: 20,
});

function IS_MOBILE() {
  return d3.select("#isMobile").style("display") === "block";
}
mapboxgl.accessToken =
  "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/urbaninstitute/cljsqmnbu01bh01pa6vno954h",
  center: [-95.712891, 37.09024],
  zoom: 4,
  maxZoom: 11,
  minZoom: 4,
});

map.addControl(
  new mapboxgl.NavigationControl({ showCompass: false }),
  "bottom-right"
);
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "us",
    mapboxgl: mapboxgl,
  })
);

function getLegendColors(legendBin) {
  if (legendBin === "Very high") {
    return state.map === "combined map"
      ? "#CA5800"
      : state.map === "risk map"
      ? "#AF1F6B"
      : "#12719E";
  } else if (legendBin === "High") {
    return state.map === "combined map"
      ? "#E88E2D"
      : state.map === "risk map"
      ? "#EC008B"
      : "#1696D2";
  } else if (legendBin === "Medium") {
    return state.map === "combined map"
      ? "#FDBF11"
      : state.map === "risk map"
      ? "#E54096"
      : "#73BFE2";
  } else if (legendBin === "Low") {
    return state.map === "combined map"
      ? "#FDD870"
      : state.map === "risk map"
      ? "#E46AA7"
      : "#A2D4EC";
  } else if (legendBin === "No data available<sup>a</sup>") {
    return "#e3e3e3";
  }
}

function getColorByScore(score) {
  if (score < 0 || score > 1) {
    return "#e3e3e3";
  } else if (0 <= score && score <= 0.5) {
    return state.map === "combined map"
      ? "#FDD870"
      : state.map === "risk map"
      ? "#E46AA7"
      : "#A2D4EC";
  } else if (score <= 0.75) {
    return state.map === "combined map"
      ? "#FDBF11"
      : state.map === "risk map"
      ? "#E54096"
      : "#73BFE2";
  } else if (score <= 0.9) {
    return state.map === "combined map"
      ? "#E88E2D"
      : state.map === "risk map"
      ? "#EC008B"
      : "#1696D2";
  } else if (score <= 1.0) {
    return state.map === "combined map"
      ? "#CA5800"
      : state.map === "risk map"
      ? "#AF1F6B"
      : "#12719E";
  }
}

map.on("load", () => {
  map.addLayer({
    id: "headstart-tracts-strokes",
    type: "line",
    source: "composite",
    "source-layer": "tracts",
    layout: {},
    paint: {
      "line-color": "#000000",
      "line-width": 3,
      "line-opacity": [
        "case",
        ["==", ["get", "GEOID"], ["feature-state", "id"]],
        1,
        0,
      ],
    },
  });

  map.addLayer({
    id: "headstart-zctas-strokes",
    type: "line",
    source: "composite",
    "source-layer": "zcta-79lemq",
    layout: {},
    paint: {
      "line-color": "#000000",
      "line-width": 3,
      // 'line-opacity': 1
      "line-opacity": [
        "case",
        ["==", ["get", "GEOID"], ["feature-state", "id"]],
        1,
        0,
      ],
    },
  });

  map.addLayer({
    id: "headstart-block-groups-strokes",
    type: "line",
    source: "composite",
    "source-layer": "blockgroups",
    layout: {},
    paint: {
      "line-color": "#000000",
      "line-width": 3,
      // 'line-opacity': 1
      "line-opacity": [
        "case",
        ["==", ["get", "GEOID"], ["feature-state", "id"]],
        1,
        0,
      ],
    },
  });

  populations.forEach((p) => {
    let geographies = getGeographies(p);
    geographies.forEach((g) => {
      risksByGeography[g].forEach((r) => {
        const riskFields = ["", "CUME_"];

        riskFields.forEach((rf) => {
          const riskField = rf + r;
          const layer = p + "-" + g + "-" + riskField;
          if (!IS_MOBILE()) {
            map.on("mousemove", layer, (e) => {
              if (e.features.length > 0) {
                if (state.hovered !== null) {
                  map.setFeatureState(
                    {
                      source: "composite",
                      sourceLayer: state.hovered.sourceLayer,
                      id: state.hovered.id,
                    },
                    { id: null }
                  );
                }

                if (state.clicked !== null) {
                  map.setFeatureState(
                    {
                      source: "composite",
                      sourceLayer: state.clicked.sourceLayer,
                      id: state.clicked.id,
                    },
                    { id: null }
                  );
                  // map.setLayoutProperty(p + '-' + g + '-strokes', 'visibility', 'none');
                }

                if (e.features[0].properties.hasOwnProperty(riskField)) {
                  state.hovered = e.features[0];
                  state.hovered.lat = +e.lngLat.lat;
                  state.hovered.lng = +e.lngLat.lng;
                  showTooltip(state.hovered, r);

                  map.setFeatureState(
                    {
                      source: "composite",
                      sourceLayer: state.hovered.sourceLayer,
                      id: state.hovered.id,
                    },
                    { id: state.hovered.properties.GEOID }
                  );
                }
              }
            });
          }

          map.on("click", layer, (e) => {
            if (e.features.length > 0) {
              if (state.clicked !== null) {
                if (state.clicked.id === e.features[0].id) {
                  map.setFeatureState(
                    {
                      source: "composite",
                      sourceLayer: e.features[0].sourceLayer,
                      id: e.features[0].id,
                    },
                    { id: null }
                  );
                  state.clicked = null;
                  hideTooltip(false);
                  return false;
                } else {
                  map.setFeatureState(
                    {
                      source: "composite",
                      sourceLayer: state.clicked.sourceLayer,
                      id: state.clicked.id,
                    },
                    { id: null }
                  );
                }
              }

              if (e.features[0].properties.hasOwnProperty(riskField)) {
                state.clicked = e.features[0];
                state.clicked.lat = +e.lngLat.lat;
                state.clicked.lng = +e.lngLat.lng;
                showTooltip(state.clicked, r);

                map.setFeatureState(
                  {
                    source: "composite",
                    sourceLayer: state.clicked.sourceLayer,
                    id: state.clicked.id,
                  },
                  { id: state.clicked.properties.GEOID }
                );

                const geography = state.clicked.sourceLayer.includes("zcta")
                  ? "zctas"
                  : state.clicked.sourceLayer.includes("tract")
                  ? "tracts"
                  : "block-groups";

                let countyName;
                if (geography === "block-groups" || geography === "tracts") {
                  const bgCode = "" + state.clicked.properties.GEOID;
                  const stateCode = bgCode.slice(0, 2);
                  const countyCode = bgCode.slice(2, 5);
                  const county = state.counties.filter(
                    (d) =>
                      (d.state_code === stateCode) &
                      (d.county_code === countyCode)
                  )[0];
                  countyName = `${county.county}, ${county.state}`;
                } else {
                  countyName = state.data[state.clicked.properties.GEOID];
                }

                gtag(
                  "event",
                  "button_click", //eventName
                  {
                    "firing-module-name":
                      "environmental-risks-and-children-head-start", //firingModuleName
                    "button-select": "geography",
                    "target-geoid": state.clicked.properties.GEOID,
                    "county-select": countyName,
                    "map-select": state.map,
                    "risk-select": r,
                  }
                );
              }
            }
          });

          map.on("mouseleave", layer, () => {
            hideTooltip(false);
            if (state.hovered !== null) {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.hovered.sourceLayer,
                  id: state.hovered.id,
                },
                { id: null }
              );
            }
            if (state.clicked !== null) {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.clicked.sourceLayer,
                  id: state.clicked.id,
                },
                { id: state.clicked.properties.GEOID }
              );
              showTooltip(state.clicked, r);
            }
            state.hovered = null;
          });
        });
      });
      const hsLayer = p + "-" + g + "-P_SLOTS";

      if (!IS_MOBILE()) {
        map.on("mousemove", hsLayer, (e) => {
          if (e.features.length > 0) {
            if (state.hovered !== null) {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.hovered.sourceLayer,
                  id: state.hovered.id,
                },
                { id: null }
              );
            }

            if (state.clicked !== null) {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.clicked.sourceLayer,
                  id: state.clicked.id,
                },
                { id: null }
              );
            }

            if (e.features[0].properties.hasOwnProperty("P_SLOTS")) {
              state.hovered = e.features[0];
              state.hovered.lat = +e.lngLat.lat;
              state.hovered.lng = +e.lngLat.lng;
              showTooltip(state.hovered, state.risk);

              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.hovered.sourceLayer,
                  id: state.hovered.id,
                },
                { id: state.hovered.properties.GEOID }
              );
            }
          }
        });
      }

      map.on("click", hsLayer, (e) => {
        if (e.features.length > 0) {
          if (state.clicked !== null) {
            if (state.clicked.id === e.features[0].id) {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: e.features[0].sourceLayer,
                  id: e.features[0].id,
                },
                { id: null }
              );
              state.clicked = null;
              hideTooltip(false);
              return false;
            } else {
              map.setFeatureState(
                {
                  source: "composite",
                  sourceLayer: state.clicked.sourceLayer,
                  id: state.clicked.id,
                },
                { id: null }
              );
            }
          }

          if (e.features[0].properties.hasOwnProperty("P_SLOTS")) {
            state.clicked = e.features[0];
            state.clicked.lat = +e.lngLat.lat;
            state.clicked.lng = +e.lngLat.lng;
            showTooltip(state.clicked, state.risk);

            map.setFeatureState(
              {
                source: "composite",
                sourceLayer: state.clicked.sourceLayer,
                id: state.clicked.id,
              },
              { id: state.clicked.properties.GEOID }
            );

            const geography = state.clicked.sourceLayer.includes("zcta")
              ? "zctas"
              : state.clicked.sourceLayer.includes("tract")
              ? "tracts"
              : "block-groups";

            let countyName;
            if (geography === "block-groups" || geography === "tracts") {
              const bgCode = "" + state.clicked.properties.GEOID;
              const stateCode = bgCode.slice(0, 2);
              const countyCode = bgCode.slice(2, 5);
              const county = state.counties.filter(
                (d) =>
                  (d.state_code === stateCode) & (d.county_code === countyCode)
              )[0];
              countyName = `${county.county}, ${county.state}`;
            } else {
              countyName = state.data[state.clicked.properties.GEOID];
            }

            gtag(
              "event",
              "button_click", //eventName
              {
                "firing-module-name":
                  "environmental-risks-and-children-head-start", //firingModuleName
                "button-select": "geography-desktop",
                "target-geoid": state.clicked.properties.GEOID,
                "county-select": countyName,
                "map-select": state.map,
                "risk-select": r,
              }
            );
          }
        }
      });

      map.on("mouseleave", hsLayer, () => {
        hideTooltip(false);
        if (state.hovered !== null) {
          map.setFeatureState(
            {
              source: "composite",
              sourceLayer: state.hovered.sourceLayer,
              id: state.hovered.id,
            },
            { id: null }
          );
        }
        if (state.clicked !== null) {
          map.setFeatureState(
            {
              source: "composite",
              sourceLayer: state.clicked.sourceLayer,
              id: state.clicked.id,
            },
            { id: state.clicked.properties.GEOID }
          );
          showTooltip(state.clicked, state.risk);
        }
        state.hovered = null;
      });
    });
  });
});

function getPercent(score) {
  if (score < 0) {
    return "NA";
  }
  return (score * 100).toFixed(1);
}

const arrowSVG =
  '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.756 9.4C31.939 9.13333 32.2593 9 32.5796 9C32.8999 9 33.2202 9.13333 33.449 9.4L47.5882 23.1333C47.8627 23.3556 48 23.6222 48 23.9778C48 24.3333 47.8627 24.6 47.5882 24.8222L33.449 38.6C33.266 38.8667 32.9457 39 32.5796 39C32.2135 39 31.939 38.8667 31.756 38.6L29.6053 36.6C29.3308 36.3333 29.1935 36.0222 29.1935 35.6667C29.1935 35.3111 29.3308 35.0444 29.6053 34.8222L38.2993 26.6889H1.28122C0.915157 26.6889 0.64061 26.5556 0.366063 26.3333C0.0915157 26.1111 0 25.8 0 25.4444V22.5556C0 22.2 0.137274 21.9333 0.366063 21.6667C0.594852 21.4 0.915157 21.3111 1.28122 21.3111H38.2993L29.6053 13.1778C29.3308 12.9556 29.1935 12.6889 29.1935 12.3333C29.1935 11.9778 29.3308 11.6667 29.6053 11.4L31.756 9.4Z" fill="black"/></svg>';

function showTooltip(feature, risk) {
  state.selected = feature;
  const ll = new mapboxgl.LngLat(feature.lng, feature.lat);
  const geography = feature.sourceLayer.includes("zcta")
    ? "zctas"
    : feature.sourceLayer.includes("tract")
    ? "tracts"
    : "block-groups";

  const slots = +feature.properties["P_SLOTS"];
  const reportedSlots = +feature.properties["total_funded_slots"];
  const cumeP = +feature.properties["CUME_" + risk];
  const riskP =
    geography === "zctas"
      ? +feature.properties[risk + "_ej"]
      : +feature.properties[risk];
  // const split = feature.sourceLayer.split('-')[0];
  // const geography = split === 'bg' ? 'block-groups' : 'zctas';
  // if (geography === 'blockgroups') geography = 'block-groups';
  // const treatmentScore = +feature.properties['P_SLOTS'];

  var clickHere = IS_MOBILE()
    ? '<span class="clickHereTT">SEE MORE' + arrowSVG + "</span>"
    : "";
  var tooltip = IS_MOBILE()
    ? ""
    : '<div class="help-tip"><p>' + tooltipMaps[geography] + "</p></div>";
  let popupHTML;

  let countyName;
  let geoid;

  if (geography === "block-groups") {
    geoid =
      feature.properties.GEOID < 100000000000
        ? "0" + feature.properties.GEOID
        : "" + feature.properties.GEOID;
    const stateCode = geoid.slice(0, 2);
    const countyCode = geoid.slice(2, 5);
    const county = state.counties.filter(
      (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
    )[0];
    popupHTML = county.county + "</br>Block group " + geoid.slice(5);
    countyName = `${county.county}, ${county.state}`;
  } else if (geography === "tracts") {
    geoid =
      feature.properties.GEOID < 10000000000
        ? "0" + feature.properties.GEOID
        : "" + feature.properties.GEOID;
    const stateCode = geoid.slice(0, 2);
    const countyCode = geoid.slice(2, 5);
    const county = state.counties.filter(
      (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
    )[0];
    popupHTML = county.county + "</br>Tract " + geoid.slice(5);
    countyName = `${county.county}, ${county.state}`;
  } else {
    geoid =
      feature.properties.GEOID < 10000
        ? "0" + feature.properties.GEOID
        : "" + feature.properties.GEOID;
    popupHTML = state.data[geoid] + "</br>ZCTA " + geoid;
    countyName = state.data[geoid];
  }
  popup
    .setLngLat(ll)
    .setHTML(popupHTML + clickHere)
    .addTo(map);

  d3.selectAll(".clickHereTT").on("click", function () {
    d3.select("#sidebar").classed("active", true);
    d3.select("#screen")
      .classed("active", true)
      .on("click", () => {
        d3.select("#sidebar").classed("active", false);
        d3.select("#screen").classed("active", false);
      });

    const geography = state.clicked.sourceLayer.includes("zcta")
      ? "zctas"
      : feature.sourceLayer.includes("tract")
      ? "tracts"
      : "block-groups";

    let countyName;
    if (geography === "block-groups" || geography === "tracts") {
      const bgCode =
        feature.properties.GEOID < 100000000000
          ? "0" + feature.properties.GEOID
          : "" + feature.properties.GEOID;
      const stateCode = bgCode.slice(0, 2);
      const countyCode = bgCode.slice(2, 5);
      const county = state.counties.filter(
        (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
      )[0];
      countyName = `${county.county}, ${county.state}`;
    } else {
      countyName = state.data[state.clicked.properties.GEOID];
    }

    gtag(
      "event",
      "button_click", //eventName
      {
        "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
        "button-select": "geography-mobile",
        "target-geoid": state.clicked.properties.GEOID,
        "county-select": countyName,
        "map-select": state.map,
        "risk-select": r,
      }
    );
  });

  d3.select("#call-to-action").style("display", "none");
  if (state.map === "combined map") {
    d3.select("#drawers").style("display", "block");
    d3.select("#title-layerName").html("Exposure score");
    d3.select("#countyName").html(countyName);
    d3.select("#tractName").html(
      longNameMaps[geography] + " " + geoid + tooltip
    );
    d3.select("#activeScore")
      .text(getPercent(cumeP))
      .style("border-bottom-color", getColorByScore(cumeP));
    d3.select("#score-details").style("display", "grid");
    d3.select("#hs-score").style("display", "block");
    d3.select("#er-score").style("display", "block");
    d3.select("#hs-score").html(
      `<span class="left-aligned">Head Start reported slots</span><span class="right-aligned">${
        reportedSlots < 0 ? "NA" : reportedSlots
      }</span>`
    );
    d3.select("#er-score").html(
      `<span class="left-aligned">${
        longNameRisk[state.risk]
      }</span><span class="right-aligned">${getPercent(riskP)}</span>`
    );
  } else if (state.map === "risk map") {
    d3.select("#drawers").style("display", "block");
    d3.select("#title-layerName").html("Hazard exposure");
    d3.select("#countyName").html(countyName);
    d3.select("#tractName").html(
      longNameMaps[geography] + " " + geoid + tooltip
    );
    d3.select("#activeScore")
      .text(getPercent(riskP))
      .style("border-bottom-color", getColorByScore(riskP));
    d3.select("#score-details").style("display", "grid");
    d3.select("#hs-score").style("display", "none");
    d3.select("#er-score").style("display", "none");
  } else if (state.map === "head start map") {
    d3.select("#drawers").style("display", "block");
    d3.select("#title-layerName").html("Head Start</br>Reported Slots");
    d3.select("#countyName").html(countyName);
    d3.select("#tractName").html(
      longNameMaps[geography] + " " + geoid + tooltip
    );
    d3.select("#activeScore")
      .text(reportedSlots < 0 ? "NA" : reportedSlots)
      .style("border-bottom-color", getColorByScore(slots));
    d3.select("#score-details").style("display", "grid");
    d3.select("#hs-score").style("display", "none");
    d3.select("#er-score").style("display", "none");
  }
  d3.select(".clearNeighborhood").classed("active", true);
  d3.select(".clearNeighborhood-mobile").classed("active", true);
  updateDrawers();
  updateHeight();
}

function updateDrawers() {
  if (state.map === "head start map") {
    d3.selectAll(".drawer").style("display", "block");
    d3.select("#drawer-scores").style("display", "none");
    if (state.drawer === "drawer-population") {
      d3.select("#drawer-population-title").classed("checked", true);
      d3.select("#drawer-population-graph").classed("show-drawer-data", true);
    } else {
      d3.select("#drawer-population-title").classed("checked", false);
      d3.select("#drawer-population-graph").classed("show-drawer-data", false);
    }
  } else {
    d3.selectAll(".drawer").style("display", "block");
    d3.select("#drawer-scores-title").classed(
      "checked",
      state.drawer === "drawer-scores"
    );
    d3.select("#drawer-scores-graph").classed(
      "show-drawer-data",
      state.drawer === "drawer-scores"
    );
    d3.select("#drawer-population-title").classed(
      "checked",
      state.drawer === "drawer-population"
    );
    d3.select("#drawer-population-graph").classed(
      "show-drawer-data",
      state.drawer === "drawer-population"
    );
  }

  if (state.selected !== null) {
    const geography = state.selected.sourceLayer.includes("zcta")
      ? "zctas"
      : state.selected.sourceLayer.includes("tract")
      ? "tracts"
      : "block-groups";

    const prefix = state.map === "combined map" ? "CUME_" : "";
    const suffix =
      state.map === "risk map" && geography === "zctas" ? "_ej" : "";

    let scores = d3
      .select("#drawer-scores-graph")
      .selectAll(".score")
      .data(
        risksByGeography[geography].filter(
          (d) =>
            d !== state.risk &&
            state.selected.properties[prefix + d + suffix] >= 0
        )
      );

    scores
      .enter()
      .append("div")
      .attr("class", "score")
      .html((d) => {
        const randomNumber = state.selected.properties[prefix + d + suffix];
        return `<span class="left-aligned">${
          longNameRisk[d]
        }</span><span class="right-aligned underlined" style="border-bottom-color: ${getColorByScore(
          randomNumber
        )};">${getPercent(randomNumber)}</span>`;
      });

    scores.attr("class", "score").html((d) => {
      const randomNumber = state.selected.properties[prefix + d + suffix];
      return `<span class="left-aligned">${
        longNameRisk[d]
      }</span><span class="right-aligned underlined" style="border-bottom-color: ${getColorByScore(
        randomNumber
      )};">${getPercent(randomNumber)}</span>`;
    });

    scores.exit().remove();

    let chartRow = d3
      .select("#drawer-population-graph")
      .selectAll(".chart-row")
      .data((d) =>
        Object.keys(populationBars).map((key) => {
          let obj = {};
          obj["name"] = populationBars[key];
          obj["perc"] = state.selected.properties[key];
          obj["perc_string"] =
            obj["perc"] === null ? "NA" : getPercent(obj["perc"]);
          obj["height"] = barHeightTANF;
          obj["width"] = obj["perc"] === null ? 0 : xScale(obj["perc"]);
          return obj;
        })
      );

    chartRow.enter().append("div").attr("class", "chart-row");

    chartRow.attr("class", "chart-row");

    chartRow.exit().remove();

    let barName = d3
      .select("#drawer-population-graph")
      .selectAll(".chart-row")
      .selectAll(".bar-name")
      .data((d) => [d]);

    barName
      .enter()
      .append("div")
      .attr("class", "bar-name")
      .html((d) => d.name);

    barName.attr("class", "bar-name").html((d) => d.name);

    barName.exit().remove();

    let barOffset = 60;

    let barSvg = d3
      .select("#drawer-population-graph")
      .selectAll(".chart-row")
      .selectAll(".bar-svg")
      .data((d) => [d]);

    barSvg
      .enter()
      .append("svg")
      .attr("class", "bar-svg")
      .attr("width", (d) => d.width + barOffset)
      .attr("height", (d) => d.height);

    barSvg
      .attr("class", "bar-svg")
      .attr("width", (d) => d.width + barOffset)
      .attr("height", (d) => d.height);

    barSvg.exit().remove();

    let barRect = d3
      .select("#drawer-population-graph")
      .selectAll(".chart-row")
      .selectAll(".bar-svg")
      .selectAll("rect")
      .data((d) => [d]);

    barRect
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("fill", barColor);

    barRect
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("fill", barColor);

    barRect.exit().remove();

    const xOffset = 8;

    let barPerc = d3
      .select("#drawer-population-graph")
      .selectAll(".chart-row")
      .selectAll(".bar-svg")
      .selectAll("text")
      .data((d) => [d]);

    barPerc
      .enter()
      .append("text")
      .attr("class", "bar-percent")
      .attr("x", (d) => d.width + xOffset)
      .attr("y", (d) => 14 + (d.height - 16) / 2)
      .attr("fill", "black")
      .text((d) =>
        d.perc_string === "NA" ? d.perc_string : d.perc_string + "%"
      );

    barPerc
      .attr("class", "bar-percent")
      .attr("x", (d) => d.width + xOffset)
      .attr("y", (d) => 14 + (d.height - 16) / 2)
      .attr("fill", "black")
      .text((d) =>
        d.perc_string === "NA" ? d.perc_string : d.perc_string + "%"
      );

    barPerc.exit().remove();
  }
}

function hideTooltip(forceHide) {
  if (state.clicked === null || forceHide) {
    if (forceHide) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: state.clicked.sourceLayer,
          id: state.clicked.id,
        },
        { id: null }
      );
    }
    d3.select("#call-to-action").style("display", "block");
    d3.select("#score-details").style("display", "none");
    d3.select("#drawers").style("display", "none");
    d3.select("#title-layerName").html("");
    d3.select("#countyName").html("");
    d3.select("#tractName").html("");
    d3.select("#activeScore").html("");
    d3.select("#hs-score").html("");
    d3.select("#er-score").html("");
    // d3.select("#charts").selectAll(".chart-box").remove();

    d3.select(".clearNeighborhood").classed("active", false);
    d3.select(".clearNeighborhood-mobile").classed("active", false);
    state.clicked = null;
    state.selected = null;
  } else {
    showTooltip(state.clicked);
  }
  // updateBarCharts();
  updateDrawers();
  updateHeight();
  popup.remove();
}

function addOptions(id, values, addStudents) {
  var element = d3.select("#" + id);
  var options = element.selectAll("a").data(values);

  options
    .enter()
    .append("a")
    .html(function (d) {
      return titleCase(longNameRisk[d]);
    });

  options.html(function (d) {
    return titleCase(longNameRisk[d]);
  });

  options.exit().remove();

  return element;
}

function updateRiskDropdown() {
  let dropdownRisk = addOptions("risk-options", risks[state.population]);
  d3.select("#dropdown-risk").on("click", function (d) {
    document.getElementById("risk-options").classList.toggle("show");
  });
  d3.select("#dropdown-risk")
    .select(".dropbtn")
    .html(titleCase(longNameRisk[state.risk]));
  dropdownRisk.selectAll("a").on("click", function (event, d) {
    if (d !== state.risk) {
      state.risk = d;
      d3.select("#dropdown-risk")
        .select(".dropbtn")
        .html(titleCase(longNameRisk[state.risk]));
      const callToActionText =
        state.map === "combined map"
          ? `Select a geography to see its ${
              programPopulations[state.population]
            } recipient risk for ${longNameRisk[state.risk].toLowerCase()}`
          : state.map === "risk map"
          ? `Select a geography to see its risk for ${longNameRisk[
              state.risk
            ].toLowerCase()}`
          : `Select a geography to see its ${
              programPopulations[state.population]
            } reported slots`;
      d3.select("#call-to-action").html(callToActionText);
      // d3.select("#otherLabel").html(`National Levels of Relative ${titleCase(longNameRisk[state.risk])} Exposure`);
      d3.select("#title-layerName").html("");
      d3.select("#countyName").html("");
      d3.select("#tractName").html("");
      updateRiskDescription();
      setActiveLayer();
      updateLegend();
      updateMapButtons();
      // updateBarCharts();
      updateDrawers();

      gtag(
        "event",
        "button_click", //eventName
        {
          "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
          "button-select": "dropdown-risk",
          "risk-select": longNameRisk[d],
          "map-select": state.map,
        }
      );
    }
  });
}

function updateRiskDescription() {
  d3.select("#factorDetails").html(descriptionRisk[state.risk]);
}

function updateMapButtons() {
  d3.select("#mapButtons")
    .selectAll(".map-button")
    .data(mapButtons)
    .join("div")
    .attr("class", "map-button")
    .style("background-color", (d) =>
      d === state.map ? mapColors[state.map] : "white"
    )
    .style("border", (d) =>
      d === state.map
        ? `2px solid ${mapColors[state.map]}`
        : "2px solid #696969"
    )
    .style("color", (d) => (d === state.map ? "#000" : "#696969"))
    .html((d) => mapLabels[d])
    .on("click", (evt, d) => {
      state.map = d;
      state.drawer =
        d === "head start map" ? "drawer-population" : "drawer-scores";
      updateDrawers();
      updateMapButtons();
      setActiveLayer();
      updateLegend();

      gtag(
        "event",
        "button_click", //eventName
        {
          "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
          "button-select": "map-button",
          "risk-select": longNameRisk[state.risk],
          "map-select": d,
        }
      );
    });

  d3.select("#selectMapTitle").html(() => {
    if (state.map === "head start map") {
      return "Map shows Head Start participants";
    } else if (state.map === "combined map") {
      if (["P_FLOOD_RISK", "P_FIRE_RISK"].includes(state.risk)) {
        return `Map shows <span class='map-risk'>${longNameRisk[
          state.risk
        ].toLowerCase()}</span> for Head Start participants`;
      } else {
        return `Map shows <span class='map-risk'>${longNameRisk[
          state.risk
        ].toLowerCase()}</span> risk for Head Start participants`;
      }
    } else {
      if (["P_FLOOD_RISK", "P_FIRE_RISK"].includes(state.risk)) {
        return `Map shows <span class='map-risk'>${longNameRisk[
          state.risk
        ].toLowerCase()}</span>`;
      } else {
        return `Map shows <span class='map-risk'>${longNameRisk[
          state.risk
        ].toLowerCase()}</span> risk`;
      }
    }
  });
}

function initControls() {
  updateRiskDropdown();
  updateRiskDescription();
  updateMapButtons();

  d3.select(".clearNeighborhood").on("click", function () {
    const geography = state.clicked.sourceLayer.includes("zcta")
      ? "zctas"
      : state.clicked.sourceLayer.includes("tract")
      ? "tracts"
      : "block-groups";

    let countyName;
    if (geography === "block-groups" || geography === "tracts") {
      const bgCode = "" + state.clicked.properties.GEOID;
      const stateCode = bgCode.slice(0, 2);
      const countyCode = bgCode.slice(2, 5);
      const county = state.counties.filter(
        (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
      )[0];
      countyName = `${county.county}, ${county.state}`;
    } else {
      countyName = state.data[state.clicked.properties.GEOID];
    }

    gtag(
      "event",
      "button_click", //eventName
      {
        "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
        "button-select": "clear-selection",
        "geography-select": state.clicked.properties.GEOID,
        "county-select": countyName,
        "risk-select": state.risk,
        "map-select": state.map,
      }
    );

    hideTooltip(true);
  });
  d3.select(".clearNeighborhood-mobile").on("click", function () {
    let countyName;
    if (geography === "block-groups" || geography === "tracts") {
      const bgCode = "" + state.clicked.properties.GEOID;
      const stateCode = bgCode.slice(0, 2);
      const countyCode = bgCode.slice(2, 5);
      const county = state.counties.filter(
        (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
      )[0];
      countyName = `${county.county}, ${county.state}`;
    } else {
      countyName = state.data[state.clicked.properties.GEOID];
    }

    gtag(
      "event",
      "button_click", //eventName
      {
        "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
        "button-select": "clear-selection-mobile",
        "geography-select": state.clicked.properties.GEOID,
        "county-select": countyName,
        "risk-select": longNameRisk[state.risk],
        "map-select": state.map,
      }
    );

    hideTooltip(true);
  });
  d3.select(".styled-checkbox").on("change", function () {
    var vis = this.checked ? "visible" : "none";
    map.setLayoutProperty("boundary-8l34or", "visibility", vis);
  });
  d3.selectAll(".closeMobileTT").on("click", function () {
    d3.select("#sidebar").classed("active", false);
    d3.select("#screen").classed("active", false);
  });

  window.onclick = function (event) {
    if (!event.target.matches("#dropbtn-risk")) {
      var dropdown = document.getElementById("risk-options");
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    }
    if (!event.target.classList.contains("chart-dropbtn")) {
      var dropdown = d3
        .selectAll(".chart-dropdown-content")
        .classed("show", false);
    }
  };

  function showDrawer(event, d) {
    const drawerId = event.target.id.split("-").slice(0, 2).join("-");

    const geography = state.clicked.sourceLayer.includes("zcta")
      ? "zctas"
      : state.clicked.sourceLayer.includes("tract")
      ? "tracts"
      : "block-groups";

    let countyName;
    if (geography === "block-groups" || geography === "tracts") {
      const bgCode = "" + state.clicked.properties.GEOID;
      const stateCode = bgCode.slice(0, 2);
      const countyCode = bgCode.slice(2, 5);
      const county = state.counties.filter(
        (d) => (d.state_code === stateCode) & (d.county_code === countyCode)
      )[0];
      countyName = `${county.county}, ${county.state}`;
    } else {
      countyName = state.data[state.clicked.properties.GEOID];
    }

    gtag(
      "event",
      "button_click", //eventName
      {
        "firing-module-name": "environmental-risks-and-children-head-start", //firingModuleName
        "button-select": "drawer-button",
        "drawer-id": drawerId,
        "geography-select": state.clicked.properties.GEOID,
        "county-select": countyName,
        "risk-select": longNameRisk[state.risk],
        "map-select": state.map,
      }
    );

    if (d3.select(event.target).classed("checked")) {
      state.drawer = null;
      d3.select(event.target).classed("checked", false);
      d3.select(`#${drawerId}-graph`).classed("show-drawer-data", false);
    } else {
      state.drawer = drawerId;
      d3.selectAll(".drawer-title").classed("checked", false);
      d3.selectAll(".drawer-data").classed("show-drawer-data", false);
      d3.select(event.target).classed("checked", true);
      d3.select(`#${drawerId}-graph`).classed("show-drawer-data", true);
    }
  }

  d3.select("#drawer-scores-title").on("click", showDrawer);
  d3.select("#drawer-population-title").on("click", showDrawer);
}
function setActiveLayer() {
  populations.forEach((p) => {
    let geographies = getGeographies(p);
    geographies.forEach((g) => {
      risksByGeography[g].forEach((r) => {
        map.setLayoutProperty(p + "-" + g + "-" + r, "visibility", "none");
        map.setLayoutProperty(p + "-" + g + "-CUME_" + r, "visibility", "none");
        map.setLayoutProperty(p + "-" + g + "-lines", "visibility", "none");
      });
      map.setLayoutProperty(p + "-" + g + "-P_SLOTS", "visibility", "none");
    });
  });

  const geographies = getGeographyByRisk(state.risk);
  geographies.forEach((g) => {
    if (state.map === "combined map") {
      map.setLayoutProperty(
        state.population + "-" + g + "-CUME_" + state.risk,
        "visibility",
        "visible"
      );
    } else if (state.map === "risk map") {
      map.setLayoutProperty(
        state.population + "-" + g + "-" + state.risk,
        "visibility",
        "visible"
      );
    } else if (state.map === "head start map") {
      map.setLayoutProperty(
        state.population + "-" + g + "-P_SLOTS",
        "visibility",
        "visible"
      );
    }

    map.setLayoutProperty(
      state.population + "-" + g + "-lines",
      "visibility",
      "visible"
    );
    // }
  });

  if (geographies !== state.geography) {
    state.geography = getGeography(state.population, state.risk);
    if (state.hovered !== null) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: state.hovered.sourceLayer,
          id: state.hovered.id,
        },
        { id: null }
      );
      state.hovered = null;
    }
    if (state.clicked !== null) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: state.clicked.sourceLayer,
          id: state.clicked.id,
        },
        { id: null }
      );
      state.clicked = null;
    }
    hideTooltip(false);
    const callToActionText =
      state.map === "combined map"
        ? `Select a geography to see its ${
            programPopulations[state.population]
          } recipient risk for ${longNameRisk[state.risk].toLowerCase()}`
        : state.map === "risk map"
        ? `Select a geography to see its risk for ${longNameRisk[
            state.risk
          ].toLowerCase()}`
        : `Select a geography to see its ${
            programPopulations[state.population]
          } reported slots`;
    d3.select("#call-to-action").html(callToActionText);
    d3.select("#title-layerName").html("");
    d3.select("#countyName").html("");
    d3.select("#tractName").html("");
  } else {
    if (state.clicked !== null) {
      showTooltip(state.clicked);
    }
  }

  d3.select("#sideScore")
    .classed("combined", state.map === "combined map")
    .classed("risk", state.map === "risk map")
    .classed("hs", state.map === "head start map");

  updateHeight();
}

function updateLegend() {
  d3.select("#legend")
    .selectAll(".l-title")
    .data(
      state.map === "head start map"
        ? ["Percentile of funded slots"]
        : ["Relative exposure"]
    )
    .join("div")
    .attr("class", "l-title")
    .text((d) => d);

  var row = d3
    .select("#legend")
    .selectAll(".l-row")
    .data(legendBins)
    .join("div")
    .attr("class", "l-row");

  row
    .selectAll(".l-cell")
    .data((d) => [d])
    .join("div")
    .attr("class", "l-cell")
    .style("background-color", (d) => getLegendColors(d));

  row
    .selectAll(".l-text")
    .data((d) => [d])
    .join("div")
    .attr("class", "l-text")
    .style("top", (d) => (d === "No data available<sup>a</sup>" ? "-6px" : "0"))
    .html((d) => d);
}

function updateHeight() {
  var sh = d3.select("#sidebar").node().getBoundingClientRect().height,
    mh = d3.select("#mapContainer").node().getBoundingClientRect().height,
    // bh = d3.select("#buttonContainer").node().getBoundingClientRect().height,
    fh = d3.select("#factor").node().getBoundingClientRect().height,
    ch = d3.select(".clearNeighborhood").node().getBoundingClientRect().height,
    nh = d3.select(".note").node().getBoundingClientRect().height;

  h = Math.max(mh, sh) + fh + ch + nh + 130;
  d3.select("body").style("height", h + "px");

  if (IS_MOBILE()) {
    d3.select("#sidebar").style("top", fh + 30 + "px");
  }
  pymChild.sendHeight();
}

function init() {
  Promise.all([
    d3.json("data/zcta_county_xwalk.json"),
    d3.csv("data/counties.csv"),
  ]).then(function (data) {
    state.data = data[0];
    state.counties = data[1];
    initControls();
    updateLegend();
    setActiveLayer();

    if (IS_MOBILE()) {
      map.scrollZoom.disable();
    }
    geolocation().catch((error) => {
      console.log("Geolocation failed: " + error.message);
    });
  });
}

var pymChild = new pym.Child({});
map.on("load", init);
