# HankkiTV Restaurant Map

An interactive restaurant discovery map that helps users discover Korean restaurants featured through HankkiTV YouTube content.

The project combines restaurant data, YouTube video integration, interactive mapping, search, geolocation, and offline capabilities into a lightweight Progressive Web App (PWA) designed for desktop and mobile users.

---

# Project Overview

HankkiTV Restaurant Map provides an intuitive way to explore restaurants by location.

Users can:

* Browse restaurants on an interactive map
* Search restaurants by name, location, cuisine, and keywords
* Open restaurant details directly from shared links
* Watch related YouTube videos
* Find nearby restaurants using device location
* Use the map even with limited connectivity through offline caching

The application is built with a focus on:

* Fast loading
* Mobile-friendly interaction
* Minimal dependencies
* Open-source mapping technology

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

## Mapping

* Leaflet.js
* OpenStreetMap-based tile providers
* CARTO map styles
* Esri map layers

## Data

* CSV-based restaurant database
* GeoJSON overlays (planned)
* YouTube video references

## Libraries

* Leaflet MarkerCluster
* PapaParse
* Fuse.js

## Hosting

* GitHub Pages

---

# Completed Features

## Interactive Restaurant Map

✅ Leaflet-powered interactive map

✅ Restaurant markers with custom HankkiTV branding

✅ Marker clustering for large numbers of locations

✅ Automatic map centering and restaurant focus

✅ Restaurant detail panels

---

## Restaurant Search

✅ Real-time search

✅ Fuzzy matching powered by Fuse.js

Search supports:

* Restaurant name
* Alternate names
* Address
* Menu keywords
* Phone numbers

Additional features:

* Keyboard navigation
* Mobile search panel
* Search result highlighting

---

## Restaurant Sharing

✅ Shareable restaurant URLs

Example:

```
https://example.com/?place=VIDEO_ID
```

Opening a shared link automatically:

1. Loads the application
2. Finds the restaurant
3. Centers the map
4. Opens restaurant details

---

## User Location

✅ Browser geolocation support

Features:

* Current location button
* GPS accuracy circle
* User position indicator
* Nearby restaurant discovery
* Distance display

---

## Map Layers

Implemented:

✅ CARTO Light

✅ OpenStreetMap Standard

✅ Esri Street Map

✅ Esri Satellite

Removed:

* CARTO Dark

Reason:

Dark maps provide lower readability in some Korean regions and are less suitable for general visitors.

---

## Offline Support (PWA)

Implemented:

✅ Service worker

✅ Application caching

✅ Offline startup support

✅ Automatic cache version updates

Caching strategy:

* Application files are cached
* Third-party map tiles are not cached
* Dynamic resources use network fallback

---

## Application Loading System

Implemented:

✅ Custom application preloader

Features:

* Library availability checks
* Controlled startup sequence
* Progress updates
* Prevention of duplicate initialization

Startup order:

```
Load libraries
      ↓
Initialize map
      ↓
Load restaurant data
      ↓
Initialize search
      ↓
Initialize location
      ↓
Restore shared restaurant links
      ↓
Display application
```

---

# Current Project Structure

```
HankkiTV/

├── index.html

├── styles.css

├── poi.csv

├── manifest.json

├── service-worker.js

│
├── js/
│
├── app.js
├── preloader.js
├── map.js
├── restaurants.js
├── markers.js
├── search.js
├── details.js
├── location.js
├── router.js
├── state.js
└── storage.js

```

---

# Future Plans

## Transit Integration

Planned:

* Subway stations
* Bus stops
* Subway routes
* Transit visibility controls

Data sources under consideration:

* OpenStreetMap
* GTFS transit feeds
* Open transit datasets

Implementation plan:

```
Transit Data
      ↓
GeoJSON conversion
      ↓
Leaflet overlay layers
      ↓
User-controlled visibility
```

---

## Improved Layer Management

Planned improvements:

* Collapsed layer control
* Map style selector icon
* Transit overlay checkboxes
* Saved user preferences

Example:

```
Map Layers

○ CARTO Light
○ OpenStreetMap
○ Satellite


Transit

□ Subway Stations
□ Bus Stops
□ Subway Lines
```

---

## User Preferences

Planned:

* Remember selected map style
* Remember enabled overlays
* Favorite restaurants
* Personal settings

---

## Restaurant Data Improvements

Possible future additions:

* Restaurant categories
* Price range
* Opening hours
* Popular dishes
* User ratings
* Photo galleries

---

## Performance Improvements

Planned:

* Lazy loading of large datasets
* Better mobile performance
* Optimized GeoJSON handling
* Improved offline behavior

---

# Development Philosophy

HankkiTV follows these principles:

## Open Data First

The project uses open standards whenever possible:

* OpenStreetMap
* GeoJSON
* CSV
* GTFS

---

## Simple Architecture

The project avoids unnecessary backend complexity.

The goal:

```
Static files
+
Open data
+
Modern browser features

=
Fast and maintainable application
```

---

## Mobile First

The application is designed for visitors discovering restaurants while traveling.

Priority:

1. Fast startup
2. Easy navigation
3. Clear map display
4. Simple interaction

---

# Contributing

Suggestions and improvements are welcome.

Areas where contributions would be valuable:

* Restaurant data cleanup
* Transit data integration
* UI improvements
* Performance optimization
* Translation support

---

# License

This project uses open-source libraries and publicly available data sources.

Please respect the licenses and attribution requirements of:

* OpenStreetMap contributors
* Leaflet
* Other third-party libraries used by the project

---

# Roadmap

Current status:

```
Restaurant Map
        ✓

Search
        ✓

Location
        ✓

Offline Support
        ✓

Improved Layer Control
        In Progress

Transit Integration
        Planned

Community Features
        Future
```
