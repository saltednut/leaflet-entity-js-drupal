/**
 * Return current page context as JSON object.
 */
function append_node_map(element) {
  return (function ($) {
    //append a map div to the page
    $(element).append('<div id="map" style="height: 400px"></div>');
    //leaflet map as #map
    var map = new L.Map('map');
    //load tile layers from cloudmade (brantwynn api)
    var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/d8f17888797a4f68ad51b58f048257bb/997/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    });
    //create a new latlng for London, England
    var london = new L.LatLng(51.505, -0.09);
    //set London as the center of the map w/ zoom at lvl 10
    map.setView(london, 10).addLayer(cloudmade);
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
        //create a marker and assign it latlng
        var marker = new L.Marker(latlng);
        map.addLayer(marker);
        //drop a view mode for the node into a popup
        entity_render_view('node', node.nid, 'default').done(function(view) {
          marker.bindPopup(view);
        });
      });
    });
  })(jQuery);
}

jQuery(document).ready(function($) {
  append_node_map('.front #block-system-main');
});
