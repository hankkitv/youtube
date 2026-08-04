/* js/map.js */

let map;
let markerCluster;


function initializeMap(){

    map = L.map("map", {

    minZoom: 3,

    maxZoom: 19,

    zoomControl:true

})
.setView(
    [37.5638288,126.9800428],
    13
);


    markerCluster =
    L.markerClusterGroup({

        maxClusterRadius:60,

        disableClusteringAtZoom:17,

        showCoverageOnHover:false,

        spiderfyOnMaxZoom:true,

        zoomToBoundsOnClick:true

    });


    map.addLayer(markerCluster);


    setupLayers();


    return map;

}



function setupLayers(){

    const controlLayers =
        L.control.layers(
            null,
            null,
            {
                position:"topright",
                collapsed:false
            }
        )
        .addTo(map);


    const dark =
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                maxZoom:19,
                attribution:
                "© OpenStreetMap © CARTO"
            }
        )
        .addTo(map);



    controlLayers.addBaseLayer(
        dark,
        "Carto Dark"
    );

    const light =
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
                maxZoom:19,
                attribution:
                "© OpenStreetMap © CARTO"
            }
        )
        .addTo(map);



    controlLayers.addBaseLayer(
        light,
        "Carto Light"
    );



    const osm =
        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom:19,
                attribution:
                "© OpenStreetMap"
            }
        );


    controlLayers.addBaseLayer(
        osm,
        "OSM"
    );

    const osmh =
        L.tileLayer(
            "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
            {
                maxZoom:19,
                attribution:
                "© OpenStreetMap contributors"
            }
        );


    controlLayers.addBaseLayer(
        osmh,
        "OSM Humanitarian"
    );

    const esri =
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom:19,
                attribution:
                "© Esri"
            }
        );


    controlLayers.addBaseLayer(
        esri,
        "Esri World Street Map"
    );

    const satellite =
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom:19,
                attribution:
                "© Esri"
            }
        );


    controlLayers.addBaseLayer(
        satellite,
        "Satellite"
    );


}