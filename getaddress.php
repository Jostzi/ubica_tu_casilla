<?php
// Este archivo se llamaría getAddress.php o un nombre similar
require_once 'config.php'; // Aquí incluyes tu configuración de base de datos si es necesario

if (isset($_POST['lat']) && isset($_POST['lng'])) {
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

     // Tu clave de API de Google Maps.
     $apiKey = 'AIzaSyCTbsKH9uUqCHtlW3HDdhgOCcD0_dlvR18';

     // La URL de la API de Geocoding con las coordenadas y tu clave de API.
     $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lng&key=$apiKey";
 
     // Utiliza file_get_contents para obtener la respuesta JSON de la API.
     $response = file_get_contents($url);
     $data = json_decode($response, true);
 
     // Verifica si la API devolvió resultados.
     if ($data['status'] === 'OK' && isset($data['results'][0])) {
         // Toma la dirección del primer resultado.
         $address = $data['results'][0]['formatted_address'];
         echo $address; // Imprime la dirección para que la solicitud AJAX pueda usarla.
     } else {
         echo "No se pudo obtener la dirección."; // Manejo de errores.
     }
    } else {
        echo 'No se proporcionaron coordenadas.';
    }
 ?>




