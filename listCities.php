<?php
$url = "https://www.prevision-meteo.ch/services/json/list-cities";
$json = file_get_contents($url);
echo $json;
?>