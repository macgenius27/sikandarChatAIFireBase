module.exports= function(passport, FacebookStrategy, config, mongoose){

  var chatUser= new mongoose.Schema({
    profileID: String,
    fullname: String,
    profilePic: String
  })
var userModel= mongoose.model('chatuser', chatUser);
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    usermodel.findById(id, function(err, user){
      done(err,user);
    })
  })
  passport.use(new FacebookStrategy({
    clientID: config.fb.appID,
    clientSeceret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    profileField: ['id', 'displayName', 'photo']
  }, function(accessToken, refreshToken, profile, done){
    //Check if the user exists in our Mongo DB
    //if not, create one and return the profileField
    userModel.findOne({'profileID': profile.id}, function(err, result){
      if(result){
        done(null, result);
      }
      else{
        //create new user in mongooes lab
        var newChatUser= new userModel(
          {
            profileID: profile.id,
            fullname: profile.displayName,
            profilePic: profile.photo[0].value || ''
          }
        );
        newChaUser.save(function(err){
          done(null, newChatUser);
        })
      }
    })

  }
))
}
