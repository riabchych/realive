module.exports = function (req, res, next){
  return req.isAuthenticated()
    ? next()
    : res.redirect('/login');
};