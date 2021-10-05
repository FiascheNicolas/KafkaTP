const { Kafka } = require("kafkajs") 
const clientId = "node"; 
const brokers = ["localhost:9092"];

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer()

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



const guardarMensaje = async (req, res) => {
    try {
        await producer.connect()
        const msg = JSON.stringify(req.body)

        await producer.send({
            topic:req.body.topic,
            messages: [
                {value:msg},
            ],
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
		const msg = JSON.stringify(nuevoPost)
		await producer.send({
			topic: nuevoPost.topic,
			messages: [
				{ value: msg },
			],
		})

		await producer.disconnect()

	} catch (error) {
		console.error("Error --> " + error);
	}
}


module.exports = {
	follow,
	like,
	guardarMensaje, 
	guardarPost	
};
