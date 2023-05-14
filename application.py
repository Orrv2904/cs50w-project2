import os
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, get_flashed_messages
from flask_socketio import SocketIO, emit, join_room, leave_room
from dotenv import load_dotenv
import json
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = {"global": [],
         "Web": [],
         "CS": []}
users = []
messages = {}

@app.route("/")
def index():
    # return "Project 2: TODO"
    return render_template("login.html")

@app.route("/chat")
def chat():
    global rooms
    return render_template("chat.html", rooms=rooms)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# @app.route("/login")
# def login():
#     return render_template("login.html")

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    session['username'] = username
    return redirect(url_for('chat'))

@socketio.on('cargar_rooms')
def cargar_rooms(data):
    lista_rooms = rooms
    emit('cargar_rooms2', lista_rooms)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', to=room)

# @socketio.on("join_room")
# def Join(room):
#     join_room(room)
#     emit('mensaje', f"Un usuario ah ingresado a la Sala {room}", broadcast=False,
#         include_self=False, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)



@socketio.on('create_room')
def create_room(data):
    room_name = data['roomName']
    rooms[room_name]=[]
    emit('room_created', {'roomName': room_name}, broadcast=True)
    print(rooms)
    print('Sala creada:', room_name)

@socketio.on('register_user')
def register_user(data):
    username = data['username']
    users.append(username)
    emit('registration_successful', {'username': username})



@socketio.on('connect')
def connect():
    emit('connection_success', {'message': 'Conexión exitosa'})  # Emite un evento de éxito de conexión

@socketio.on('disconnect')
def disconnect():
  emit('user_disconnected', {'userId': request.sid})





@socketio.on("message_on_room")
def message_on_room(data):
    username = data["username"]
    message = data["message_on_room"]
    datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    room = data["room"]
    if room not in messages:
        messages[room] = {"username": [], "datetime": [], "message": []}
    messages[room]["username"].append(username)
    messages[room]["datetime"].append(datetime)
    messages[room]["message"].append(message)
    emit("message_on_room", {"username": username, "datetime": datetime, "message": message}, room=room)



# @socketio.on("message") 
# def message(data):
#   print(data)
#   emit("message", data["message"],  broadcast=False, include_self=True, to=data["room"])

@socketio.on("message") 
def message(data):
  print(data)
  emit("message", data["message"],  broadcast=True)

@socketio.on('new_message')
def new_message(data):
    room_name = data['roomName']
    message = data['message']
    if room_name not in rooms:
        rooms[room_name] = []
    rooms[room_name].append(message)
    emit('message_sent', {'message': message}, room=room_name)
    print('Mensaje enviado:', message)


# @socketio.on("msg")
# def msg(rooms):



if __name__ == '__main__':
    socketio.run(app, debug=True)