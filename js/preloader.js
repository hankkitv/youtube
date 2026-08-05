/* js/preloader.js */


const Loader = {


    update(message, percent){


        const text =
            document.getElementById(
                "loaderText"
            );


        const bar =
            document.getElementById(
                "loaderProgress"
            );


        if(text){

            text.textContent =
                message;

        }


        if(bar){

            bar.style.width =
                percent + "%";

        }

    },



    hide(){


        const loader =
            document.getElementById(
                "appLoader"
            );


        if(loader){

            loader.classList.add(
                "loaded"
            );

            setTimeout(()=>{

                loader.remove();

            },500);

        }

    }

};





async function waitFor(condition, timeout=10000){


    const start =
        Date.now();



    while(
        !condition()
    ){


        if(
            Date.now() - start > timeout
        ){

            throw new Error(
                "Library loading timeout"
            );

        }


        await new Promise(
            resolve =>
            setTimeout(resolve,100)
        );

    }

}





async function bootApplication(){

    const startTime =
        Date.now();

    try{


        Loader.update(
            "Loading Leaflet...",
            20
        );


        await waitFor(
            ()=>window.L
        );



        Loader.update(
            "Loading marker system...",
            40
        );


        await waitFor(
            ()=>window.L &&
                L.markerClusterGroup
        );



        Loader.update(
            "Starting map...",
            60
        );


        await waitFor(
            ()=>typeof initializeMap === "function"
        );



        initializeMap();



        Loader.update(
            "Loading restaurants...",
            80
        );


        await loadRestaurants();



        Loader.update(
            "Preparing search...",
            90
        );


        initializeSearch();



        if(
            typeof initializeLocation === "function"
        ){

            initializeLocation();

        }



        const elapsed =
            Date.now() - startTime;


        const minimumTime = 800;


        if(elapsed < minimumTime){

            await new Promise(
                resolve =>
                setTimeout(
                    resolve,
                    minimumTime - elapsed
                )
            );

        }


        Loader.hide();



    }


    catch(error){


        console.error(
            "Application startup failed:",
            error
        );


        Loader.update(
            "Unable to load application",
            100
        );


    }


}




window.addEventListener(
    "DOMContentLoaded",
    bootApplication
);