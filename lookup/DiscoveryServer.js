var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var app = express();
var router = express.Router();

var config = require(__dirname + '/../conf/discovery.js');


app.set('port', (config.port || 6002));

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


require('./router/discoveryRouter.js')(app);

app.use(router);
    
app.listen(app.get('port'));


function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '127.0.0.1';
}

config.ip = getIPAddress();

console.log("process ip : " + config.ip);
console.log("process pid : " + process.pid);
console.log("Discovery agent listening on port: " + app.get('port'));