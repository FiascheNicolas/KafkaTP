var socket = io();

var listaNotif = document.getElementById("notificaciones");

var post = `
<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
        <div class="col-md-4">
            <img src="https://via.placeholder.com/150" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 id="titulo" class="card-title"></h5>
                <p id="mensaje" class="card-text"></p>
            </div>
        </div>
    </div>
</div>`;

var notificacion = `
<div class="col-12 pb-3">
    <strong id="nombre" class="text-info"></strong>
    <p id="mensaje" class="m-0 lead"></p>
</div>
`

socket.on('notificacion', (msg) => {
    const message = JSON.parse(msg);
    var item = document.createElement('li');
    item.innerHTML = notificacion;
    item.querySelector('#nombre').textContent = message.name;

    if(message.type === 'FOLLOW'){
        item.querySelector('#mensaje').textContent = 'Empezo a seguirte';
    }
    else if(message.type === 'LIKE'){
        item.querySelector('#mensaje').textContent = 'Le dio like a tu post ' + message.post;
    }
    const contador = document.getElementById('contadorNoti');
    contador.textContent = parseInt(contador.textContent) + 1;

    listaNotif.appendChild(item);
});