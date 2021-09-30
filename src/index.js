const produce = require("./producer")
const server = require('./app');

server.listen(process.env.PORT || 8080, ()=>{
    console.log('Escuchando el puerto', process.env.PORT || 8080);
});
process.on('uncaughtException', function (err) {
    console.log(err);
}); 