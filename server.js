// Node.js Dependencies
const http = require("http");
const path = require("path");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var express = require('express')
  , cors = require('cors')
  , app = express();
var $ = require('jquery');

var router = {
    index: require("./routes/index"),
    about: require("./routes/about"),
    download: require("./routes/download"),
    contact: require("./routes/contact")
};

var corsOptions = {
  origin: 'https://instagram.com/p/BLA29O8DHD2/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var parser = {
    body: require("body-parser")
};

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 3000, {auto_reconnect: true});
var db = new Db('exampleDb', server);

db.open(function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}



// Middleware
app.set("port", process.env.PORT || 3000);
app.engine("html", handlebars());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.body.urlencoded({ extended: false }));
app.use(parser.body.json());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(cors());



// Add headers

// Routes
app.get("/", router.index.view);

// POST method route
app.get('/contact', router.contact.view);
app.get('/about', router.about.view);

app.get('/download', router.download.view);




app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}


// Start Server
http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
