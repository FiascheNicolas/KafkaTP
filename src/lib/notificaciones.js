const consumer = require('../consumer');

module.exports = (io, username) => {
    consumer.consume(io, username).catch((err) => {
        console.error("Error en consumer: ", err)
    });
}