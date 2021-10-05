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

//SERVICES--------------------------------------
const {PostService} = require('./services/PostService');
const {SubscripcionService} = require('./services/SubscripcionService');
const {UserService} = require('./services/UserService');
const { LikeService } = require('./services/LikeService');
//---------------------------------------------------
//REGISTRO
var user = require('./routes/user'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

require('./lib/passport');

//MIDDLEWARES------------------------------------------
app.use(express.urlencoded({extended:false}))//para q cuando envien un POST desde un form lo entienda
app.use(express.json());//para q entienda objetos json
app.use(morgan('dev'));
app.use(cors());//para q permita q cualquier servidor pida cosas y haga operaciones
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
//passport
app.use(passport.initialize());
app.use(passport.session());

//SETTINGS---------------------------------------------
app.set('json spaces', 2);
app.set('view engine', 'hbs'); //CAMBIO PUG POR HBS
app.set('views', './src/views');

//VARIABLES GLOBALES-----------------------------------
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    res.locals.user = req.user;
    next();
});

//ROUTES-----------------------------------------------
//USER
app.use(require('./routes/user'));

app.get('/', (req, res) => {
    res.render('index');
});

//HOME
app.get('/home', isLoggedIn, (req, res) => {
    notificacion(io, app.locals.user.users.username);
    res.render('home', { page_title: 'Home', user: app.locals.user.users});
});

app.post('/seguirUsuario', isLoggedIn ,async (req, res) => {
    try{
        const user = app.locals.user.users;
        const followUser = await UserService.getById(req.body.followId);
        followName = followUser.users.dataValues.username;

        // Me fijo si el usuario esta en la lista de seguidos
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
                console.error("Error en producer: ", err);
            });
            res.end();
        } 
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
});

app.post('/likePost', isLoggedIn , async (req, res) => {
    const user = app.locals.user.users;
    const post = await PostService.getPostById(req.body.id);
    console.log("POST --> "+ post.post);

    const userCreadorPost = await UserService.getById(post.post.idUser);
    postTitulo = post.post.titulo;

    // Chequeo si ya se le dio like al post, sino lo agrego.
    const like = await LikeService.getById(post.post.id, user.id);
    if(like.length > 0){
        return res.status(400).send('Ya le diste like a este post');
    }
    await LikeService.add(post.post.id, user.id); //creo el registro para la persistencia del like
    await PostService.udpdateLikesPost(post.post.id, post.post.cantidadLikes + 1); //actualizo la cant. de likes del post

    produce
    .like(userCreadorPost.users.dataValues.username + '_notificaciones', postTitulo, user.username)
    .catch((err) => {
        console.error("Error en producer: ", err);
    });
    res.end();
});

//-------------------------------------
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
    console.log(topics);
    res.json(topics);

    res.end();
});

//-------------------------------------
/** AGREGAR UN NUEVO POST Y GUARDARLO */
app.get('/nuevoPost', isLoggedIn , (req,res)=>{
    return res.render('nuevoPost');
});
app.post('/agregarNuevoPost', isLoggedIn , async (req,res)=>{
    const idUser = app.locals.user.users.username;
    console.log(app.locals.user);
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

    console.log("Nuevo post --> "+ nuevoPostBD.msg);
    await PostService.add(nuevoPostBD.msg); //guardo los datos post en la BD para la persistencia

    const postTotales = await PostService.getAll(); //obtengo todos los posts
    console.log("CANT DE POSTS CREADOS --> "+postTotales.posts.length); //obtengo el id del nuevo post creado

    const nuevoPostKafka = { /** creo un nuevo JSON para usarlo con kafka */
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

    await produce.guardarPost(nuevoPostKafka); //creo el post con kafka 
    res.redirect('/home');
});

//-------------------------------------
/** Buscar usuarios para seguir */
app.get('/buscarUsuarios', isLoggedIn , (req,res)=>{
    return res.render('listarUsuarios');
});
app.post('/buscarUsuarios', isLoggedIn, async(req,res)=>{
    const user = app.locals.user.users;
    const usuariosBuscados = await UserService.findUsersByUsername(req.body.username); //realizo la query
    var usuarios = usuariosBuscados.userFilters;

    
    var seguidos = await SubscripcionService.getAll(user.id);
    seguidos = seguidos.usersSuscriptos;

    // Filtro los usuarios ya seguidos
    usuarios = usuarios.filter((usuario) => {
        return !seguidos.some((s) => s.followName === usuario.username);
    });

    usuarios = usuarios.filter((u)=>{ //nuevo filtro para que no traiga al mismo user que esta logueado
        return u.id !== user.id;
    });
    return res.render('listarUsuarios', {usuarios: usuarios});
});


io.on('connection', (socket) => {
    console.log('a user connected'); 
});

module.exports = server;
