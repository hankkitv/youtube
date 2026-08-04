/* js/app.js */


$(async function(){


    initializeMap();


    await loadRestaurants();


    initializeSearch();

    if (typeof initializeLocation === "function") {

        initializeLocation();

    }
    else {

        console.error(
            "location.js failed to load"
        );

    }


});