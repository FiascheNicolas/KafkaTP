//Verifica el acceso a las rutas
//Exporta un objeto que tiene un metodo para saber si el usuario está loggeado o no. 
module.exports = {
    //recibe req, res, next 
    //Al inicializar passport, en el req cuando estamos recibiendo los datos del usuario,
    //llena el objeto req de nuevos metodos, tales como logOut, isAuthenticated
    //el cual devuelve true si la sesión del usuario existe
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) { //si existe la sesión, continuamos con el resto del código
            return next();
        }
        return res.render('login', { page_title: 'Login' });
        //en caso contrario, si no tiene sesión lo redirecciona a login
    },

    //para evitar algunas rutas cuando está autenticado, por ejemplo para que no vea el registro y el login.
    isNotLoggedIn (req, res, next) {
        if (!req.isAuthenticated()) { //si el usuario no está autenticado.
            return next();
        }
        return res.render('home', { page_title: 'Inicio' });
    }
};