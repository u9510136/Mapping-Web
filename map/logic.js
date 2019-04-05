var base_map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

var map = L.map("map", {
  center: [40, -95],
  zoom: 5,
  layers: base_map
});

base_map.addTo(map);

var earthquakes = new L.LayerGroup();

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {

  function style_info(features) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: color_opt(features.properties.mag),
      color: "black",
      radius: radius_opt(features.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function color_opt(mag) {
    switch (true) {
      case mag > 5:
        return "red";
      case mag > 4:
        return "darkorange";
      case mag > 3:
        return "orange";
      case mag > 2:
        return "yellow";
      case mag > 1:
        return "green";
      default:
        return "lightgreen";
    }
  }

  function radius_opt(mag) {
    if (mag == 0) {
      return 1;
    } else {
      return mag * 3;
    }
  }

  L.geoJson(data, {
    pointToLayer: function (features, latlng) {
      return L.circleMarker(latlng);
    },
    style: style_info,
    onEachFeature: function (features, layer) {
      layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ["lightgreen", "green", "yellow", "orange", "darkorange", "red"];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  }

  legend.addTo(map);

});