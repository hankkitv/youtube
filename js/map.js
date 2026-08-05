/* js/map.js */

let map;
let markerCluster;

let baseLayers = {};
let activeBaseLayer = null;


function initializeMap(){


    // 1. Create map FIRST

    map = L.map("map", {

        minZoom:3,

        maxZoom:19,

        zoomControl:false

    })

    .setView(
        [
            37.5638288,
            126.9800428
        ],
        13
    );



    // 2. Create layers

    createBaseLayers();



    // 3. Restore previous layer

    restoreMapLayer();



    // 4. Layer control

    L.control.layers(

        baseLayers,

        null,

        {

            position:"topright",

            collapsed:true

        }

    )

    .addTo(map);



    // 5. Scale

    L.control.scale({

        position:"bottomright",

        imperial:false

    })

    .addTo(map);



    // 6. Marker cluster

    markerCluster = L.markerClusterGroup({

        maxClusterRadius:60,

        disableClusteringAtZoom:17,

        showCoverageOnHover:false,

        spiderfyOnMaxZoom:true,

        zoomToBoundsOnClick:true

    });



    map.addLayer(
        markerCluster
    );



    // 7. Remember layer changes

    map.on(

        "baselayerchange",

        function(e){


            if(
                e.name === "Carto Light"
            ){

                localStorage.setItem(
                    "mapLayer",
                    "carto"
                );

            }


            else if(
                e.name === "OSM"
            ){

                localStorage.setItem(
                    "mapLayer",
                    "osm"
                );

            }


            else{

                localStorage.setItem(
                    "mapLayer",
                    e.name
                );

            }


        }

    );



    return map;

}





function createBaseLayers(){



    baseLayers["Carto Light"] =

        L.tileLayer(

            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",

            {

                maxZoom:19,

                attribution:
                "© OpenStreetMap © CARTO"

            }

        );



    baseLayers["OSM"] =

        L.tileLayer(

            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                maxZoom:19,

                attribution:
                "© OpenStreetMap"

            }

        );





    baseLayers["OSM Humanitarian"] =

        L.tileLayer(

            "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",

            {

                maxZoom:19,

                attribution:
                "© OpenStreetMap contributors"

            }

        );





    baseLayers["Esri Streets"] =

        L.tileLayer(

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",

            {

                maxZoom:19,

                attribution:
                "© Esri"

            }

        );





    baseLayers["Satellite"] =

        L.tileLayer(

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

            {

                maxZoom:19,

                attribution:
                "© Esri"

            }

        );



}





function restoreMapLayer(){



    const saved =

        localStorage.getItem(
            "mapLayer"
        );



    let selected =
        baseLayers["Carto Light"];




    if(saved){


        switch(saved){


            case "osm":

                selected =
                    baseLayers["OSM"];

                break;



            case "carto":

                selected =
                    baseLayers["Carto Light"];

                break;



            case "Satellite":

                selected =
                    baseLayers["Satellite"];

                break;



            case "Esri Streets":

                selected =
                    baseLayers["Esri Streets"];

                break;


        }


    }



    activeBaseLayer = selected;


    selected.addTo(map);


}





function getMap(){

    return map;

}


function getMarkerCluster(){

    return markerCluster;

}



window.initializeMap =
    initializeMap;


window.getMap =
    getMap;


window.getMarkerCluster =
    getMarkerCluster;