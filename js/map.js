/* js/map.js */

/*
    HankkiTV Restaurant Map
    Leaflet map management

    Features:
    - Persistent map position
    - Persistent basemap selection
    - Marker cluster integration
    - Layer control refactor
*/


let map;

let markerCluster;


/*
    Base layers
    Defined globally so they can be restored
    from localStorage
*/

let cartoLight;

let osmLayer;

let esriStreet;

let satelliteLayer;

let topoLayer;


/*
    Optional overlays
*/

let transitLayer;


/*
    Storage keys
*/

const MAP_LAYER_KEY =
    "hankkitv_map_layer";

const MAP_STATE_KEY =
    "hankkitv_map_state";



/*
    Main initializer

    Called from app.js
*/

function initializeMap(){


    createMap();


    createMarkerCluster();


    createLayers();


    restoreMapState();


    createLayerControl();


    installMapEvents();


    return map;

}



/*
    Create Leaflet map

*/

function createMap(){


    map =
        L.map(
            "map",
            {
                minZoom:3,

                maxZoom:19,

                zoomControl:false
            }
        );


    // /*
    //     Put zoom control below
    //     layer button
    // */

    // L.control.zoom(
    //     {
    //         position:"topright"
    //     }
    // )
    // .addTo(map);

    L.control.scale(
    {
        position: "bottomright",

        metric: true,

        imperial: false,

        maxWidth: 150
    })
    .addTo(map);
}




/*
    Restaurant marker cluster

    markers.js and restaurants.js
    already expect this variable
*/

function createMarkerCluster(){


    markerCluster =
        L.markerClusterGroup(
            {
                maxClusterRadius:60,

                disableClusteringAtZoom:17,

                showCoverageOnHover:false,

                spiderfyOnMaxZoom:true,

                zoomToBoundsOnClick:true
            }
        );


    /*
        Restaurants are always visible.

        They are intentionally NOT
        included in the layer control.
    */

    map.addLayer(
        markerCluster
    );

}




/*
    Restore previous map location

    If user has never visited,
    use Seoul default view.
*/

function restoreMapState(){


    const saved =
        localStorage.getItem(
            MAP_STATE_KEY
        );


    if(saved){


        try {


            const state =
                JSON.parse(saved);


            map.setView(

                [
                    state.lat,
                    state.lng
                ],

                state.zoom

            );


            return;


        }
        catch(error){


            console.warn(
                "Invalid saved map state",
                error
            );


        }


    }


    /*
        Default location
        Seoul
    */


    map.setView(

        [
            37.5638288,
            126.9800428
        ],

        13

    );


}




/*
    Save current map position

*/

function saveMapState(){


    const center =
        map.getCenter();


    localStorage.setItem(

        MAP_STATE_KEY,

        JSON.stringify(
            {
                lat:center.lat,

                lng:center.lng,

                zoom:map.getZoom()
            }
        )

    );

}
/*
    Create all map layers
*/

function createLayers(){


    /*
        Carto Light

        Default choice:
        clean, readable,
        good for restaurant discovery
    */

    cartoLight =
        L.tileLayer(

            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",

            {
                maxZoom:19,

                attribution:
                "© OpenStreetMap © CARTO"
            }

        );




    /*
        OpenStreetMap Standard
    */

    osmLayer =
        L.tileLayer(

            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

            {
                maxZoom:19,

                attribution:
                "© OpenStreetMap contributors"
            }

        );




    /*
        Esri Street Map
    */

    esriStreet =
        L.tileLayer(

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",

            {
                maxZoom:19,

                attribution:
                "© Esri"
            }

        );




    /*
        Esri Satellite

        Useful for checking
        building entrances
    */

    satelliteLayer =
        L.tileLayer(

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

            {
                maxZoom:19,

                attribution:
                "© Esri"
            }

        );




    /*
        OpenTopoMap

        Alternative readable map
        without Carto Dark
    */

    topoLayer =
        L.tileLayer(

            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",

            {
                maxZoom:17,

                attribution:
                "© OpenTopoMap contributors"
            }

        );



    /*
        Default layer

        Only add if no saved
        layer exists
    */

    restoreBaseLayer();

}




/*
    Restore last selected basemap
*/

function restoreBaseLayer(){


    const saved =
        localStorage.getItem(
            MAP_LAYER_KEY
        );



    switch(saved){


        case "osm":

            osmLayer.addTo(map);

            break;



        case "esri":

            esriStreet.addTo(map);

            break;



        case "satellite":

            satelliteLayer.addTo(map);

            break;



        case "topo":

            topoLayer.addTo(map);

            break;



        case "carto":

        default:

            cartoLight.addTo(map);

            break;

    }

}




/*
    Layer selection button

    collapsed:true gives the
    normal Leaflet layer icon
*/

function createLayerControl(){



    transitLayer =
        L.layerGroup();



    const baseLayers = {


        "Carto Light":
            cartoLight,


        "OpenStreetMap":
            osmLayer,


        "Esri World Street":
            esriStreet,


        "Satellite":
            satelliteLayer,


        "OpenTopoMap":
            topoLayer

    };



    const overlays = {


        "Transit Stops":
            transitLayer

    };



    L.control.layers(

        baseLayers,

        overlays,

        {

            position:"topright",

            collapsed:true

        }

    )

    .addTo(map);

    /*
    Add zoom AFTER layer control

    Leaflet places newer controls
    lower in the stack.
    */

    // L.control.zoomslider(
    // {
    //     position:"topright"
    // }
    // )
    // .addTo(map);

}
/*
    Install map event handlers
*/

function installMapEvents(){


    /*
        Remember map position
    */

    map.on(

        "moveend",

        saveMapState

    );



    map.on(

        "zoomend",

        saveMapState

    );




    /*
        Remember selected basemap
    */

    map.on(

        "baselayerchange",

        function(e){


            switch(e.name){


                case "Carto Light":

                    saveBaseLayer(
                        "carto"
                    );

                    break;



                case "OpenStreetMap":

                    saveBaseLayer(
                        "osm"
                    );

                    break;



                case "Esri World Street":

                    saveBaseLayer(
                        "esri"
                    );

                    break;



                case "Satellite":

                    saveBaseLayer(
                        "satellite"
                    );

                    break;



                case "OpenTopoMap":

                    saveBaseLayer(
                        "topo"
                    );

                    break;

            }


        }

    );




    /*
        Transit checkbox

        Load data only when
        user requests it.
    */


    map.on(

        "overlayadd",

        function(e){


            if(
                e.name === "Transit Stops"
            ){

                loadTransitLayer();

            }


        }

    );



}




/*
    Save basemap choice
*/

function saveBaseLayer(name){


    localStorage.setItem(

        MAP_LAYER_KEY,

        name

    );

}




/*
    Transit loader

    Placeholder for future:

    - Seoul Open API
    - GTFS
    - OpenStreetMap Overpass

*/

let transitLoaded = false;



async function loadTransitLayer(){


    if(transitLoaded){

        return;

    }


    transitLoaded = true;



    /*
        Example future usage:

        const response =
            await fetch(
              "transit.geojson"
            );


        const data =
            await response.json();


        L.geoJSON(data)
          .addTo(transitLayer);

    */



    console.log(
        "Transit layer enabled. Data loader ready."
    );



}




/*
    Utility:
    remove transit layer
    if needed later
*/

function clearTransitLayer(){


    transitLayer.clearLayers();


}




/*
    Utility:
    programmatically switch map style

    Example:

    setMapLayer("satellite")

*/

function setMapLayer(name){



    const layers = {


        carto:
            cartoLight,


        osm:
            osmLayer,


        esri:
            esriStreet,


        satellite:
            satelliteLayer,


        topo:
            topoLayer

    };



    const selected =
        layers[name];



    if(!selected){

        return;

    }



    Object.values(layers)

    .forEach(layer=>{


        if(map.hasLayer(layer)){

            map.removeLayer(layer);

        }

    });



    selected.addTo(map);



    saveBaseLayer(name);



}



/*
    Expose map getter

    Useful for debugging
*/

function getMap(){

    return map;

}