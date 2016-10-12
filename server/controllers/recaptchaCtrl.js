var reCAPTCHA=require('recaptcha2');

module.exports = {

  create: function(req, res) {

    console.log('in recaptchaCtrl');
    console.log('in create');
    console.log('req.body = ', req.body);

    var newRecaptcha = new reCAPTCHA({
      siteKey: '6LeLlicTAAAAAM1lPtaNLtUOKIOxGjsBw600K2_I',
      secretKey: process.env.RECAPTCHA_SECRET_KEY
    });

    newRecaptcha.validateRequest(req)
      .then(function(){
        // validated and secure
        res.json({formSubmit:true});
      })
      .catch(function(errorCodes){
        // invalid
        res.json({
          formSubmit:false,
          errors:newRecaptcha.translateErrors(errorCodes)
          // translate error codes to human readable text
        });
      });
  }
};
