/* js/details.js */


function youtubePlayer(videoId){

    if(!videoId)
        return "";

    return `
    <div class="video-fullbleed">
    <iframe
        src="https://www.youtube.com/embed/${videoId}"
        title="Youtube video"
        loading="lazy"
        allowfullscreen
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
    </iframe>
    </div>

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

function updateSEO(row){


    const title =
        `${row.name} | HankkiTV`;


    document.title =
        title;



    const description =
        row.address ||
        "Discover restaurants with HankkiTV";



    document
    .getElementById("ogTitle")
    ?.setAttribute(
        "content",
        title
    );


    document
    .getElementById("ogDescription")
    ?.setAttribute(
        "content",
        description
    );


    document
    .getElementById("ogImage")
    ?.setAttribute(
        "content",
        row.thumbnail || "favicon.png"
    );


    document
    .getElementById("ogUrl")
    ?.setAttribute(
        "content",
        window.location.href
    );


}


function showRestaurantDetails(row){

    updateSEO(row);

    const panel =
        document.getElementById(
            "restaurantDetails"
        );


    const content =
        document.getElementById(
            "detailContent"
        );



    content.innerHTML = `

    <div class="video-container">

    ${
        row.youtubeId
        ?
        youtubePlayer(row.youtubeId)
        :
        ""
    }
    </div>

    <div class="detail-handle"></div>

    <div class="detail-info">
    <div class="detail-header">

    <div>

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

    </div>


    <button
    id="favoriteButton"
    class="favorite-button">

        ${row.favorite ? "❤️" : "🤍"}

    </button>


</div>

    <div class="detail-address">

        📍 ${row.address || ""}

        <br>

        ☎️ ${row.phone || ""}

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

    <div class="detail-bottom-actions">


${
row.phone
?
`
<button
class="detail-button"
onclick="
location.href='tel:${row.phone}'
">

📞 Call 

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

🧭 Directions

</button>



<button
class="share-button"
onclick="
shareRestaurant(
'${row.id}',
'${row.name}'
)
">

📤 Share 

</button>


</div>

    `;



    panel.style.display="block";

    const favoriteButton =
        document.getElementById("favoriteButton");

    favoriteButton.onclick = () => {

        toggleFavorite(row.id || row.media);

        favoriteButton.innerHTML =
            isFavorite(row.id || row.media)
                ? "❤️"
                : "🤍";

    };

}





function openDirections(lat,lon){

    window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
    );

}





async function shareRestaurant(
id,
name
){

    const url =
        APP_CONFIG.baseURL +
        "?place=" +
        id;


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