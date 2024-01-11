$(document).ready(function() {
    loadNormalCasillas();
    $('#BuscarCasilla').click(function() {
        var seccionElectoral = $('#openinghour1').val().trim();
        console.log("Sección Electoral: ", seccionElectoral);
        

        if(seccionElectoral) {
            searchCasillas(seccionElectoral);
        } else {
            alert("Por favor, introduce la sección electoral para buscar tu casilla.");
        }
    });
    function loadNormalCasillas() {
        $.ajax({
            url: '/views/casilla/search.php',
            type: 'GET',
            data: { 'description': 'normal' }, // Asegúrate de que tu PHP pueda manejar este parámetro
            success: updateSearchResults,
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error al cargar casillas normales: " + textStatus, errorThrown);
            }
        });
    }
    
    function searchCasillas(seccionElectoral) {
        $.ajax({
            url: '/views/casilla/search.php',
            type: 'GET',
            data: { 'openinghour1': seccionElectoral },
            success: updateSearchResults,
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error en la búsqueda: " + textStatus, errorThrown);
            }
        });
    }

    


        // Función para actualizar los resultados de la búsqueda
        function updateSearchResults(data) {
            var results = JSON.parse(data);
            var html = '';
            results.forEach(function(item) {
                html += `<tr>
                            <td>${item.address}</td>
                            <td>${item.TipoCasilla}</td>
                            <td>${item.closinghour}</td>
                            <td><button class='select-location' data-lat='${item.lat}' data-lng='${item.lng}'>Seleccionar</button></td>
                        </tr>`;
            });
            $('#searchResultsTable tbody').html(html);

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

        // Evento oninput para manejar la búsqueda en tiempo real
        $('#searchInput').on('input', function() {
            searchCasillas(this.value);
        });

        // Mantén tu evento de submit existente aquí
        $('#searchForm').on('submit', function(e) {
            e.preventDefault();
            var query = $('#searchInput').val();
            searchCasillas(query); // Reutiliza la función de búsqueda en tiempo real
        });
    });


