/* js/transit.js */


let subwayStationsLayer;
let busStopsLayer;
let subwayRoutesLayer;


function initializeTransit(map) {

    // const map = getMap();

    if (!map) {
        throw new Error(
            "Map missing"
        );
    }


    subwayStationsLayer = L.layerGroup();

    busStopsLayer = L.layerGroup();

    subwayRoutesLayer = L.layerGroup();


    subwayStationsLayer.addTo(map);

    subwayRoutesLayer.addTo(map);


    console.log("Transit initialized");
}


function getTransitLayers(){

    return {

        busStopsLayer,

        subwayStationsLayer,

        subwayRoutesLayer

    };

}
function getTransitOverlayLayers(){

    return {

        "🚌 Bus Stops":
            busStopsLayer,

        "🚇 Subway Stations":
            subwayStationsLayer,

        "🚉 Subway Lines":
            subwayRoutesLayer

    };

}

window.initializeTransit = initializeTransit;

window.getTransitLayers = getTransitLayers;

window.getTransitOverlayLayers =
    getTransitOverlayLayers;