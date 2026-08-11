/* js/search.js */


/* =========================================================
   SEARCH STATE
   ========================================================= */

let fuse;

let restaurantIndex = [];

let currentResults = [];

let selectedIndex = -1;

let resultsScrollTop = 0;


/* =========================================================
   BUILD SEARCH INDEX
   ========================================================= */

function buildSearchIndex(data) {
  restaurantIndex = data.map((restaurant) => ({
    restaurant,
  }));

  fuse = new Fuse(
    restaurantIndex,
    {
      includeScore: true,

      threshold: 0.35,

      ignoreLocation: true,

      minMatchCharLength: 1,

      shouldSort: true,

      keys: [
        {
          name: "restaurant.name",
          weight: 4,
        },

        {
          name: "restaurant.alias",
          weight: 3,
        },

        {
          name: "restaurant.address",
          weight: 2,
        },

        {
          name: "restaurant.menu",
          weight: 2,
        },

        {
          name: "restaurant.phone",
          weight: 1,
        },
      ],
    },
  );
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchRestaurants(keyword) {
  keyword = keyword.trim();

  if (!keyword || !fuse) {
    return [];
  }

  return fuse
    .search(keyword)
    .slice(0, 20)
    .map((result) => result.item);
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/* =========================================================
   RENDER RESULTS
   ========================================================= */

function renderSearchResults(results) {
  const panel =
    document.getElementById(
      "searchResults",
    );

  const list =
    document.getElementById(
      "resultsList",
    );

  if (!panel || !list) {
    return;
  }

  resultsScrollTop =
    list.scrollTop;

  list.innerHTML = "";

  selectedIndex = -1;

  if (!results.length) {
    panel.style.display = "none";

    return;
  }

  panel.style.display = "block";

  results.forEach(
    (item, index) => {
      const restaurant =
        item.restaurant;

      const div =
        document.createElement(
          "div",
        );

      div.className =
        "result-item";

      if (
        AppState.selectedRestaurant &&
        AppState.selectedRestaurant.id ===
          restaurant.id
      ) {
        div.classList.add(
          "selected-result",
        );
      }

      div.dataset.index =
        index;

      const distance =
        typeof addDistance ===
          "function"
          ? addDistance(restaurant)
          : "";

      div.innerHTML = `
        <div class="result-title">
          🍽️ ${escapeHtml(
            restaurant.name,
          )}
        </div>

        <div class="result-sub">

          ${
            restaurant.alias
              ? escapeHtml(
                  restaurant.alias,
                ) + "<br>"
              : ""
          }

          📍 ${escapeHtml(
            restaurant.address,
          )}

          ${
            restaurant.phone
              ? `<br>☎ ${escapeHtml(
                  restaurant.phone,
                )}`
              : ""
          }

          ${
            distance
              ? `<br>🚶 ${distance}`
              : ""
          }

        </div>
      `;

      div.onclick = () => {
        panel.style.display =
          "none";

        focusRestaurant(
          restaurant,
        );
      };

      list.appendChild(div);
    },
  );

  list.scrollTop =
    resultsScrollTop;
}


/* =========================================================
   DEBOUNCE
   ========================================================= */

function debounce(fn, delay) {
  let timer;

  return function () {
    clearTimeout(timer);

    timer = setTimeout(
      fn,
      delay,
    );
  };
}


/* =========================================================
   SEARCH ACTION
   ========================================================= */

const doSearch =
  debounce(
    () => {
      const input =
        document.getElementById(
          "searchInput",
        );

      if (!input) {
        return;
      }

      currentResults =
        searchRestaurants(
          input.value,
        );

      renderSearchResults(
        currentResults,
      );
    },
    200,
  );


/* =========================================================
   KEYBOARD RESULT SELECTION
   ========================================================= */

function highlightSelection() {
  document
    .querySelectorAll(
      ".result-item",
    )
    .forEach(
      (el) => {
        el.style.background =
          "white";
      },
    );

  if (selectedIndex < 0) {
    return;
  }

  const el =
    document.querySelector(
      `.result-item[data-index="${selectedIndex}"]`,
    );

  if (!el) {
    return;
  }

  el.style.background =
    "#edf5ff";

  el.scrollIntoView({
    block: "nearest",
  });
}


/* =========================================================
   INITIALIZE SEARCH
   ========================================================= */

function initializeSearch() {
  const input =
    document.getElementById(
      "searchInput",
    );

  const list =
    document.getElementById(
      "resultsList",
    );

  if (!input || !list) {
    console.error(
      "Search initialization failed: searchInput or resultsList not found.",
    );

    return;
  }


  /* -----------------------------------------
     Leaflet event handling
     ----------------------------------------- */

  if (window.L) {
    L.DomEvent.disableClickPropagation(
      list,
    );

    L.DomEvent.disableScrollPropagation(
      list,
    );
  }


  /* -----------------------------------------
     Remember scroll position
     ----------------------------------------- */

  list.addEventListener(
    "scroll",
    () => {
      resultsScrollTop =
        list.scrollTop;
    },
  );


  /* -----------------------------------------
     Search while typing
     ----------------------------------------- */

  input.addEventListener(
    "input",
    doSearch,
  );


  /* -----------------------------------------
     Restore results on focus
     ----------------------------------------- */

  input.addEventListener(
    "focus",
    () => {
      if (
        currentResults.length
      ) {
        const panel =
          document.getElementById(
            "searchResults",
          );

        if (panel) {
          panel.style.display =
            "block";
        }
      }
    },
  );


  /* -----------------------------------------
     Keyboard navigation
     ----------------------------------------- */

  input.addEventListener(
    "keydown",
    (e) => {
      if (
        !currentResults.length
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":

          e.preventDefault();

          selectedIndex++;

          if (
            selectedIndex >=
            currentResults.length
          ) {
            selectedIndex = 0;
          }

          highlightSelection();

          break;


        case "ArrowUp":

          e.preventDefault();

          selectedIndex--;

          if (
            selectedIndex < 0
          ) {
            selectedIndex =
              currentResults.length -
              1;
          }

          highlightSelection();

          break;


        case "Enter":

          e.preventDefault();

          if (
            selectedIndex >= 0
          ) {
            const panel =
              document.getElementById(
                "searchResults",
              );

            if (panel) {
              panel.style.display =
                "none";
            }

            focusRestaurant(
              currentResults[
                selectedIndex
              ].restaurant,
            );
          }

          break;


        case "Escape":

          {
            const panel =
              document.getElementById(
                "searchResults",
              );

            if (panel) {
              panel.style.display =
                "none";
            }
          }

          break;
      }
    },
  );


  /* -----------------------------------------
     Close results when clicking outside
     ----------------------------------------- */

  document.addEventListener(
    "click",
    (e) => {
      if (
        !e.target.closest(
          ".search-box",
        ) &&
        !e.target.closest(
          "#searchResults",
        )
      ) {
        const panel =
          document.getElementById(
            "searchResults",
          );

        if (panel) {
          panel.style.display =
            "none";
        }
      }
    },
  );
}


/* =========================================================
   UPDATE SELECTED RESULT
   ========================================================= */

function updateSelectedSearchResult() {
  document
    .querySelectorAll(
      ".result-item",
    )
    .forEach(
      (item) => {
        const index =
          item.dataset.index;

        const restaurant =
          currentResults[index]
            ?.restaurant;

        if (
          AppState.selectedRestaurant &&
          restaurant &&
          restaurant.id ===
            AppState
              .selectedRestaurant
              .id
        ) {
          item.classList.add(
            "selected-result",
          );
        } else {
          item.classList.remove(
            "selected-result",
          );
        }
      },
    );
}