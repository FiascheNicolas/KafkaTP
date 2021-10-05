var socket = io();

var listaNotif = document.getElementById("notificaciones");

var notificacion = `
<div class="col-12 pb-3">
    <strong id="nombre" class="text-info"></strong>
    <p id="mensaje" class="m-0 lead"></p>
</div>
`
const username = document.querySelector('.username').getAttribute('id');
console.log(username);
var contador = 0;
var campana = document.getElementById("alertsDropdown");
campana.onclick = function () {
    var item = document.createElement('div');
    var item2 = document.createElement('div');
    var item3 = document.createElement('div');

    switch (username) {
        case "juan":
            contador++;
            if (contador == 1) item2.textContent = "Marta te sigue"; else item.textContent = "Carlos te sigue";
        case "carlos":
            item.textContent ="Marta te sigue";
            item2.textContent="Laura te sigue";
            item3.textContent="Laura le dio like a tu post";


    }
    listaNotif.appendChild(item);
    listaNotif.appendChild(item2)
    listaNotif.appendChild(item3)
}
/*
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
}); */
