module.exports = function(express, app, passport, config, rooms){
  var router= express.Router();

  router.get('/', function(req, res, next){
    res.render('index', {title: "WelcomeSakiChat"});
  });

    function securePages(req, res, next){
      if(req.isAuthenticated()){
        next();
      }
      else{
        res.redirect('/');
      }
    }
  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    sucessRedirect: '/chatrooms',
    failureRedirect: '/'
  }))

  router.get('/chatrooms', securePages, function(req, res, next){
     res.render('chatrooms', {title: "ChatRoomsSaki", user: req.user});
   });
   router.get('/logout', function(req, res, next){
     req.logout();
     res.redirect('/');
   })

   app.use('/', router);
}
