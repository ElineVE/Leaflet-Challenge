// Define Map

function createMap(earthquakes) {

    // Define streetmap layer

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: api_key
    });
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: api_key
    });

    // Display layer on two different ways to view the maps

    var myMap = L.map("map", {
        center: [
            40.75, -111.87
        ],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite": satellitemap
    };
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false

        // Add a colored legend to the map

    }).addTo(myMap);
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {

        var div = L.DomUtil.create("div", "info legend");
        grades = [0, 1, 2, 3, 4, 5];
        colors = ["#98ee00", "green", "teal", "yellow", "orange", "red"];

        // Looping through intervals, generating labels with colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap);

}

// Import url from website and make it a variable

var earthquakesurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// GET request on url

d3.json(earthquakesurl, function(data) {
    createFeatures(data.features);

    ;
})

// Create a layer for the map

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");


    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {

            var color = "";
            if (Math.floor(feature.properties.mag) > 5) {
                color = "red";
            } else if (Math.floor(feature.properties.mag) > 4) {
                color = "orange";
            } else if (Math.floor(feature.properties.mag) > 3) {
                color = "yellow";
            } else if (Math.floor(feature.properties.mag) > 2) {
                color = "green";
            } else if (Math.floor(feature.properties.mag) > 1) {
                color = "teal";
            } else { color = "#98ee00"; }

            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 4,
                fillColor: color,
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    createMap(earthquakes);
};