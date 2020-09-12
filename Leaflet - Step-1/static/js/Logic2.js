//  Define Map

function createMap(earthquakes) {

    // Define streetmap layer

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: api_key
    });


    var myMap = L.map("map", {
        center: [40.75, -111.87],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

// Create a first layer for map: markers

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
                color = "#5c0003";
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






// Here we make an AJAX call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    // Here we add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    // Here we create a legend control object.
    var legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Finally, we our legend to the map.
    legend.addTo(map);
});