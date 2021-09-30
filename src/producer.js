const { Kafka } = require("kafkajs") //dependencia para usar kafka con node
const clientId = "node"; /** client ID le hace saber a kafka quien produce los mensajes */
const brokers = ["localhost:9092"]; /** host  */

const kafka = new Kafka({ clientId, brokers }); /** initialize a new kafka client and initialize a producer from it */
const producer = kafka.producer()

/** esta funcion asincrona va a generar un msg cada 15 segundos **/
const follow = async (topic, name) => {
	try{
		await producer.connect();
		await producer.send({
			topic: topic,
			messages: [{ 
				value: JSON.stringify({ type: 'FOLLOW', name: name })
			}]
		});
	} catch(err){
		console.error(err);
	}
}

const like = async (topic, post, name) => {
	try{
		await producer.connect();
		await producer.send({
			topic: topic,
			messages: [{ 
				value: JSON.stringify({ type: 'LIKE', post: post, name: name }) 
			}]
		});
	} catch(err){
		console.error(err);
	}
}

//--------------------------------
//Post de una noticia /posteo enviado a traves de json con el topico y el msj que lo toma del request.
const guardarMensaje = async (req, res) => {
    try {
        await producer.connect()
        console.log("guardo el nuevo msj")
        console.log(req.body)
        console.log("guardo el req.body en la constante msg con el json.stringfy")
        const msg = JSON.stringify(req.body)
        console.log("guardo el nuevo msj despues de hacerlo un json", msg)
        console.log("este es el req body topic:", req.body.topic)

        await producer.send({
            topic:req.body.topic,
            messages: [
                {value:msg},
            ],
            /*topic: 'topic-name',
            messages: [
                { key: 'key1', value: 'hello world' },
                { key: 'key2', value: 'hey hey!' }
            ],*/
        })
        await producer.disconnect()
        res.send('mensaje guardado');
    } catch (error) {
        console.log(error);
        res.send("error")
    }
}

const guardarPost = async (nuevoPost) => {
	await producer.connect();

	try {
		console.log("guardo el nuevo post: ")
		console.log(nuevoPost)

		const msg = JSON.stringify(nuevoPost)
		console.log("guardo el nuevo msj despues de hacerlo un json", msg)
		console.log("este es el req body topic:", nuevoPost.topic)

		await producer.send({
			topic: nuevoPost.topic,
			messages: [
				{ value: msg },
			],
		})

		await producer.disconnect()
		console.log('Post guardado con exito!!!');

	} catch (error) {
		console.error("Error --> " + error);
	}
}

//--------------------------------
module.exports = {
	follow,
	like,
	guardarMensaje, 
	guardarPost	
};
