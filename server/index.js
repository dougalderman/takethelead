require('dotenv').config();

var express = require('express'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// var contactsCtrl = require('./controllers/contactsCtrl.js');
// var recaptchaCtrl = require('./controllers/recaptchaCtrl.js');

var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../dist'));
app.use(expressSession({
    secret: process.env.DMJ_SECRET,
    saveUninitialized: false,
    resave: false
}));


// Endpoints

// Recaptcha
// app.post('/api/recaptcha/', recaptchaCtrl.create); // Verify recaptcha

// Contacts
// app.post('/api/contacts/', contactsCtrl.create); // Create new contact. Contacts collection.

//DB and Server Init
var mongoUri = process.env.DMJ_MONGO_URI,
    port = (process.env.port || process.env.DMJ_PORT);

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
