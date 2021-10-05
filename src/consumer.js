const { Kafka } = require("kafkajs") 
const kafka = new Kafka({ clientId: "node" , brokers: ["localhost:9092"]} );
const {LikeService} = require('./services/LikeService');
const {PostService} = require('./services/PostService');

const consume = async (io, username) =>{
    const consumer = kafka.consumer({ groupId: "node"}); 

    await consumer.connect(); 
    await consumer.subscribe({topic: username + "_notificaciones", fromBeginning: true}); 
    await consumer.run({ 
        autoCommit: true,
        eachMessage: ({message})=>{
            io.emit(username + '_notificacion', `${message.value}`);
        }
    });
}

const traerMensajes = async (req, res) => {
    try {
        const timestamp = Date.now();
        const consumer = kafka.consumer({ groupId: timestamp.toString() })
        await consumer.connect()
        await consumer.subscribe({ topic: req.body.topic, fromBeginning: true })

        let retorno = [];
        
        await consumer.run({
            eachMessage: async ({ message }) => {
                var value = JSON.parse(message.value.toString());

                if(value.msg){
                    const idPost = value.msg.id;
                    const like = await LikeService.getById(idPost, res.locals.user.users.id);
                    const postBuscado = await PostService.getPostById(idPost);

                    value.msg.cantidadLikes = postBuscado.post.cantidadLikes;
                    value.msg.liked = like.length !== 0;
                }
                retorno.push(value);
            },
        });

        setTimeout(() => {
            consumer.disconnect()
            res.send(retorno);
            
        }, 1000)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports = {
consume,
traerMensajes
};