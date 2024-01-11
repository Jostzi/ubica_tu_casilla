$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            buscarCasillasEspeciales(lat, lng);
        });
    } else {
        alert("La geolocalización no es soportada por este navegador.");
    }

    function buscarCasillasEspeciales(lat, lng) {
        $.ajax({
            url: '/ruta/a/tu/script/php',
            type: 'GET',
            data: {
                latitud: lat,
                longitud: lng,
                tipo: 'especial'
            },
            success: function(data) {
                // Aquí actualizas tu tabla con los datos recibidos
                actualizarTablaCasillasEspeciales(data);
            },
            error: function(error) {
                console.error("Error en la búsqueda: ", error);
            }
        });
    }

    function actualizarTablaCasillasEspeciales(data) {
        var casillas = JSON.parse(data);
        var html = '';
        casillas.forEach(function(casilla) {
            html += `<tr>
                <td>${item.address}</td>
                <td>${item.TipoCasilla}</td>
                <td>${item.closinghour}</td>
                <td><button class='select-location' data-lat='${item.lat}' data-lng='${item.lng}'>Seleccionar</button></td>
            </tr>`;
        });
        $('#searchResultsTableEspecial tbody').html(html);
        // Agregar evento click a los botones de selección
        $('.select-location').on('click', function() {
            var lat = $(this).data('lat');
            var lng = $(this).data('lng');
            localStorage.setItem('selectedLat', lat);
            localStorage.setItem('selectedLng', lng);
            // Opcionalmente, muestra un mensaje de que la ubicación ha sido seleccionada
            // alert("Ubicación seleccionada: Latitud " + lat + ", Longitud " + lng);
        });
    

    }
});
