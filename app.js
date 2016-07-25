var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//引入数据库模块
var db = require('./database');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

//app.use('/', routes);
//app.use('/users', users);

app.get('/',function(req,res){
	res.sendFile('app/index.html');
});
app.get('/getScore',function(req,res){
	//console.log("hello");
	db.getScore(function(data){
		res.send(data);
	})
})
app.post('/register',function(req,res){
	db.register(req.body.userName,req.body.password,function(flag){
		if(flag){
			res.send({status:true});
		}else{
			res.send({status:false});
		}
	})
});
app.post('/login',function(req,res){
	db.login(req.body.name,req.body.password,function(data){
		res.send(data);
	})
});
app.post('/addScore',function(req,res){
	//console.log(req.body);
	db.addScore(req.body,function(flag){
		res.send(flag);
	});
});
app.post('/modifyScore',function(req,res){
	db.modifyScore(req.body,function(flag){
		res.send(flag);
	})
}); 

app.post('/deleteScore',function(req,res){
	db.deleteScore(req.body,function(flag){
		res.send(flag);
	})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
