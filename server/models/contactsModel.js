var mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  sparkPostTransport = require('nodemailer-sparkpost-transport'),
  Schema = mongoose.Schema;

var contactsSchema = new Schema({
  name: {type: 'String', required: true, lowercase: true},
  phone: {type: 'String'},
  email: {type: 'String', required: true, lowercase: true},
  subject: {type: 'String', required: true},
  message: {type: 'String', required: true},
  dateSent: {type: 'Date', default: Date.now}
});


contactsSchema.post('save', function(contact){
  console.log('SENDING EMAIL');
  var transporter = nodemailer.createTransport(sparkPostTransport({
    "content": {
      "template_id": "dougaldermancom-contact-form"
    },
    "substitution_data": {
      "contactName": contact.name,
      "contactPhone": contact.phone,
      "contactEmail": contact.email,
     // "contactSubject": contact.subject,
      "contactMessage": contact.message
    }
  }));
  transporter.sendMail({
    "recipients": [
      {
        "address":
        {
          "email": process.env.SPARKPOST_RECIPIENT_EMAIL
        }
      }
    ]
  }, function(e, info) {
    if (e) { console.log('EMAIL ERROR: ', e); }
    else { console.log('EMAIL SENT: ', info); }
  });
});

module.exports =  mongoose.model('Contacts', contactsSchema);
