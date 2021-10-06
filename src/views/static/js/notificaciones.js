var socket = io();

var listaNotif = document.getElementById("notificaciones");

var notificacion = `
<div class="col-12 pb-3">
    <strong id="nombre" class="text-info"></strong>
    <p id="mensaje" class="m-0 lead"></p>
</div>
`
const username = document.querySelector('.username').getAttribute('id');
var contador = 0;
var campana = document.getElementById("alertsDropdown");
campana.onclick = function () {
    var item = document.createElement('div');

    listaNotif.appendChild(item);
}