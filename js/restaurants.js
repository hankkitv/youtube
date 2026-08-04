/* js/restaurants.js */


const restaurants = AppState.restaurants;
const markers = AppState.markers;


function loadRestaurants(){


    return $.get(
        "./poi.csv"
    )
    .then(csv=>{


        const loadedRestaurants =
            Papa.parse(csv,
                {
                    header:true,
                    dynamicTyping:true
                })
                .data
                .filter(row => row.lat && row.lon)
                .map(row => ({

                    id: row.media,

                    name: row.name,

                    alias: row.alias,

                    address: row.addr,

                    lat: row.lat,

                    lon: row.lon,

                    phone: row.tel,

                    link: row.link,

                    menu: row.menu,

                    flag: row.flag,

                    youtubeId: row.media,

                    thumbnail:
                        `https://i.ytimg.com/vi/${row.media}/hqdefault.jpg`,

                    favorite:
                        isFavorite(row.media)

                }));


        restaurants.push(...loadedRestaurants);


        restaurants.forEach(restaurant => {

            const marker =
                createRestaurantMarker(restaurant);

            restaurant.marker = marker;

            markers.push(marker);

            markerCluster.addLayer(marker);

        });


        buildSearchIndex(
            restaurants,
            markers
        );


    });

}