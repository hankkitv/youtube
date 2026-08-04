/* js/navigation.js */

function focusRestaurant(
    restaurant,
    options = {}
){

    if(!restaurant)
        return;

    AppState.selectedRestaurant =
        restaurant;

    updateSelectedSearchResult();
    // if(currentResults.length){

    //     renderSearchResults(
    //         currentResults
    //     );

    // }
    if(options.updateURL !== false){

        updateRestaurantURL(
            restaurant.id
        );

    }


    markerCluster.zoomToShowLayer(

        restaurant.marker,

        ()=>{

            map.flyTo(

                [
                    restaurant.lat,
                    restaurant.lon
                ],

                options.zoom ?? 17,

                {
                    duration:.6
                }

            );


            selectMarker(
                restaurant.marker
            );


            showRestaurantDetails(
                restaurant
            );

        }

    );

}