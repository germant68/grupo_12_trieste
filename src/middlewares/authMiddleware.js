//authentication middleware

function authMiddleware (req, res, next) {
    if (!req.session.nombre == 'Admin') {
        return res.redirect('/login');
    }
    next ();
}

module.exports = authMiddleware;
