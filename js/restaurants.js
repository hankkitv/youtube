/* js/restaurants.js */


let restaurants=[];
let markers=[];



function loadRestaurants(){


    return $.get(
        "./poi.csv"
    )
    .then(csv=>{


        restaurants =
            Papa.parse(
                csv,
                {
                    header:true,
                    dynamicTyping:true
                }
            )
            .data;



        restaurants.forEach(row=>{


            if(!row.lat || !row.lon)
                return;



            const marker =
                createRestaurantMarker(row);



            markers.push(marker);


            markerCluster.addLayer(marker);


        });



        buildSearchIndex(
            restaurants,
            markers
        );


    });

}