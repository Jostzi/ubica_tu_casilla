<?php
include '../../config.php';

$lat = $_GET['latitud'];
$lng = $_GET['longitud'];

// Consulta SQL utilizando la fórmula Haversine
$query = "SELECT *, 
                 (6371 * acos(cos(radians($lat)) 
                 * cos(radians(lat)) 
                 * cos(radians(lng) - radians($lng)) 
                 + sin(radians($lat)) 
                 * sin(radians(lat)))) AS distancia 
          FROM places 
          WHERE description = 'especial' 
          ORDER BY distancia 
          LIMIT 3";

$resultado = $conn->query($query);

$data = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>  
