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
    var changeRoomDiv = document.getElementById('change_room');
    changeRoomDiv.innerHTML =`
    <nav class="navbar has-shadow user-nav">
    <div class="navbar-start">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}" alt="Image" class="is-rounded">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${roomName}</strong>
              <br>
              <small>...</small>
            </p>
          </div>
        </div>
      </div>
  </div>
  <div class="navbar-end">
    <a class="navbar-item">
      <span class="icon is-size-2">
        <svg class="bi bi-gear-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
        d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 01-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 01.872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 012.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 012.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 01.872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 01-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 01-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 100-5.86 2.929 2.929 0 000 5.858z"
        clip-rule="evenodd" />
      </svg>
    </span>
  </a>
  <a class="navbar-item">
    <span class="icon is-size-2">
      <svg class="bi bi-info-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd"
      d="M8 16A8 8 0 108 0a8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 100-2 1 1 0 000 2z"
      clip-rule="evenodd" />
    </svg>
  </span>
</a>
</div>
</nav>

<div class="columns">
<div class="column is-8 is-12-mobile is-flex hero is-fullheight message-window">
<div class="flex-item-1">
  <p id="root"></p>
</div>
<div class="flex-item-2">
  <form>
    <div class="field has-addons">
      <div class="control">
        <input class="input emojiarea" type="text" id="message-input" placeholder="Type your message..."
        onkeydown="handleKeyDown(event)">
      </div>
      <div class="control">
            <button type="button" class="button" id="send-message" value="Enviar">
              <svg height="36px" width="36px" viewBox="0 0 36 36">
                <g fill="none" fill-rule="evenodd">
                  <g>
                    <polygon points="0 36 36 36 36 0 0 0"></polygon>
                    <path
                    d="M31.1059281,19.4468693 L10.3449666,29.8224462 C8.94594087,30.5217547 7.49043432,29.0215929 8.17420251,27.6529892 C8.17420251,27.6529892 10.7473302,22.456697 11.4550902,21.0955966 C12.1628503,19.7344961 12.9730756,19.4988922 20.4970248,18.5264632 C20.7754304,18.4904474 21.0033531,18.2803547 21.0033531,17.9997309 C21.0033531,17.7196073 20.7754304,17.5095146 20.4970248,17.4734988 C12.9730756,16.5010698 12.1628503,16.2654659 11.4550902,14.9043654 C10.7473302,13.5437652 8.17420251,8.34697281 8.17420251,8.34697281 C7.49043432,6.9788693 8.94594087,5.47820732 10.3449666,6.1775158 L31.1059281,16.553593 C32.298024,17.1488555 32.298024,18.8511065 31.1059281,19.4468693"
                    fill="#363636"></path>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="column is-hidden-mobile sidebar-profile">
    Profile Section
  </div>
</div>
    `;
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
