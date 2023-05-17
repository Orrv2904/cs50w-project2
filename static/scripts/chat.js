document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let room;

  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
 
  console.log(dateTime)

  /*socket.on("mensaje", (message) => {
    document.querySelector("#root").append(message);
    document.querySelector("#root").innerHTML += "<br/>";
  });*/

  const send_message = () => {
    room = document.querySelector("#name_room").textContent
    nombre = document.querySelector("#name_user").textContent
    const message = document.querySelector("#message-input").value;
    console.log("Clicked send message button");
    console.log("Message value:", message);
    socket.emit("message", { message, room, nombre, dateTime });
    document.querySelector("#message-input").value = "";
  };

  document.querySelector("#send-message").onclick = () => {
    const inputValue = document.querySelector("#message-input").value.trim();
    if (inputValue.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "No puedes enviar un mensaje vacío",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      });
      return;
    }
    send_message();
    document.querySelector(".emojionearea-editor").innerHTML = "";
    // var x = document.getElementById('message-input').autofocus;
    // document.querySelector(".emojionearea-editor").innerHTML = x;
    console.log("prueba2");
  };

  document.querySelector("#message-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = document.querySelector("#message-input").value.trim();
      if (inputValue.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "No puedes enviar un mensaje vacío",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
        return;
      }
      send_message();
    }
  });

  socket.on("message", (data) => {
    console.log(data);
    const nombreUsuario = data.nombre; // Obtener el nombre de usuario
  
    const padre = document.querySelector("#agregar-mensaje");
  
    const div = document.createElement('div');
    const time = document.createElement('time');
    const p = document.createElement('p');
  
    div.classList.add('bg-gray-100', 'border', 'border-gray-200', 'rounded-lg', 'px-4', 'py-2', 'max-w-lg');
  
    time.classList.add('mb-1', 'text-xs', 'font-normal', 'text-black-900', 'sm:order-last', 'sm:mb-0');
    time.setAttribute('id', 'datetime');
  
    p.classList.add('mb-2', 'break-all');
    p.setAttribute('id', 'root');
  
    p.innerText += nombreUsuario + ": " + data.message; // Agregar nombre de usuario al mensaje
    p.innerHTML += "<br/><br/>";
    time.innerHTML = dateTime;
  
    div.appendChild(time);
    div.appendChild(p);
  
    padre.appendChild(div);
  });
  
});


/*
 <div class="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 max-w-lg">
          <time class="mb-1 text-xs font-normal text-black-900 sm:order-last sm:mb-0" id="datetime"></time>
          <p id="root" class="mb-2 break-all"></p>
        </div>



*/