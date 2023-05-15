# Project 2 Flack

Web Programming with Python and JavaScript
##

Este proyecto consiste en una aplicación en donde los usuarios pueden conectarse a salas, crear salas y mandar mensajes en tiempo real.

[Puedes ver el Deploy aquí]()


<input type="hidden" id="tecnologias" value="">

## Tecnologías que se usaron:

<p align="center">
  <img src="https://forthebadge.com/images/badges/made-with-javascript.svg">
</p>

<p align="center">
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="https://badge.fury.io/py/HTML"><img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white" alt="SOCKET"></a>
   <a href="https://badge.fury.io/py/HTML"><img src="https://img.shields.io/badge/Flask--Socket.io-000000?style=flat-square&logo=flask&logoColor=white" alt="FLASKSOCKET"></a>
  <a href="https://badge.fury.io/py/flask"><img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://badge.fury.io/py/HTML"><img src="https://img.shields.io/badge/HTML-239120?style=flat-square&logo=html5&logoColor=white" alt="HTML"></a>

 
</p>

1. <b>Python</b>: Se uso en la creacion de los eventos del servidor con flask socket io. 

2. <b>HTML</b>: Se utilizó para la creación de nuestras plantillas (templates) que se muestran en la vista del cliente.

3. <b>JavaScript</b>: Se utilizó para la integracion de socket io cliente con flask socket io servidor y algunas funcionalidades extras.

## 

<input type="hidden" id="como_funciona" value="">

## ¿Comó Funciona?

Funciona de la siguiente manera:

<details><summary><b>Inicio de sesion</b></summary>
Los usuarios podran acceder a la aplicacion de chat por medio de un inicio de sesion que se registrara con un nombre de usuario.
</details>
<details><summary><b>Creacion de salas</b></summary>
Los usuarios podran crear salas de chat por medio de un modal.
</details>
<details><summary><b>Envio de mensajes</b></summary>
El usuario podra enviar mensajes por medio de un chat general y dentro de las salas especificas.
</details>

## Toque personal

El toque personal que decidi darle fue el envio de emojis y la opcion de buscar salas por medio de un input de busqueda que se encuentra arriba de las salas.

##

<input type="hidden" id="instalacion" value="">

## Instalación:

* Para poder ejecutar la aplicación deberá tener un IDE instalado, le recomiendo que use Visual Studio Code ya que en este se creó la aplicación. Puede descargarlo aquí: [VS Code](https://code.visualstudio.com/docs/?dv=win).
Posteriormente, deberá clonar o descargar nuestro repositorio. Puede hacerlo con este comando:
```
Git Clone https://github.com/Orrv2904/cs50w-project2
```
* Una vez descargado, podrás acceder a él por medio del CMD de Windows o si prefieres, puedes usar ```MINGW64``` de Git y luego ejecutar el comando ```Code .``` para abrirlo en VS Code.

* Ahora deberá instalar las <b>dependencias</b> de nuestro programa. Para ello, deberá abrir una terminal dentro de VS Code. Puede abrirla desde el menú superior seleccionando "Terminal" y luego "New Terminal", o presionando la combinación de teclas ```Ctrl + Shift + ``` si estás en Windows o Linux, o ```Cmd + Shift +``` si estás en Mac.
* Dentro de esta terminal, deberás instalar ```pip``` si aún no lo tienes instalado. Para hacerlo, ejecuta el siguiente comando: ```pip install pip```. Normalmente, pip viene instalado con Python. Si aún no tienes instalado Python, puedes aprender cómo hacerlo leyendo [aqui](https://tutorial.djangogirls.org/es/python_installation/).
* Luego, deberás crear un <b>Entorno Virtual</b> haciendo uso del siguiente comando: ```python -m venv env```. Para activarlo, ejecuta este otro comando: ```.\env\Scripts\activate```.
* Ahora deberás instalar nuestras dependencias que se encuentran en nuestro archivo <b>requirements.txt</b>. Para ello, ejecuta ```pip install -r .\requirements.txt``` y espera a que se termine de instalar todo.
* Posteriormente, deberás crear un archivo llamado <b>.env</b> donde contendrá todas las variables de entorno que usará nuestra aplicación. Puedes crearlo manualmente o también puedes ejecutar este comando: ```touch .env```. Dentro de este archivo, deberás escribir las variables que están en ```.env.templates```, que son las siguientes:
```
export FLASK_APP=application.py
export FLASK_DEBUG=1
```
##

<input type="hidden" id="ejecucion" value="">

## Ejecución:

Para ejecutar la aplicación, deberás ejecutar el siguiente comando:
 * ```Flask Run``` el cual te abrirá la aplicación en un puerto de tu computadora, por lo general es el <b>5000</b>. Puedes acceder a él mediante tu navegador web escribiendo la siguiente dirección ```http://localhost:5000/```
##
