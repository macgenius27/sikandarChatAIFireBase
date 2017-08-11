var express= require('express');
var app = express();
var path= require('path');
var cookieParser= require('cookie-parser');
var session= require('express-session');
var config= require('./config/config.js');
var ConnectMongo= require('connect-mongo')(session);
var mongoose= require('mongoose').connect(config.dbURL);
var passport= require('passport')
var FacebookStrategy= require('passport-facebook').Strategy
var rooms=[];
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if( env === 'development'){
  app.use(session({secret: config.sessionSecret}))
}
else{
  console.log("Inside Making Mongodb Connection");
  app.use(session({
    secret: config.sessionSecret,
    store: new ConnectMongo({
      //url:config.dbURL,
      mongooseConnection: mongoose.connections[0],
      stringify: true
    })
  }))
}

app.use(passport.initialize());
app.use(passport.session());

/*  username: String,
  password: String,
  fullname: String
});
var Person = mongoose.model('user', userSchema);
var John= new Person({
  username: 'sik',
  password: 'password123',
  fullname: 'Sikandar'
});

John.save(function(err){
  console.log('Done!');
});*/
//app.use(session({secret:'SikandarCanTalk', saveUninitialized: true, resave: true}))
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose)
require('./routes/routes.js')(express, app, passport)

/*
app.route('/').get(function(req, res, next){
  //res.send("<h1>HelloWorld<h1>");
  res.render('index', {title: "Welcome to Chat App"});
});
*/
app.set('port',process.env.PORT|| 3000);
var server= require('http').createServer(app);
var io= require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('ChatSikandar on Port '+ app.get('port'));
})
