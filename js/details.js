/* js/details.js */


function youtubeThumbnail(videoId){

    if(!videoId)
        return "";

    return `
    <img
        class="video-thumbnail"
        src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
        onclick="
        window.open(
        'https://www.youtube.com/watch?v=${videoId}'
        )
        "
    >
    `;

}



function parseMenu(menu){

    if(!menu)
        return "";

    return menu
        .split("|")
        .map(item=>item.trim())
        .join("<br>");

}




function showRestaurantDetails(row){


    const panel =
        document.getElementById(
            "restaurantDetails"
        );


    const content =
        document.getElementById(
            "detailContent"
        );



    content.innerHTML = `


    ${
        row.media
        ?
        youtubeThumbnail(row.media)
        :
        ""
    }



    <div class="detail-title">

        ${row.name || ""}

    </div>



    ${
        row.alias
        ?
        `
        <div class="detail-alias">
            ${row.alias}
        </div>
        `
        :
        ""
    }



    <div class="detail-address">

        📍 ${row.addr || ""}

        <br>

        ☎️ ${row.tel || ""}

    </div>




    ${
        row.menu
        ?
        `
        <div class="detail-menu">

            🍽 Menu

            <div>
            ${parseMenu(row.menu)}
            </div>

        </div>
        `
        :
        ""
    }



    <div class="detail-actions">


        ${
        row.tel
        ?
        `
        <button
        class="detail-button"
        onclick="
        location.href='tel:${row.tel}'
        ">

        ☎ Call

        </button>
        `
        :
        ""
        }



        <button
        class="detail-button secondary"
        onclick="
        openDirections(
        ${row.lat},
        ${row.lon}
        )
        ">

        🗺 Directions

        </button>



    </div>




    <button
    class="share-button"
    onclick="
    shareRestaurant(
    '${row.name}',
    '${row.lat}',
    '${row.lon}'
    )
    ">

    ↗ Share

    </button>



    `;



    panel.style.display="block";


}





function openDirections(lat,lon){

    window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    );

}





async function shareRestaurant(
name,
lat,
lon
){

    const url =
    `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;


    if(
        navigator.share
    ){

        await navigator.share({

            title:name,

            url:url

        });

    }
    else{

        navigator.clipboard
        .writeText(url);

        alert(
            "Link copied"
        );

    }

}





function hideRestaurantDetails(){

    document
    .getElementById(
        "restaurantDetails"
    )
    .style.display="none";

}




document.addEventListener(
"DOMContentLoaded",
()=>{


document
.getElementById(
"closeDetails"
)
.onclick =
hideRestaurantDetails;


});