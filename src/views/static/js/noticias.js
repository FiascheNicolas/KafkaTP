var containerNoticia = document.getElementById("verNoticias");

const api_url = "http://localhost:8080/noticias"

let listNoticias = [];
let listTopicos = [];

function apiGet() {
    fetch(api_url + '/traerTopics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            containerNoticia.innerHTML = ``;
            if (data.length === 0) {
                const div = document.createElement('div');
                div.className = "col-12";
                div.innerHTML = `
        <div class="container p-4">
            <div class="row">
              <div class="col mx-auto">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Sin Noticias
                </div>
              </div>
            </div>
          </div>
        `;
                containerNoticia.appendChild(div);
            } else {
                data.forEach(topic => {
                    const newTopic = { 'topic': topic + '_posts' }
                    containerNoticia.innerHTML = ``;
                    traerMensajes(newTopic);
                })
            }
        });
}


function traerMensajes(paramTopico) {
    fetch(api_url + '/traerMensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            topic: paramTopico.topic
        })
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                const objPOst = {
                    "topic": post.topic,
                    "msg": {
                        "id": post.msg.id,
                        "titulo": post.msg.titulo,
                        "imagen": post.msg.imagen,
                        "texto": post.msg.texto,
                        "cantidadLikes": post.msg.cantidadLikes,
                        "idUser": post.msg.idUser,
                        "liked": post.msg.liked
                    }
                };

                listNoticias.push(objPOst)

                listNoticias.forEach(posteos => {
                    containerNoticia.innerHTML = ``;
                    renderNoticia(posteos, containerNoticia)

                });
            });
        })

}

function renderNoticia(paramPosteos, paramIdHtml) {

    const user = paramPosteos.topic.split('_')[0];
    var like = 'class="far fa-heart" style="cursor: pointer" ';
    var disabled = '';
    if (paramPosteos.msg.liked) {
        like = 'class="fas fa-heart text-success"';
        disabled = 'like-disabled';
    }

    const div = document.createElement('div');
    div.className = "col-4";
    div.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title" align="center">${paramPosteos.msg.titulo} - ${user}</h5>
                <p class="card-text" align="center">${paramPosteos.msg.texto}</p>
                <div class="justify-content-between align-items-center">
                    <div align="left">
                        <a style="color:black!important" class="like ${disabled}" align="center" onclick="like(this, '${paramPosteos.msg.id}','${paramPosteos.msg.cantidadLikes}')">
                            <b>${paramPosteos.msg.cantidadLikes}</b>
                            <i ${like}"></i>
                        </a>
                    </div>
                </div>
                <img class="card-img-top" src="${paramPosteos.msg.imagen}">
            </div>       
        </div>
        `;
    containerNoticia.innerHTML = ``;
    paramIdHtml.appendChild(div);

}
