// const form = document.querySelector("form")
// const chatMessages = document.querySelector(".chat__messages")
// const input = document.querySelector(".sendMessage")

// form.addEventListener("submit", sendMessage)

// function sendMessage(e) {
//     e.preventDefault()

//     if (input.value !== "") {
//         var messageDiv = document.createElement("div")
//         messageDiv.className = "message"

//         var avatar = document.createElement("img")
//         avatar.src = "assets/user4.jpg"

//         var messageInfo = document.createElement("div")
//         messageInfo.className = "message__info"

//         var userInfo = document.createElement("h4")
//         userInfo.innerHTML = "Gamer"

//         var messageTimestamp = document.createElement("span")
//         messageTimestamp.className = "message__timestamp"

//         const date = new Date()
//         const year = date.getFullYear()
//         const month = String(date.getMonth()).padStart(2, "0")
//         const day = String(date.getDate()).padStart(2, "0")

//         messageTimestamp.innerHTML = month + "/" + day + "/" + year

//         const message = document.createElement("p")
//         message.innerHTML = input.value
//         input.value = ""

//         userInfo.appendChild(messageTimestamp)
//         messageInfo.appendChild(userInfo)
//         messageInfo.appendChild(message)

//         messageDiv.appendChild(avatar)
//         messageDiv.appendChild(messageInfo)

//         chatMessages.appendChild(messageDiv)
//         chatMessages.scrollBy(0, 10000)
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
  
    let room;
  
    socket.on("mensaje", (message) => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        alert(dateTime);
      document.querySelector("#root").appendChild(message);
      
      document.querySelector("#root").innerHTML += "<br/>"
    })
  
    const send_message = document.querySelector("#send-message");
  
    send_message.onclick = () => {
      const message = document.querySelector("#message-input").value;
      // console.log('test');
  
      console.log(message);
  
      socket.emit("message", { message, room });
      document.querySelector("#message-input").value = '';

  
    }
  
    socket.on("message", data => {
      console.log(data);
      document.querySelector("#root").innerText += data;
      document.querySelector("#root").innerHTML += "<br/>";
    })
  })