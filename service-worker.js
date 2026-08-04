const CACHE_NAME =
"hankkitv-v1";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./styles.css",

    "./poi.csv",

    "./js/app.js",

    "./js/map.js",

    "./js/restaurants.js",

    "./js/search.js",

    "./js/details.js",

    "./js/location.js",

    "./js/filters.js",

    "./js/router.js"

];





self.addEventListener(
"install",
event=>{


    event.waitUntil(

        caches.open(
            CACHE_NAME
        )

        .then(cache=>{

            return cache.addAll(
                FILES_TO_CACHE
            );

        })

    );


});







self.addEventListener(
"activate",
event=>{


    event.waitUntil(

        caches.keys()

        .then(keys=>{


            return Promise.all(

                keys

                .filter(

                    key =>
                    key !== CACHE_NAME

                )

                .map(

                    key =>
                    caches.delete(key)

                )

            );


        })

    );


});







self.addEventListener(
"fetch",
event=>{


    event.respondWith(

        caches.match(
            event.request
        )

        .then(response=>{


            return response ||

                fetch(
                    event.request
                );


        })

    );


});