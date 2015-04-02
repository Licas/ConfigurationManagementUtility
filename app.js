var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var router = express.Router();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.use(session({secret: 'verysecretsession'}));

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Si è verificato un errore.' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  return res.render('error', { error: err });
    
}


// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});
// always invoked
router.use('/',function(req, res, next) {
  res.render('index',{pageTitle:'Dashboard Home'});
  
});


require('./api/sessionHandler')(app);
require('./api/nodeRouter')(app);

app.use(router);

    
app.listen(app.get('port'));
console.log("App listening on port: " + app.get('port'));