/* js/subwaystations.js */

const subwayStations = AppState.subwayStations;

async function loadSubwayCSV() {
  const response = await fetch("./data/subway_stations.csv");

  return await response.text();
}

function createSubwayMarker(station) {
  const lineColors = {
    "1호선": "#0052A4",
    "2호선": "#00A84D",
    "3호선": "#EF7C1C",
    "4호선": "#00A5DE",
    "5호선": "#996CAC",
    "6호선": "#CD7C2F",
    "7호선": "#747F00",
    "8호선": "#E6186C",
    "9호선": "#BB8336",
    "신분당선": "#C82127",
  };

  const marker = L.circleMarker(
    [station.lat, station.lng],
    {
      radius: 5,
      weight: 2,
      color: lineColors[station.line] || "#666",
      fillColor: lineColors[station.line] || "#666",
      fillOpacity: 0.9,
    }
  );

  marker.bindPopup(`
    <strong>${station.name}</strong><br>
    ${station.line}
  `);

  return marker;
}

function loadSubwayStations() {
  return loadSubwayCSV().then((csv) => {

    const stations = Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
    })
      .data
      .filter((row) => row["역위도"] && row["역경도"])
      .map((row) => ({
        id: row["역번호"],

        name: row["역사명"],

        englishName: row["영문역사명"],

        hanjaName: row["한자역사명"],

        line: row["노선명"],

        lat: row["역위도"],

        lng: row["역경도"],

        updated: row["데이터기준일자"],
      }));

    subwayStations.push(...stations);

    const transitLayers = getTransitLayers();

    subwayStations.forEach((station) => {

      const marker = createSubwayMarker(station);

      station.marker = marker;

      transitLayers.subwayStationsLayer.addLayer(marker);

    });

    console.log(`Loaded ${subwayStations.length} subway stations`);

  });
}

window.loadSubwayStations = loadSubwayStations;