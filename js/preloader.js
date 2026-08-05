/* js/preloader.js */

const Loader = {
  update(message, percent) {
    const text = document.getElementById("loaderText");

    const bar = document.getElementById("loaderProgress");

    if (text) {
      text.textContent = message;
    }

    if (bar) {
      bar.style.width = percent + "%";
    }
  },

  hide() {
    const loader = document.getElementById("appLoader");

    if (loader) {
      loader.classList.add("loaded");

      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  },
};

async function waitFor(condition, timeout = 10000) {
  const start = Date.now();

  while (!condition()) {
    if (Date.now() - start > timeout) {
      throw new Error("Library loading timeout");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

let appStarted = false;

async function bootApplication() {
  if (appStarted) {
    console.warn("Application already started");

    return;
  }

  appStarted = true;

  const startTime = Date.now();

  try {
    // -----------------------------
    // 1. Verify external libraries
    // -----------------------------

    Loader.update("Loading Leaflet...", 20);

    await waitFor(() => window.L);

    Loader.update("Loading marker system...", 35);

    await waitFor(() => window.L && L.markerClusterGroup);

    // -----------------------------
    // 2. Initialize map
    // -----------------------------

    Loader.update("Starting map...", 50);

    await waitFor(() => typeof initializeMap === "function");

    initializeMap();

    // -----------------------------
    // 3. Load restaurant data
    // -----------------------------

    Loader.update("Loading restaurants...", 70);

    await waitFor(() => typeof loadRestaurants === "function");

    await loadRestaurants();

    // -----------------------------
    // 4. Initialize UI
    // -----------------------------

    Loader.update("Preparing search...", 85);

    await waitFor(() => typeof initializeSearch === "function");

    initializeSearch();

    if (typeof initializeLocation === "function") {
      Loader.update("Preparing location...", 90);

      initializeLocation();
    }

    // -----------------------------
    // 5. Restore shared links
    // -----------------------------

    Loader.update("Opening restaurant...", 95);

    if (
      typeof getPlaceFromURL === "function" &&
      typeof openRestaurantById === "function"
    ) {
      const place = getPlaceFromURL();

      if (place) {
        setTimeout(() => {
          openRestaurantById(place);
        }, 100);
      }
    }

    // -----------------------------
    // 6. Minimum loader duration
    // -----------------------------

    const elapsed = Date.now() - startTime;

    const minimumTime = 800;

    if (elapsed < minimumTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumTime - elapsed),
      );
    }

    Loader.hide();
    window.dispatchEvent(
        new Event("appReady")
    );
    
  } catch (error) {
    console.error("Application startup failed:", error);

    Loader.update("Unable to load application", 100);

    appStarted = false;
  }
}

window.addEventListener("DOMContentLoaded", bootApplication);
