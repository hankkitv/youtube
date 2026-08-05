/* js/app.js */

console.log("HankkiTV application loaded");

const isLocalhost =
  location.hostname === "localhost" ||
  location.hostname.startsWith("192.168.") ||
  location.hostname === "127.0.0.1";

// ---------------------------------
// Application ready event
// ---------------------------------

window.addEventListener("appReady", () => {
  console.log("HankkiTV application ready");

  // Future startup tasks:
  //
  // initializeFavorites();
  // initializeTransit();
  // initializeAnalytics();
});

// ---------------------------------
// Service worker
// ---------------------------------

if (!isLocalhost && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")

      .then((registration) => {
        console.log("HankkiTV offline enabled");

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;

          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "activated" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New version installed");

              window.location.reload();
            }
          });
        });
      })

      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
