<?php
// Inclusión del archivo de configuración
include '../../config.php';

// Verificación de la conexión a la base de datos
if (!isset($conn)) {
    die('La conexión a la base de datos no se ha establecido.');
}

// Procesamiento de la solicitud GET
if (isset($_GET['openinghour1'])) {
    $openinghour = $_GET['openinghour1'];

    // Preparar y ejecutar la consulta SQL para buscar solo por 'openinghour'
    $stmt = $conn->prepare("SELECT * FROM places WHERE description = 'normal' AND openinghour LIKE ?");
    $openinghour = '%' . $openinghour . '%';
    $stmt->bind_param("s", $openinghour);

    // Ejecutar la consulta
    $stmt->execute();
    $result = $stmt->get_result();

    // Crear el arreglo de resultados
    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Enviar la respuesta en formato JSON
    echo json_encode($data);

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conn->close();
} else {
    // Respuesta en caso de no proporcionarse un término de búsqueda
    echo json_encode(["error" => "No se proporcionó un término de búsqueda."]);
}
?>
