document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let room;

  socket.on("mensaje", (message) => {
    document.querySelector("#root").append(message);
    document.querySelector("#root").innerHTML += "<br/>";
  });

  const send_message = () => {
    const message = document.querySelector("#message-input").value;
    console.log("Clicked send message button");
    console.log("Message value:", message);
    socket.emit("message", { message, room });
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
    document.querySelector("#root").innerText += data;
    document.querySelector("#root").innerHTML += "<br/>";
  });
});
