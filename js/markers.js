/* js/markers.js */


let selectedMarker=null;



const restaurantIcon =
L.divIcon({

    className:"",

    html:
    `
    <div class="restaurant-marker">
        <img src="logo_t.png">
    </div>
    `,

    iconSize:[44,44],

    iconAnchor:[22,22]

});



function createRestaurantMarker(row){


    const marker =
        L.marker(
            [
                row.lat,
                row.lon
            ],
            {
                icon:restaurantIcon
            }
        );



    marker.bindPopup(`

        <strong>
        ${row.name}
        </strong>

        <br>

        ${row.address || ""}

        <br>

        ${row.phone || ""}

        `);



    marker.restaurant=row;



    marker.on(
"click",
()=>{

    AppState.selectedRestaurant = row;
    selectMarker(marker);

    map.flyTo(
        [
            row.lat,
            row.lon
        ],
        17,
        {
            duration:.6
        }
    );


    showRestaurantDetails(row);

});

    return marker;

}



function selectMarker(marker){


    if(selectedMarker){

        selectedMarker
        .getElement()
        ?.querySelector(
            ".restaurant-marker"
        )
        ?.classList.remove(
            "selected"
        );

    }



    marker
    .getElement()
    ?.querySelector(
        ".restaurant-marker"
    )
    ?.classList.add(
        "selected"
    );


    selectedMarker=marker;

}