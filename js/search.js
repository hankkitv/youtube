/* search.js */

let fuse;
let restaurantIndex = [];
let currentResults = [];
let selectedIndex = -1;

function buildSearchIndex(data, markers) {

    restaurantIndex = data.map((row, i) => ({
        id: i,
        marker: markers[i],
        row: row
    }));

    fuse = new Fuse(restaurantIndex, {

        includeScore: true,

        threshold: 0.35,

        ignoreLocation: true,

        minMatchCharLength: 1,

        shouldSort: true,

        keys: [

            {
                name: "row.name",
                weight: 4
            },

            {
                name: "row.alias",
                weight: 3
            },

            {
                name: "row.addr",
                weight: 2
            },

            {
                name: "row.menu",
                weight: 2
            },

            {
                name: "row.tel",
                weight: 1
            }

        ]

    });

}

function searchRestaurants(keyword) {

    keyword = keyword.trim();

    if (!keyword)
        return [];

    return fuse.search(keyword)
        .slice(0, 20)
        .map(x => x.item);

}

function escapeHtml(str){

    return (str || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

}

function renderSearchResults(results) {

    const panel =
        document.getElementById("searchResults");

    const list =
        document.getElementById("resultsList");


    list.innerHTML = "";

    selectedIndex = -1;


    if (!results.length){

        panel.style.display="none";

        return;

    }


    panel.style.display="block";


    results.forEach((item,index)=>{


        const div=document.createElement("div");


        div.className="result-item";

        div.dataset.index=index;


        div.innerHTML=`

<div class="result-title">
🍽️ ${escapeHtml(item.row.name)}
</div>


<div class="result-sub">

${item.row.alias 
? escapeHtml(item.row.alias)+"<br>"
:""}

📍 ${escapeHtml(item.row.addr)}

<br>

☎️ ${escapeHtml(item.row.tel || "")}


${
addDistance(item.row)
?
`
<br>
🚶 ${addDistance(item.row)}
`
:
""
}


</div>

`;


        div.onclick=()=>{

            zoomToRestaurant(item);

        };


        list.appendChild(div);


    });


}

function zoomToRestaurant(item){

    document.getElementById("searchResults").style.display="none";

    map.flyTo(
        [item.row.lat,item.row.lon],
        17,
        {
            animate:true,
            duration:0.8
        });

    setTimeout(()=>{
        item.marker.openPopup();
    },450);

}

const doSearch=debounce(()=>{

    currentResults=searchRestaurants(
        document.getElementById("searchInput").value
    );

    renderSearchResults(currentResults);

},200);

function debounce(fn,delay){

    let timer;

    return function(){

        clearTimeout(timer);

        timer=setTimeout(fn,delay);

    }

}

function highlightSelection(){

    document
        .querySelectorAll(".result-item")
        .forEach(el=>{

            el.style.background="white";

        });

    if(selectedIndex<0)
        return;

    const el=document.querySelector(
        `.result-item[data-index="${selectedIndex}"]`
    );

    if(!el)
        return;

    el.style.background="#edf5ff";

    el.scrollIntoView({

        block:"nearest"

    });

}

function initializeSearch(){

    initializeSheet();
    const input=document.getElementById("searchInput");

    input.addEventListener("input",doSearch);

    input.addEventListener("keydown",(e)=>{

        if(!currentResults.length)
            return;

        switch(e.key){

            case "ArrowDown":

                e.preventDefault();

                selectedIndex++;

                if(selectedIndex>=currentResults.length)
                    selectedIndex=0;

                highlightSelection();

                break;

            case "ArrowUp":

                e.preventDefault();

                selectedIndex--;

                if(selectedIndex<0)
                    selectedIndex=currentResults.length-1;

                highlightSelection();

                break;

            case "Enter":

                e.preventDefault();

                if(selectedIndex>=0){

                    zoomToRestaurant(
                        currentResults[selectedIndex]
                    );

                }

                break;

            case "Escape":

                document.getElementById("searchResults").style.display="none";

                break;

        }

    });

    document.addEventListener("click",(e)=>{

        if(
            !e.target.closest(".search-box") &&
            !e.target.closest("#searchResults")
        ){

            document.getElementById("searchResults").style.display="none";

        }

    });

}

function initializeSheet(){

const sheet =
document.getElementById("searchResults");


let startY=0;


sheet.addEventListener(
"touchstart",
(e)=>{

startY=e.touches[0].clientY;

});


sheet.addEventListener(
"touchmove",
(e)=>{


let distance =
e.touches[0].clientY-startY;


if(distance>120){

sheet.style.display="none";

}


});


}

