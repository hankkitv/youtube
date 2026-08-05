/* js/app.js */


console.log(
    "HankkiTV application loaded"
);



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