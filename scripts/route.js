// Definición de las variables para los servicios de Google Maps
var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();
var map;
 directionsRenderer.setMap(map);

console.log("Coordenadas almacenadas - Latitud: " + lat + ", Longitud: " + lng);

// Función para calcular y mostrar la ruta
function calculateAndDisplayRoute() {
    if (!pos || !pos.lat || !pos.lng) {
        console.error('La variable "pos" no está definida o no es válida.');
        return;
    }
    var lat = parseFloat(localStorage.getItem('selectedLat'));
    var lng = parseFloat(localStorage.getItem('selectedLng'));
    var destination = { lat: lat, lng: lng };
    // Verificar si las coordenadas están disponibles
    if (!isNaN(lat) && !isNaN(lng)) {
        directionsService.route({
            origin: pos, // 'pos' debe ser una variable global que contenga tu ubicación actual
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                console.error('Error al calcular la ruta: ' + status);
            }
        });
    } else {
        console.error('No se han seleccionado coordenadas.');
    }
}

// Añadir el listener para el botón de calcular ruta
document.getElementById('calculateRouteBtn').addEventListener('click', function() {
    calculateAndDisplayRoute();
});