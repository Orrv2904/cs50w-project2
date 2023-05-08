// Script to create rooms

$(document).ready(function () {
    var socket = io();

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
                <img src="https://via.placeholder.com/150" alt="Image" class="is-rounded">
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
        if (existingRooms.includes(roomName)) {
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
                <img src="https://via.placeholder.com/150" alt="Image" class="is-rounded">
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
        existingRooms.push(roomName);
        localStorage.setItem('rooms', JSON.stringify(existingRooms));

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

});
