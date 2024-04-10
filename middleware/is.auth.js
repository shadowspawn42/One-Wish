module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn){
        return res.render('index', { title: 'Login', errorMessage: 'You need to be logged in to acess that page.', loginCreated: false})
    }
    next();
};