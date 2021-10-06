var socket = io();

var listaNotif = document.getElementById("notificaciones");

var notificacion = `
<div class="col-12 pb-3">
    <strong id="nombre" class="text-info"></strong>
    <p id="mensaje" class="m-0 lead"></p>
</div>
`
const username = document.querySelector('.username').getAttribute('id');
socket.on(username + '_notificacion', (msg) => {
    const message = JSON.parse(msg);
    console.log(message);
    var item = document.createElement('li');
    item.innerHTML = notificacion;
    item.querySelector('#nombre').textContent = message.name;

    if(message.type === 'FOLLOW'){
        item.querySelector('#mensaje').textContent = 'Empezo a seguirte';
        console.log(item);
    }

    if(message.type === 'LIKE'){
        console.log("DENTRO DEL IF");
        item.querySelector('#mensaje').textContent = 'Le dio like a tu post ' + message.post;
        console.log(item);
    }
    const contador = document.getElementById('contadorNoti');
    contador.textContent = parseInt(contador.textContent) + 1;
    console.log(listaNotif);
    listaNotif.appendChild(item);
}); 