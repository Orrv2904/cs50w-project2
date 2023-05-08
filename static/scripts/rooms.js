// Script to create rooms

$(document).ready(function () {
    var socket = io();

    // Cargar las salas existentes desde el localStorage
    var existingRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    for (var i = 0; i < existingRooms.length; i++) {
        var roomName = existingRooms[i];
        var roomHtml = `
    <li class="active">
        <div class="d-flex bd-highlight" id="roomInfoContainer">
            <div class="img_cont">
                <img src="https://cdn.iconscout.com/icon/free/png-512/free-chat-message-notification-bubble-talk-15-17196.png?f=avif&w=256"
                    class="rounded-circle user_img">
                <span class="online_icon"></span>
            </div>
            <div class="user_info">
                <span>${roomName}</span>
                <p>Status</p>
            </div>
            <div class="user_info">
                <button class="btn btn-success btn-sm enterRoomBtn">Enter</button>
            </div>
        </div>
    </li>
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
    <li class="active">
        <div class="d-flex bd-highlight" id="roomInfoContainer">
            <div class="img_cont">
                <img src="https://cdn.iconscout.com/icon/free/png-512/free-chat-message-notification-bubble-talk-15-17196.png?f=avif&w=256"
                    class="rounded-circle user_img">
                <span class="online_icon"></span>
            </div>
            <div class="user_info">
                <span>${roomName}</span>
                <p>Status</p>
            </div>
            <div class="user_info">
                <button class="btn btn-success btn-sm enterRoomBtn">Enter</button>
            </div>
        </div>
    </li>
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
        swal("¡Sala creada!", `Se ha creado la sala "${roomName}" exitosamente.`, "success");
    });

    // Manejador de eventos para el botón de unirse a una sala existente
    $('#roomList').on('click', 'li', function () {
        var roomName = $(this).find('.user_info span').text();
        // Aquí puedes agregar la lógica para unirse a la sala seleccionada
        console.log('Unirse a la sala:', roomName); // Agregar un console.log para verificar
    });

});
