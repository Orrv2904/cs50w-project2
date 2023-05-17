// Script to create rooms


$(document).ready(function () {
  var socket = io();

    canalActual = localStorage.getItem("Canales");
    var roomName = canalActual;
    var figura = $("#Figura_omar");
    // Aquí puedes agregar la lógica para unirse a la sala seleccionada
    console.log(roomName); // Agregar un console.log para verificar
    $("#name_room").text(roomName);
    figura.html(` <figure class="image is-48x48 is-32x32-mobile">
                <img
                src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}"
                alt="avatar" class="is-rounded"
              />
              </figure>
              `);
    socket.emit("cargar_mensajes",roomName);




  socket.emit('cargar_rooms', "cargar datos");
  socket.on("cargar_rooms2", (data) => {
    console.log(data);

    let list_room = $('#roomList')
    let objetoJSON = data;

    for (let clave in objetoJSON) {
      console.log(clave);
      var roomName = clave;
      var roomHtml = `
            <li class="list" id="${roomName}" value="${roomName}">
            <a class="list-item active box">
              <div class="media">
                <div class="media-left" >
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
          </li>
    `;
      $('#roomList').append(roomHtml);
    }

  });






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
        <li class="list" id="${roomName}" value="${roomName}">
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
  $('#roomList').on('click', 'li', event => {
    

    var roomName = event.currentTarget.id;
    var figura = $("#Figura_omar");
    // Aquí puedes agregar la lógica para unirse a la sala seleccionada
    console.log(roomName); // Agregar un console.log para verificar
    $("#name_room").text(roomName);
    figura.html(` <figure class="image is-48x48 is-32x32-mobile">
                <img
                src="https://api.dicebear.com/6.x/identicon/svg?seed=${roomName}"
                alt="avatar" class="is-rounded"
              />
              </figure>
              `);
    localStorage.setItem("Canales", roomName);
    socket.emit("cargar_mensajes",roomName);
  
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


  //Cargar mensajes desde javasr...
  socket.on('cargar_mensajesJS', function(dataM) {
    const padre = document.getElementById('agregar-mensaje');
    const usersContainer = document.getElementById('users');
  
    // Limpiar mensajes previos
    while (padre.firstChild) {
      padre.removeChild(padre.firstChild);
    }
  
    // Limpiar usuarios previos
    usersContainer.innerHTML = '';
  
    // Crear una lista de usuarios únicos en la sala
    const usuariosEnSala = dataM.map(mensaje => mensaje.Usuario);
    const usuariosUnicos = [...new Set(usuariosEnSala)];
  
    // Agregar texto "Usuarios en el chat"
    const usuariosText = document.createElement("p");
    usuariosText.innerText = "Usuarios en el chat";
    usuariosText.classList.add("text-lg", "font-bold", "mb-2");
    usersContainer.appendChild(usuariosText);
  
    // Mostrar usuarios en la sala
    usuariosUnicos.forEach(nombreUsuario => {
      // Mostrar usuario
      const section = document.createElement("section");
      section.classList.add("bg-gray-100", "py-8");
  
      const divProfile = document.createElement("div");
      divProfile.classList.add("max-w-2xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "is-rounded");
      const profileCard = document.createElement("div");
      profileCard.classList.add("bg-white", "shadow-lg", "rounded-lg", "overflow-hidden");
  
      const profileImage = document.createElement("img");
      profileImage.classList.add("w-full");
      profileImage.src = `https://api.dicebear.com/6.x/identicon/svg?seed=${nombreUsuario}`;
      profileImage.alt = "Imagen de perfil";
  
      const profileContent = document.createElement("div");
      profileContent.classList.add("p-4");
  
      const profileName = document.createElement("h3");
      profileName.classList.add("text-lg", "font-bold", "mb-2");
      profileName.innerText = nombreUsuario;
  
      profileContent.appendChild(profileName);
      profileCard.appendChild(profileImage);
      profileCard.appendChild(profileContent);
      divProfile.appendChild(profileCard);
      section.appendChild(divProfile);
      usersContainer.appendChild(section);
    });
  
    // Mostrar mensajes
    dataM.forEach(mensaje => {
      const div = document.createElement('div');
      const time = document.createElement('time');
      const p = document.createElement('p');
  
      div.classList.add('bg-gray-100', 'border', 'border-gray-200', 'rounded-lg', 'px-4', 'py-2', 'max-w-lg');
  
      time.classList.add('mb-1', 'text-xs', 'font-normal', 'text-black-900', 'sm:order-last', 'sm:mb-0');
      time.setAttribute('id', 'datetime');
  
      p.classList.add('mb-2', 'break-all');
      p.setAttribute('id', 'root');
  
      const nombreUsuario = mensaje.Usuario;
      const mensajeTexto = mensaje.Mensaje;
  
      p.innerText += nombreUsuario + ": " + mensajeTexto;
      p.innerHTML += "<br/><br/>";
      time.innerHTML = mensaje.Date;
  
      div.appendChild(time);
      div.appendChild(p);
  
      padre.appendChild(div);
    });
  });
  
  
  
  
  
  
  // socket.on("cargar_usuariosJS", (usuarios) => {
  //   const usersContainer = document.getElementById("users");
  
  //   // Limpiar el contenido previo
  //   usersContainer.innerHTML = "";
  
  //   // Iterar sobre los usuarios y crear las secciones correspondientes
  //   usuarios.forEach((usuario) => {
  //     const section = document.createElement("section");
  //     section.classList.add("bg-gray-100", "py-8");
  
  //     const div = document.createElement("div");
  //     div.classList.add("max-w-2xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8");
  
  //     const profileCard = document.createElement("div");
  //     profileCard.classList.add("bg-white", "shadow-lg", "rounded-lg", "overflow-hidden");
  
  //     const profileImage = document.createElement("img");
  //     profileImage.classList.add("w-full");
  //     profileImage.src = usuario.ruta_imagen; // Reemplaza "usuario.ruta_imagen" con la propiedad adecuada que contiene la ruta de la imagen del usuario
  //     profileImage.alt = "Imagen de perfil";
  
  //     const profileContent = document.createElement("div");
  //     profileContent.classList.add("p-4");
  
  //     const profileName = document.createElement("h3");
  //     profileName.classList.add("text-lg", "font-bold", "mb-2");
  //     profileName.innerText = usuario.nombre; // Reemplaza "usuario.nombre" con la propiedad adecuada que contiene el nombre del usuario
  
  //     profileContent.appendChild(profileName);
  //     profileCard.appendChild(profileImage);
  //     profileCard.appendChild(profileContent);
  //     div.appendChild(profileCard);
  //     section.appendChild(div);
  //     usersContainer.appendChild(section);
  //   });
  // });
  
  
  
  



});
