var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var app = express();
var router = express.Router();

var config = require(__dirname + '/../conf/workeragent.js');


app.set('port', (config.port || 6003));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


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


require('./router/workerAgentRouter.js')(app);

app.use(router);

    
app.listen(app.get('port'));
console.log("Worker agent listening on port: " + app.get('port'));