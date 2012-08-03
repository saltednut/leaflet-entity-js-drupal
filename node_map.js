/**
 * Append a leaflet map to an existing element.
 * Use existing node data to populate the map.
 */
function append_node_map(element) {
  return (function ($) {
    //append a map div to the page
    $(element).append('<div id="map" style="height: 400px"></div>');
    //leaflet map as #map
    var map = new L.Map('map');
    //load tile layers from cloudmade
    var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/API-KEY-HERE/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    });
    map.addLayer(cloudmade);
    //Use EFQ to get all 'location' nodes
    conditions = {
      "entityCondition": [
        [ "entity_type", "node" ],
        [ "bundle", "location" ]
      ],
      "propertyCondition": [
        [ "status", 1 ]
      ],
    }
    entity_field_query_json(conditions, true).done(function(data) {
      $.each(data.node, function(index, node) {
        //set latitude & longitude fields for map
        var latlng = new L.LatLng(
            node.field_location_latitude.und[0].value,
            node.field_location_longitude.und[0].value
        );
        map.setView(latlng, 12);
        //create a marker and assign it latlng
        var marker = new L.Marker(latlng);
        map.addLayer(marker);
        //drop a view mode for the node into a popup
        marker.on('mouseover', function(e) {
          marker.bindPopup('loading...');
          entity_render_view('node', node.nid, 'default').done(function(view) {
            marker.bindPopup(view);
          });
        });
      });
    });
  })(jQuery);
}

jQuery(document).ready(function($) {
  append_node_map('.front #main-content');
});
