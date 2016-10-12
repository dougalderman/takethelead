var contactsModel = require('./../models/contactsModel.js');

module.exports = {

  create: function(req, res) {

    console.log('in contactsCtrl');
    console.log('in create');
    console.log('req.body = ', req.body);

    var newContacts = new contactsModel(req.body);
    newContacts.save(function(err, result) {
      if (err) {
        return res.status(500).send(err);
      }
      else
        res.send(result);
      });
    }
};
