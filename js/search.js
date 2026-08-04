/* js/search.js */


let fuse;

let restaurantIndex = [];

let currentResults = [];

let selectedIndex = -1;

let resultsScrollTop = 0;




function buildSearchIndex(data){


    restaurantIndex = data.map(restaurant => ({

        restaurant

    }));


    fuse = new Fuse(

        restaurantIndex,

        {

            includeScore:true,

            threshold:0.35,

            ignoreLocation:true,

            minMatchCharLength:1,

            shouldSort:true,


            keys:[

                {
                    name:"restaurant.name",
                    weight:4
                },

                {
                    name:"restaurant.alias",
                    weight:3
                },

                {
                    name:"restaurant.address",
                    weight:2
                },

                {
                    name:"restaurant.menu",
                    weight:2
                },

                {
                    name:"restaurant.phone",
                    weight:1
                }

            ]

        }

    );

}





function searchRestaurants(keyword){


    keyword = keyword.trim();


    if(!keyword)
        return [];


    return fuse

        .search(keyword)

        .slice(0,20)

        .map(result => result.item);

}





function escapeHtml(str){


    return (str || "")

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;");

}







function renderSearchResults(results){


    const panel =
        document.getElementById(
            "searchResults"
        );


    const list =
        document.getElementById(
            "resultsList"
        );



    resultsScrollTop =
        list.scrollTop;



    list.innerHTML = "";


    selectedIndex = -1;




    if(!results.length){


        panel.style.display="none";


        return;

    }




    panel.style.display="block";





    results.forEach((item,index)=>{


        const restaurant =
            item.restaurant;



        const div =
            document.createElement(
                "div"
            );



        div.className =
            "result-item";


        if(
            AppState.selectedRestaurant &&
            AppState.selectedRestaurant.id === restaurant.id
        ){

            div.classList.add(
                "selected-result"
            );

        }



        div.dataset.index =
            index;





        div.innerHTML = `


<div class="result-title">

🍽️ ${escapeHtml(restaurant.name)}

</div>


<div class="result-sub">


${

restaurant.alias

?

escapeHtml(restaurant.alias) + "<br>"

:

""

}



📍 ${escapeHtml(restaurant.address)}


${

restaurant.phone

?

`<br>☎ ${escapeHtml(restaurant.phone)}`

:

""

}



${

typeof addDistance === "function" &&

addDistance(restaurant)

?

`<br>🚶 ${addDistance(restaurant)}`

:

""

}


</div>


`;





        div.onclick = ()=>{


            panel.style.display="none";


            focusRestaurant(

                restaurant

            );


        };





        list.appendChild(div);



    });





    list.scrollTop =
        resultsScrollTop;



}









const doSearch = debounce(()=>{


    currentResults =

        searchRestaurants(

            document

            .getElementById(
                "searchInput"
            )

            .value

        );



    renderSearchResults(

        currentResults

    );


},200);







function debounce(fn,delay){


    let timer;



    return function(){


        clearTimeout(timer);



        timer =

            setTimeout(

                fn,

                delay

            );

    };


}









function highlightSelection(){


    document

    .querySelectorAll(
        ".result-item"
    )

    .forEach(el=>{


        el.style.background =
            "white";


    });





    if(selectedIndex < 0)
        return;





    const el =

        document.querySelector(

            `.result-item[data-index="${selectedIndex}"]`

        );





    if(!el)
        return;





    el.style.background =
        "#edf5ff";





    el.scrollIntoView({

        block:"nearest"

    });



}









function initializeSearch(){



    initializeSheet();





    const input =

        document.getElementById(
            "searchInput"
        );





    const list =

        document.getElementById(
            "resultsList"
        );





    /*
        Let Leaflet ignore
        scrolling inside results
    */


    if(window.L){


        L.DomEvent
            .disableClickPropagation(
                list
            );


        L.DomEvent
            .disableScrollPropagation(
                list
            );


    }






    list.addEventListener(

        "scroll",

        ()=>{


            resultsScrollTop =
                list.scrollTop;


        }

    );







    input.addEventListener(

        "input",

        doSearch

    );







    input.addEventListener(

        "focus",

        ()=>{


            if(currentResults.length){


                document

                .getElementById(
                    "searchResults"
                )

                .style.display =
                    "block";


            }


        }

    );









    input.addEventListener(

        "keydown",

        e=>{


            if(!currentResults.length)
                return;





            switch(e.key){



                case "ArrowDown":



                    e.preventDefault();



                    selectedIndex++;



                    if(
                        selectedIndex >=
                        currentResults.length
                    )

                    {

                        selectedIndex = 0;

                    }



                    highlightSelection();



                    break;






                case "ArrowUp":



                    e.preventDefault();



                    selectedIndex--;



                    if(selectedIndex < 0)

                    {

                        selectedIndex =
                            currentResults.length - 1;

                    }



                    highlightSelection();



                    break;






                case "Enter":



                    e.preventDefault();



                    if(selectedIndex >= 0){



                        document

                        .getElementById(
                            "searchResults"
                        )

                        .style.display =
                            "none";





                        focusRestaurant(

                            currentResults[selectedIndex]

                            .restaurant

                        );



                    }



                    break;







                case "Escape":



                    document

                    .getElementById(
                        "searchResults"
                    )

                    .style.display =
                        "none";



                    break;


            }


        }

    );









    document.addEventListener(

        "click",

        e=>{


            if(

                !e.target.closest(
                    ".search-box"
                )

                &&

                !e.target.closest(
                    "#searchResults"
                )

            ){


                document

                .getElementById(
                    "searchResults"
                )

                .style.display =
                    "none";


            }


        }

    );



}









function initializeSheet(){


    const sheet =

        document.getElementById(
            "searchResults"
        );



    let startY = 0;





    sheet.addEventListener(

        "touchstart",

        e=>{


            startY =
                e.touches[0].clientY;


        }

    );







    sheet.addEventListener(

        "touchmove",

        e=>{


            const distance =

                e.touches[0].clientY -
                startY;





            if(distance > 120){


                sheet.style.display =
                    "none";


            }


        }

    );


}

function updateSelectedSearchResult(){


    document

    .querySelectorAll(".result-item")

    .forEach(item=>{


        const index =
            item.dataset.index;


        const restaurant =
            currentResults[index]
            ?.restaurant;



        if(

            AppState.selectedRestaurant &&

            restaurant &&

            restaurant.id ===
            AppState.selectedRestaurant.id

        ){

            item.classList.add(
                "selected-result"
            );


        }
        else{

            item.classList.remove(
                "selected-result"
            );

        }


    });


}