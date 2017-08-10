module.exports = function(express, app, passport, config, rooms){
  var router= express.Router();

  router.get('/', function(req, res, next){
    res.render('index', {title: "WelcomeSakiChat"});
  });
  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    sucessRedirect: '/chatrooms',
    failureRedirect: '/'
  }))

  router.get('/chatrooms', function(req, res, next){
     res.render('chatrooms', {title: "ChatRoomsSaki", user: req.user});
   });
   router.get('/setcolor', function(req, res, next) {
     req.session.favColor="Red";
     res.send('Setting Favourite Color !');
   });
   router.get('/getcolor', function(req, res, next){
     res.send('Favourite Color: ' + (req.session.favColor===undefined? "Not Found": req.session.favColor))
   })

   app.use('/', router);
}
