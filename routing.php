<?php
include_once "php/Router.php";
$route = new Route();

// $route->notFound("errors/404.php");

$json = file_get_contents('tutorials.json');
$data = json_decode($json, true);

foreach ($data as $entry) {
    $route->add($entry["permaLink"], $entry["file"]);
}
?>