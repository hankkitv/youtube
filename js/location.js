/* js/location.js */


let userLocation = null;

let userMarker = null;



function initializeLocation(){


    const button =
        document.createElement("button");


    button.id =
        "locationButton";


    button.type =
        "button";


    button.innerHTML =
        "📍";


    button.title =
        "Find restaurants near me";


    button.addEventListener(
        "click",
        function(e){

            e.preventDefault();

            locateUser();

        }
    );


    document.body.appendChild(button);


}

function locateUser(){

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position){


            userLocation = {

                lat: position.coords.latitude,

                lon: position.coords.longitude

            };


            console.log(
                "User location:",
                userLocation
            );


            showUserLocation();


            map.flyTo(

                [
                    userLocation.lat,
                    userLocation.lon
                ],

                15,

                {
                    duration:1
                }

            );


            refreshDistanceData();


        },


        function(error){


            console.error(
                "Location error:",
                error
            );


            switch(error.code){

                case error.PERMISSION_DENIED:

                    alert(
                        "Location permission was denied. Please enable location access in your browser settings."
                    );

                    break;


                case error.POSITION_UNAVAILABLE:

                    alert(
                        "Unable to determine your location."
                    );

                    break;


                case error.TIMEOUT:

                    alert(
                        "Location request timed out."
                    );

                    break;


                default:

                    alert(
                        "Unable to get your location."
                    );

            }


        },


        {

            enableHighAccuracy:true,

            timeout:15000,

            maximumAge:0

        }

    );

}


function showUserLocation(){


    if(userMarker){

        userMarker.remove();

    }



    userMarker =
        L.circleMarker(

            [
                userLocation.lat,
                userLocation.lon
            ],

            {

                radius:10,

                color:"#2563eb",

                fillColor:"#3b82f6",

                fillOpacity:.8

            }

        )
        .addTo(map);



}





function distanceKm(
lat1,
lon1,
lat2,
lon2
){


    const R=6371;


    const dLat =
        (lat2-lat1)
        *
        Math.PI/180;


    const dLon =
        (lon2-lon1)
        *
        Math.PI/180;



    const a =

        Math.sin(dLat/2)
        *
        Math.sin(dLat/2)

        +

        Math.cos(
            lat1*Math.PI/180
        )

        *

        Math.cos(
            lat2*Math.PI/180
        )

        *

        Math.sin(dLon/2)
        *
        Math.sin(dLon/2);



    return R *
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        );


}



function addDistance(row){


    if(!userLocation)
        return "";


    const km =
        distanceKm(

            userLocation.lat,

            userLocation.lon,

            row.lat,

            row.lon

        );



    if(km < 1){

        return `${Math.round(km*1000)}m`;

    }


    return `${km.toFixed(1)}km`;



}



function refreshDistanceData(){


    if(!currentResults.length)
        return;



    renderSearchResults(
        currentResults
    );


}

window.initializeLocation = initializeLocation;
window.locateUser = locateUser;
window.addDistance = addDistance;
window.refreshDistanceData = refreshDistanceData;