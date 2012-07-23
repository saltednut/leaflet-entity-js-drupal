<?php
/**
 * @file
 * location_example.features.inc
 */

/**
 * Implements hook_node_info().
 */
function location_example_node_info() {
  $items = array(
    'location' => array(
      'name' => t('Location'),
      'base' => 'node_content',
      'description' => t('A geographical <em>location</em> denoted by latitude and longitude.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
