// Define Map

function createMap(earthquakes) {

    // Define streetmap layer

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: api_key
    });


    var myMap = L.map("map", {
        center: [
            40.75, -111.87
        ],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

// Import url from website and make it a variable

var earthquakesurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// GET request on url

d3.json(earthquakesurl, function(data) {
    createFeatures(data.features);

    ;
})

// Create a first layer for map: markers

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");

        var legend = L.control({ position: "bottomright" });

        legend.onAdd = function() {

            var div = L.DomUtil.create("div", "info legend");
            grades = [1, 2, 3, 4, 5];
            colors = ["#90ee90", "green", "yellow", "orange", "red", "brown"];

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

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {

            var color = "";
            if (Math.floor(feature.properties.mag) < 1) {
                color = "#90ee90";
            } else if (Math.floor(feature.properties.mag) < 2) {
                color = "green";
            } else if (Math.floor(feature.properties.mag) < 3) {
                color = "yellow";
            } else if (Math.floor(feature.properties.mag) < 4) {
                color = "orange";
            } else if (Math.floor(feature.properties.mag) < 5) {
                color = "red";
            } else if (Math.floor(feature.properties.mag) < 6) {
                color = "brown";
            }
            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 7,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    createMap(earthquakes);
};