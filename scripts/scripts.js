/* Scripts */

// Variable for coordinate picking mode
var coordinatePickingMode = false;

// Test locations
var testResults = [{lat: 19.3487419, lng: -98.1885055}, {lat: 60.169497, lng: 24.933689}, {lat: 60.170768, lng: 24.941535}, {lat: 60.175841, lng: 24.804531}];

// Main variable for fetched places
var locationsFromDB = [];

// AJAX content loading
function loadAjax(page){
  switch (page) {
    case "new":
    $("#addPlace").load("views/new/addNew.html");
        break; 
    case "edit":
    $("#listPlaces").load("views/edit/edit.html");
        break; 
    case "ubica":
    $("#ubicasilla").load("views/casilla/casilla.html");
        break; 
    case "ubicaespecial":
    $("#ubicasillaespecial").load("views/casilla/casillaespecial.html");
        break; 
    case "ubicaurna":
    $("#ubicaurna").load("views/casilla/urnalectronica.html");
        break; 
    default: 
    

    // Do nothing basically
  }
}

function adjustMapOnTabChange() {
  // Asegúrate de que este código se ejecuta después de que el mapa se haya cargado
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    google.maps.event.trigger(map, 'resize');
    if (map && pos) {
      map.setCenter(pos);
    }
  });
}

$(document).ready(function() {
  initMap(); // Llama a initMap aquí en lugar de fetchMarkersFromDB directamente
  fetchMarkersFromDB();
  adjustMapOnTabChange();
});


var map = new google.maps.Map(document.getElementById('map'), {
  center: pos,
  zoom: 9
});
var pos;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 9
      });
      

      new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Tu ubicación actual'
        
      });

      
      // Click event for coordinate picking
      map.addListener('click', function(e) {
        if (coordinatePickingMode === true){
          GetCoordinatesFromMap(e.latLng, map);
        } else {
          // do nothing so that map can be operated normally
        }
      });
    
      fetchMarkersFromDB();

      
     

      // Ahora esta función debe agregar marcadores al mapa existente

    }, function(error) {
      console.error("Error al obtener la ubicación: ", error);
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644}, // Un valor predeterminado
        zoom: 9
      });
    });
  } else {
    console.log("La geolocalización no está disponible en tu navegador.");
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644}, // Un valor predeterminado
      zoom: 9
    });
    
  }
}


// Get added places locations from database and place them on map
function fetchMarkersFromDB(){
  loadAjax('new');
  $.ajax({
    type: "GET",
    url: "getMapMarkers.php",     
    dataType: 'json',    
    success: function(response) {                    
        // Añade los marcadores al mapa aquí sin llamar a initMap
        response.forEach(function(markerData) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markerData.lat, markerData.lng),
            map: map,
            title: markerData.title // Asume que markerData tiene una propiedad 'title'
          });
        });
    },
    error: function(error) {                    
      toastr.error('Error: ' + error, 'Fetching map markers from database failed :(');
    }
  }); 
}


// Call fetchMarkersFromDB() when page has loaded
$( document ).ready(function() {
  fetchMarkersFromDB();
});

  // Loop locations to map
  for (var i = 0; i < locationsFromDB.length; i++) {
    var latLng = new google.maps.LatLng(locationsFromDB[i].lat,locationsFromDB[i].lng);
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
  }
  // Click event for coordinate picking
  map.addListener('click', function(e) {
    if (coordinatePickingMode) {
        // Obtiene las coordenadas donde el usuario hizo clic
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();

        // Establece las coordenadas en los campos de entrada
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

        // Desactiva el modo de selección después de seleccionar las coordenadas
        coordinatePickingMode = false;
        document.getElementById('pickFromMapBtn').textContent = 'Pick from map';
        document.getElementById('pickFromMapBtn').classList.remove('active');
    }
});


// Function for getting coordinates from map
function GetCoordinatesFromMap(latLng, map) {
  //Optional code for if we want to add a marker on the map too
  // var marker = new google.maps.Marker({
  //   position: latLng,
  //   map: map
  // });
  // map.panTo(latLng);
  console.log("New map marker added, lat: " + latLng.lat() + " lng: " + latLng.lng());
  // Insert picked coordinates to form fields
  $("#lat").val(latLng.lat());
  $("#lng").val(latLng.lng());
  // Disable coordinatePickingMode
  coordinatePickingMode = false;
  // Reset button state
  $("#pickFromMapBtn").html("Pick from map");
  $("#map").removeClass("pickingModeActive");
  // Inform user
  toastr.info('lat: ' + latLng.lat() + ', lng: ' + latLng.lng(), 'Coordinates picked from map!');

  $.ajax({
    url: 'getaddress.php',
    type: 'POST',
    data: {
        lat: latLng.lat(),
        lng: latLng.lng()
    },
    success: function(data) {
        console.log(data); // Imprime la respuesta de la API
        $("#address").val(data); // Coloca la dirección en el campo de texto
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error obteniendo la dirección: ' + textStatus);
    }
}); // Asegúrate de que esta llave cierra correctamente el bloque de AJAX

// Más código si es necesario...
}

// Fuera de la función GetCoordinatesFromMap, asegúrate de que map.addListener esté correctamente colocado
map.addListener('click', function(e) {
if (coordinatePickingMode === true){
    GetCoordinatesFromMap(e.latLng, map);
} else {
    // ...código para manejar clics cuando no está en modo de selección de coordenadas...
}
});


//We only want to pick coordinates when button is pressed so we handle that with this function for now

  
  // Cambiar el texto del botón basado en el modo

  function setPickingMode(){
    if (coordinatePickingMode === false){
      coordinatePickingMode = true;
      $("#pickFromMapBtn").html("Cancel picking");
      $("#map").addClass("pickingModeActive");
    } else {
      coordinatePickingMode = false;
      $("#pickFromMapBtn").html("Pick from map");
      $("#map").removeClass("pickingModeActive");
    }
  }



