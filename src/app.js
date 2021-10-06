const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const notificacion = require('./lib/notificaciones');
const { isLoggedIn, isNotLoggedIn } = require('./lib/auth');
const hbs = require('express-handlebars');

const consume = require("./consumer");
const produce = require('./producer');


const {PostService} = require('./services/PostService');
const {SubscripcionService} = require('./services/SubscripcionService');
const {UserService} = require('./services/UserService');
const { LikeService } = require('./services/LikeService');


var user = require('./routes/user'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

require('./lib/passport');

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, './views/static')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'DistribuidosTp2',
    resave : true,
    saveUninitialized: true,
}));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());


app.set('json spaces', 2);
app.set('view engine', 'hbs'); 
app.set('views', './src/views');


app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    res.locals.user = req.user;
    next();
});



app.use(require('./routes/user'));

app.get('/', (req, res) => {
    res.render('index');
});


app.get('/home', isLoggedIn, (req, res) => {
    notificacion(io, app.locals.user.users.username);
    res.render('home', { page_title: 'Home', user: app.locals.user.users});
});



app.post('/likePost', isLoggedIn , async (req, res) => {
    const user = app.locals.user.users;
    const post = await PostService.getPostById(req.body.id);

    const userCreadorPost = await UserService.getById(post.post.idUser);
    postTitulo = post.post.titulo;

    
    const like = await LikeService.getById(post.post.id, user.id);
    if(like.length > 0){
        return res.status(400).send('Ya le diste like a este post');
    }
    await LikeService.add(post.post.id, user.id); 
    await PostService.udpdateLikesPost(post.post.id, post.post.cantidadLikes + 1); 

    produce
    .like(userCreadorPost.users.dataValues.username + '_notificaciones', postTitulo, user.username)
    .catch((err) => {
        console.error("Error en producer: ", err);
    });
    res.end();
});


app.get('/noticias', isLoggedIn , (req, res) => {
    res.render('noticias');
});

app.post('/guardarMensaje', isLoggedIn , produce.guardarMensaje);
app.post('/noticias/traerMensajes',  isLoggedIn , consume.traerMensajes);

app.get('/noticias/traerTopics', isLoggedIn ,async (req, res) => {
    const idUser = app.locals.user.users.id;
    const subscripciones = await SubscripcionService.getAll(idUser);
    
    var topics = [];
    subscripciones.usersSuscriptos.forEach(user => {
        topics.push(user.followName);
    })
    res.json(topics);

    res.end();
});

app.get('/buscarUsuarios', isLoggedIn , (req,res)=>{
    return res.render('listarUsuarios');
});
app.post('/buscarUsuarios', isLoggedIn, async(req,res)=>{
    const user = app.locals.user.users;
    const usuariosBuscados = await UserService.findUsersByUsername(req.body.username); 
    var usuarios = usuariosBuscados.userFilters;

    
    var seguidos = await SubscripcionService.getAll(user.id);
    seguidos = seguidos.usersSuscriptos;

    usuarios = usuarios.filter((usuario) => {
        return !seguidos.some((s) => s.followName === usuario.username);
    });

    usuarios = usuarios.filter((u)=>{ 
        return u.id !== user.id;
    });
    return res.render('listarUsuarios', {usuarios: usuarios});
});


app.get('/nuevoPost', isLoggedIn , (req,res)=>{
    return res.render('nuevoPost');
});
app.post('/agregarNuevoPost', isLoggedIn , async (req,res)=>{
    const idUser = app.locals.user.users.username;
    const nuevoPostBD = {
        "topic" : idUser + '_posts', 
        "msg": {
            "titulo" : req.body.titulo,
            "imagen" : req.body.imagen,
            "texto" : req.body.texto,
            "cantidadLikes": 0,
            "idUser" : app.locals.user.users.id
        }
    }

    await PostService.add(nuevoPostBD.msg); 

    const postTotales = await PostService.getAll(); 

    const nuevoPostKafka = { 
        "topic" : idUser + '_posts', 
        "msg": {
            "id" : postTotales.posts.length,
            "titulo" : req.body.titulo,
            "imagen" : req.body.imagen,
            "texto" : req.body.texto,
            "cantidadLikes": 0,
            "idUser" : app.locals.user.users.id
        }
    }

    await produce.guardarPost(nuevoPostKafka); 
    res.redirect('/home');
});

app.post('/seguirUsuario', isLoggedIn ,async (req, res) => {
    try{
        const user = app.locals.user.users;
        const followUser = await UserService.getById(req.body.followId);
        followName = followUser.users.dataValues.username;

        
        const seguidos = await SubscripcionService.getAll(user.id);
        const followExists = seguidos.usersSuscriptos.filter((s) => s.followName === followName);

        if(followExists.length > 0){
            return res.status(400).send('Ya seguis a ese usuario');
        }
        else{
            await SubscripcionService.add(followName, user.id);
            
            produce
            .follow(followName + '_notificaciones', user.username)
            .catch((err) => {
                console.error("Error: ", err);
            });
            res.end();
        } 
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
});



io.on('connection', (socket) => {
    console.log('user connected'); 
});

module.exports = server;
