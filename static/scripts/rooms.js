// Script to create rooms


$(document).ready(function () {
  var socket = io();


    socket.emit('cargar_rooms', "cargar datos");
    socket.on("cargar_rooms2", (data) => {
      console.log(data);

      let list_room = $('#roomList')
      let objetoJSON = data;
    
      for (let clave in objetoJSON) {
        console.log(clave);
        var roomName = clave;
        var roomHtml = `
            <div class="list" id="${roomName}" value="${roomName}">
            <a class="list-item active box">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48 is-32x32-mobile">
                    <img
                    alt="avatar" class="is-rounded"
                    src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}"
                  />
                  </figure>
                </div>
                <div class="media-content is-hidden-mobile">
                  <div class="content">
                    <p>
                      <strong>${roomName}</strong>
                      <br><small>...</small>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
    `;
        $('#roomList').append(roomHtml);
      }

    });
  

  // Cargar las salas existentes desde el localStorage
  var existingRooms = JSON.parse(localStorage.getItem('rooms')) || [];
  for (var i = 0; i < existingRooms.length; i++) {
    var roomName = existingRooms[i];
    var roomHtml = `
        <div class="list">
        <a class="list-item active box">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48 is-32x32-mobile">
                <img
                alt="avatar" class="is-rounded"
                src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}"
              />
              </figure>
            </div>
            <div class="media-content is-hidden-mobile">
              <div class="content">
                <p>
                  <strong>${roomName}</strong>
                  <br><small>...</small>
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
`;
    $('#roomList').append(roomHtml);
  }

  $('#roomList').on('click', '.enterRoomBtn', function () {
    console.log('Botón "Enter" clickeado'); // Agrega esta línea para verificar si se está ejecutando el controlador de eventos
    $('#usernameModal').modal('show');
  });

  // Manejador de eventos para el botón #saveRoomBtn
  $('#saveRoomBtn').on('click', function () {


    
    // Obtener el nombre de la sala del input del modal
    var roomName = $('#roomNameInput').val();
    if (roomName.trim() === '') {

      // Validar que se haya ingresado un nombre de sala
      swal("¡Error!", "Por favor, ingrese un nombre de sala válido.", "error");
      return;
    }

    // Verificar si la sala ya existe en el localStorage

    if ($('#' + roomName.replace(/\s/g, '')).length > 0 || roomName.trim() === '') {
      swal("¡Error!", "El nombre de sala ya está en uso. Por favor, ingrese un nombre de sala único.", "error");
      return;
    }

    // Enviar el nombre de la sala al servidor a través de Socket.IO
    socket.emit('create_room', { 'roomName': roomName });
    console.log('Nombre de sala enviado:', roomName); // Agregar un console.log para verificar
    $('#createRoomModal').modal('hide'); // Cerrar el modal después de guardar
  });

  // Manejador de eventos para el evento 'room_created'
  socket.on('room_created', function (data) {
    var roomName = data.roomName;

    // Crear una nueva repetición de sala en el HTML
    var roomHtml = `
        <div class="list">
        <a class="list-item active box">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48 is-32x32-mobile">
                <img
                src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}"
                alt="avatar" class="is-rounded"
              />
              </figure>
            </div>
            <div class="media-content is-hidden-mobile">
              <div class="content">
                <p>
                  <strong>${roomName}</strong>
                  <br><small>...</small>
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
`;

    $('#roomList').on('click', '.enterRoomBtn', function () {
      console.log('Botón "Enter" clickeado'); // Agrega esta línea para verificar si se está ejecutando el controlador de eventos
      $('#usernameModal').modal('show');
    });

    // Agregar la nueva sala a la lista de salas
    $('#roomList').append(roomHtml);

    console.log('Sala creada:', roomName); // Agregar un console.log para verificar

    // Guardar la sala en el localStorage
    // existingRooms.push(roomName);
    // localStorage.setItem('rooms', JSON.stringify(existingRooms));



    // Mostrar una alerta usando SweetAlert para indicar que la sala se creó exitosamente
    // swal("¡Sala creada!", `Se ha creado la sala "${roomName}" exitosamente.`, "success");
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: `Sala ${roomName} exitosamente`
    })

  });

  // Manejador de eventos para el botón de unirse a una sala existente
  $('#roomList').on('click', 'li', function () {
    var roomName = $(this).find('.user_info span').text();
    // Aquí puedes agregar la lógica para unirse a la sala seleccionada
    console.log('Unirse a la sala:', roomName); // Agregar un console.log para verificar
  });

  $('#roomList').on('click', '.list-item', function () {
    var roomId = $(this).attr('id');
    window.location.href = '/rooms/' + roomId;
  });

  // Función para buscar una sala por nombre y mostrar solo las coincidencias
  $('#search').on('input', function () {
    var searchValue = $(this).val().toLowerCase(); // Convertir a minúsculas para comparar
  
    $('#roomList .list-item').each(function () {
      var roomName = $(this).find('strong').text().toLowerCase();
      if (roomName.includes(searchValue)) {
        $(this).slideDown(); // Mostrar si hay una coincidencia
        if (roomName === searchValue) {
          $(this).insertBefore($('#roomList .list-item:first')); // Mover la sala encontrada al principio
        }
      } else {
        $(this).slideUp(); // Ocultar si no hay una coincidencia
      }
    });
  
    // Si el input está vacío, volver al estado original
    if (searchValue === '') {
      $('#roomList .list-item').slideDown();
    }
  });
  



});
