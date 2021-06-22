var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var contactsSchema = new Schema({
  name: {type: 'String', required: true, lowercase: true},
  phone: {type: 'String'},
  email: {type: 'String', required: true, lowercase: true},
  subject: {type: 'String'},
  message: {type: 'String', required: true},
  dateSent: {type: 'Date', default: Date.now}
});

module.exports =  mongoose.model('Contacts', contactsSchema);
