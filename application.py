import os
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, get_flashed_messages
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = []
users = []

@app.route("/")
def index():
    # return "Project 2: TODO"
    return render_template("login.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/c")
def c():
    return render_template("01.html")

# @app.route("/login")
# def login():
#     return render_template("login.html")

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre_usuario = request.form['username']
        # Aquí se puede validar el nombre de usuario y almacenarlo en la sesión
        session['username'] = nombre_usuario
        flash('¡Registro exitoso!')
        return redirect(url_for('/chat'))
    return render_template('registro.html')


@socketio.on('create_room')
def create_room(data):
    room_name = data['roomName']
    rooms.append(room_name)  # Agrega el nombre de la sala a la lista
    emit('room_created', {'roomName': room_name}, broadcast=True)  # Emite un evento para notificar a los clientes que se ha creado una sala.
    print('Sala creada:', room_name)

@socketio.on('register_user')
def register_user(data):
    username = data['username']
    users.append(username)
    emit('registration_successful', {'username': username})

@socketio.on('get_users')
def get_users():
    emit('user_list', {'users': users})

@socketio.on('connect')
def connect():
    emit('connection_success', {'message': 'Conexión exitosa'})  # Emite un evento de éxito de conexión

# @socketio.on("message") 
# def message(data):
#   print(data)
#   emit("message", data["message"],  broadcast=False, include_self=True, to=data["room"])

@socketio.on("message") 
def message(data):
  print(data)
  emit("message", data["message"],  broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)