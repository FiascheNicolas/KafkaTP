const produce = require("./producer")
const server = require('./app');

server.listen(process.env.PORT || 8080, ()=>{
    console.log('Puerto', process.env.PORT || 8080);
});