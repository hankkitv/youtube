/* js/router.js */


function getPlaceFromURL(){

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get("place");

}




function openRestaurantById(id){

    const restaurant =
        AppState.restaurants.find(
            r => r.id === id
        );

    if(!restaurant)
        return;

    focusRestaurant(
        restaurant,
        {
            updateURL:false
        }
    );

}


function updateRestaurantURL(id){


    const url =
        new URL(
            window.location
        );


    url.searchParams.set(
        "place",
        id
    );


    history.pushState(
        {
            place:id
        },
        "",
        url
    );


}




window.addEventListener(
"popstate",
()=>{


    const id =
        getPlaceFromURL();


    if(id){

        openRestaurantById(id);

    }

    else{

        hideRestaurantDetails();

    }


});