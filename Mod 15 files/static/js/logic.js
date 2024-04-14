// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Define functions
function getMarkerColor(depth) {
    if (depth >= -10 && depth < 10) {
        return 'green'; // Earthquakes with depth between -10 and 10 km
    } else if (depth >= 10 && depth < 30) {
        return 'lightgreen'; // Earthquakes with depth between 10 and 30 km
    } else if (depth >= 30 && depth < 50) {
        return 'yellow'; // Earthquakes with depth between 30 and 50 km
    } else if (depth >= 50 && depth < 70) {
        return 'orange'; // Earthquakes with depth between 50 and 70 km
    } else if (depth >= 70 && depth < 90) {
        return 'red'; // Earthquakes with depth between 70 and 90 km
    } else if (depth >= 90) {
        return 'darkred'; // Earthquakes with depth greater than or equal to 90 km
    } else {
        return 'black'; // Unknown depth, setting marker color to black
    }
}

// Function to add legend
function addLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += '<strong>Depth</strong><br>';
        for (let i = 0; i < depths.length; i++) {
            let color = getMarkerColor(depths[i]);
            div.innerHTML +=
                '<i style="background:' + color + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
        return div;
    };

    legend.addTo(myMap);
}


// Function to create popups
function createPopup(feature, layer) {
    layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
}

// Get the data with d3.
d3.json(baseURL).then(function (response) {
    // Add GeoJSON layer with popups
    L.geoJson(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            return {
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag * 6,
                color: 'red',
                weight: 0.3,
                fillOpacity: 0.7
            };
        },
        onEachFeature: createPopup
    }).addTo(myMap);

    // Add legend
    addLegend();
});
