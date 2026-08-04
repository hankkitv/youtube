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

    const place =
        getPlaceFromURL();


    if(place){

        openRestaurantById(
            place
        );

    }


});

if(
    "serviceWorker" in navigator
){

    window.addEventListener(
        "load",
        ()=>{


            navigator.serviceWorker
            .register(
                "./service-worker.js"
            )

            .then(()=>{

                console.log(
                    "HankkiTV offline enabled"
                );

            })

            .catch(err=>{

                console.error(
                    err
                );

            });


        }
    );

}