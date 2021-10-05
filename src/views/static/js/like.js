const url = "http://localhost:8080";

function like(link, id, cantidadLikes){
    fetch(url + '/likePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: parseInt(id)
        })
    })
    .then( res => {
        link.classList.add('like-disabled');
        const icon = link.querySelector('i');
        const cantLikes = link.querySelector('b');
        icon.className = 'fas fa-heart text-success';
        cantLikes.innerText = parseInt(cantidadLikes) + 1;
        console.log(res);
    })
    .catch( err => {
        console.error(err);
    });
}