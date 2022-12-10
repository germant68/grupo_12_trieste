//authentication middleware

function authCarritoMiddleware (req, res, next) {
    if (!req.session.nombre) {
        return res.redirect('/login');
    }
    next ();
}

module.exports = authCarritoMiddleware;
