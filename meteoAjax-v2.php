<?php
$ville = $_POST['ville'];
$url = "http://www.prevision-meteo.ch/services/json/";
$json = file_get_contents($url . $ville);
echo $json;
?>