require('dotenv').config();

var express = require('express'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var contactsCtrl = require('./controllers/contactsCtrl.js');
var recaptchaCtrl = require('./controllers/recaptchaCtrl.js');

var app = express();

var app_dir = process.env.TTL_APP_DIR;
console.log('app_dir = ' + app_dir);

app.use(bodyParser.json());

app.use(express.static(__dirname + process.env.TTL_APP_DIR));
app.use(expressSession({
    secret: process.env.TTL_SECRET,
    saveUninitialized: false,
    resave: false
}));


// Endpoints

// Recaptcha
app.post('/api/recaptcha/', recaptchaCtrl.create); // Verify recaptcha

// Contacts
app.post('/api/contacts/', contactsCtrl.create); // Create new contact. Contacts collection.

//DB and Server Init
var mongoUriPrefix = process.env.TTL_MONGO_URI_PREFIX,
    mongoUriDBUser = process.env.TTL_MONGO_DBUSER,
    mongoUriDBPw = process.env.TTL_MONGO_DBPW,
    mongoUriDbSuffix = process.env.TTL_MONGO_URI_SUFFIX,
    port = (process.env.port || process.env.TTL_PORT);

var mongoUri = mongoUriPrefix + encodeURIComponent(mongoUriDBUser) +
    ':' + encodeURIComponent(mongoUriDBPw) + mongoUriDbSuffix;

console.log('mongoUri: ', mongoUri);

mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection
  .on('error', console.error.bind(console, 'Connection Error: '))
  .once('open', function() {
    console.log('Connected to MongoDB at', mongoUri.slice(mongoUri.indexOf('@')+1, mongoUri.length));
    app.listen(port, function() {
      console.log('Listening on port ' + port);
    });
  });
  