module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) { 
            return next();
        }
        return res.render('login', { page_title: 'Login' });
        
    },
    isNotLoggedIn (req, res, next) {
        if (!req.isAuthenticated()) { 
            return next();
        }
        return res.render('home', { page_title: 'Inicio' });
    }
};