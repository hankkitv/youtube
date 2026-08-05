/* js/location.js */

let userLocation = null;

let userMarker = null;

let userAccuracyCircle = null;

let locationControlAdded = false;

function initializeLocation() {
  if (locationControlAdded) {
    console.log("Location control already initialized");
    return;
  }

  locationControlAdded = true;

  const LocationControl = L.Control.extend({
    options: {
      position: "bottomright",
    },

    onAdd: function () {
      const button = L.DomUtil.create("button", "location-control");

      button.innerHTML = `
                    <svg 
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        aria-hidden="true">

                        <circle
                            cx="12"
                            cy="12"
                            r="5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"/>

                        <line
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="6"
                            stroke="currentColor"
                            stroke-width="2"/>

                        <line
                            x1="12"
                            y1="18"
                            x2="12"
                            y2="22"
                            stroke="currentColor"
                            stroke-width="2"/>

                        <line
                            x1="2"
                            y1="12"
                            x2="6"
                            y2="12"
                            stroke="currentColor"
                            stroke-width="2"/>

                        <line
                            x1="18"
                            y1="12"
                            x2="22"
                            y2="12"
                            stroke="currentColor"
                            stroke-width="2"/>

                    </svg>
                    `;

      button.title = "Find restaurants near me";

      L.DomEvent.on(button, "click", function (e) {
        L.DomEvent.stopPropagation(e);

        locateUser();
      });

      return button;
    },
  });

  map.addControl(new LocationControl());
}

function locateUser() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");

    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      userLocation = {
        lat: position.coords.latitude,

        lon: position.coords.longitude,

        accuracy: position.coords.accuracy,
      };

      console.log("User location:", userLocation);

      showUserLocation();

      map.flyTo(
        [userLocation.lat, userLocation.lon],

        15,

        {
          duration: 1,
        },
      );

      // refreshDistanceData();
      showNearbyRestaurants();
    },

    function (error) {
      console.error("Location error:", error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert(
            "Location permission was denied. Please enable location access in your browser settings.",
          );

          break;

        case error.POSITION_UNAVAILABLE:
          alert("Unable to determine your location.");

          break;

        case error.TIMEOUT:
          alert("Location request timed out.");

          break;

        default:
          alert("Unable to get your location.");
      }
    },

    {
      enableHighAccuracy: true,

      timeout: 15000,

      maximumAge: 0,
    },
  );
}

function showUserLocation() {
  /*
        Remove previous location display
    */

  if (userMarker) {
    userMarker.remove();
  }

  if (userAccuracyCircle) {
    userAccuracyCircle.remove();
  }

  /*
        Accuracy circle

        userLocation.accuracy
        comes from GPS
    */

  userAccuracyCircle = L.circle(
    [userLocation.lat, userLocation.lon],

    {
      radius: userLocation.accuracy,

      color: "#2563eb",

      weight: 1,

      fillColor: "#3b82f6",

      fillOpacity: 0.15,
    },
  )

    .addTo(map);

  /*
        Center location dot
    */

  userMarker = L.circleMarker(
    [userLocation.lat, userLocation.lon],

    {
      radius: 8,

      color: "#ffffff",

      weight: 2,

      fillColor: "#2563eb",

      fillOpacity: 1,
    },
  )

    .addTo(map);
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// function findNearbyRestaurants(radiusKm = 1) {
//   if (!userLocation) return [];

//   return AppState.restaurants

//     .map((restaurant) => {
//       return {
//         ...restaurant,

//         distance: distanceKm(
//           userLocation.lat,

//           userLocation.lon,

//           restaurant.lat,

//           restaurant.lon,
//         ),
//       };
//     })

//     .filter((restaurant) => {
//       return restaurant.distance <= radiusKm;
//     })

//     .sort((a, b) => a.distance - b.distance);
// }

function addDistance(row) {
  if (!userLocation) return "";

  const km =
    row.distance ??
    distanceKm(
      userLocation.lat,

      userLocation.lon,

      row.lat,

      row.lon,
    );

  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }

  return `${km.toFixed(1)}km`;
}

function refreshDistanceData() {
  if (!userLocation) return;

  currentResults = findNearbyRestaurants(1);

  renderSearchResults(currentResults);
}

function showNearbyRestaurants() {
  const nearby = findNearbyRestaurants(1);

  console.log("Nearby restaurants:", nearby);

  currentResults = nearby.map((restaurant) => ({
    restaurant,
  }));

  renderSearchResults(currentResults);
}
function findNearbyRestaurants(radiusKm = 1) {
  if (!userLocation) return [];

  return AppState.restaurants

    .map((restaurant) => {
      const distance = distanceKm(
        userLocation.lat,

        userLocation.lon,

        restaurant.lat,

        restaurant.lon,
      );

      return {
        restaurant,

        distance,
      };
    })

    .filter((item) => {
      return item.distance <= radiusKm;
    })

    .sort((a, b) => {
      return a.distance - b.distance;
    })

    .map((item) => {
      return item.restaurant;
    });
}

window.initializeLocation = initializeLocation;
window.locateUser = locateUser;
window.addDistance = addDistance;
window.refreshDistanceData = refreshDistanceData;
