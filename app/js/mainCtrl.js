(function() {
  'use strict';

  function mainCtrl(mainService) {

    var ctrl = this;

    var resetCaptcha = function() {
      var newId = 0;
      var len = ctrl.currentRecaptchaId.length;
      var idNum = ctrl.currentRecaptchaId.charAt(len - 1); // return last character
      if ($.isNumeric(idNum)) { // if number
        idNum++;
        newId = ctrl.currentRecaptchaId.slice(0, len - 1) + idNum;
      }
      else {
        idNum = 1;
        newId = ctrl.currentRecaptchaId + idNum;
      }

      // Code alternative to error-producing grecaptcha.reset();
	  // Need to append new element because recaptcha code will check if element has been used before for recaptcha.
	  $('#' + ctrl.currentRecaptchaId).empty(); // empty widget
      $('#' + ctrl.currentRecaptchaId).append('<div id="' + newId + '"></div>'); // set id to newId

      ctrl.currentRecaptchaId = newId; // update currentRecaptchaId

	};

	var recaptchaExpired = function() {
      resetCaptcha();
	};

	var recaptchaCB = function(recaptchaResponse) {
      console.log('in recaptchaCB');
      mainService.verifyRecaptcha({
        'g-recaptcha-response': recaptchaResponse
      })
        .then(function(response) {
          console.log('in verifyRecaptcha valid response');
          console.log('response = ', response);
          if (response.status === 200) { // Good status code
            if (response.data.formSubmit) { // if valid response
              mainService.writeContact(ctrl.contact) // do http POST request to server
                .then(function(resp) {
                  console.log('in writeContact valid response');
                  console.log('resp = ', resp);
                  ctrl.inRecaptcha = false;  // no longer in recaptcha
                  resetCaptcha();
                  if (resp.status === 200) { // Good status code
                    ctrl.contact = {};
                    ctrl.formSuccess = true;
                    ctrl.userMsg = 'Message successfully sent';
                  }
                  else { // Bad status
                    ctrl.formSuccess = false;
                    ctrl.userMsg = 'Problem sending the message.';
				  }
				}, function(er) {
                  console.log('in writeContact error');
                  console.error('er = ', er);
                  ctrl.inRecaptcha = false;  // no longer in recaptcha
                  resetCaptcha();
                  ctrl.formSuccess = false;
                  ctrl.userMsg = 'Problem sending the message.';
                });
            }
		    else { // !response.data.formSubmit
              ctrl.formSuccess = false;
              ctrl.inRecaptcha = false;  // no longer in recaptcha
              resetCaptcha();
              ctrl.userMsg = 'Problem verifying you\'re not a robot.';
            }
          }
		  else { // not good status code (for verifyRecaptcha)
		    ctrl.inRecaptcha = false;  // no longer in recaptcha
            ctrl.formSuccess = false;
            resetCaptcha();
            ctrl.userMsg = 'Problem verifying you\'re not a robot.';
          }
		}, function(err) {
          ctrl.formSuccess = false;
          ctrl.inRecaptcha = false;  // no longer in recaptcha
          console.log('in verifyRecaptcha error');
          console.error('err = ', err);
          resetCaptcha();
          ctrl.userMsg = 'Problem verifying you\'re not a robot.';
        });
	};

	var onLoadCallback = function() {
      grecaptcha.render(ctrl.currentRecaptchaId,
                        {
			             'sitekey' : '6LeLlicTAAAAAM1lPtaNLtUOKIOxGjsBw600K2_I',
			             'callback' : recaptchaCB,
			             'expired-callback': recaptchaExpired
                        }
      );

      if (ctrl.currentRecaptchaId === 'recaptcha-widget') { // only do once for parent div
        var leftMargin = $('#' + ctrl.currentRecaptchaId + ' div').width() * -0.5;

        $('#' + ctrl.currentRecaptchaId).css({'left': '50%', 'margin-left': leftMargin + 'px'});  // Set left of absolutely positioned element to 50%. Set margin left to -0.5 of width. This will center the element.
      }
	};

    $(document).ready(function() {

      ctrl.servicesSlid = false;

      $.localScroll();

      function listener(e) {
        ctrl.servicesSlid = true;
      }

      var e = document.getElementById("services-home");
      e.addEventListener("animationstart", listener, false);

      $('form').submit(function(){
        var required = $('[required="true"]'); // change to [required] if not using true option as part of the attribute as it is not really needed.
        var error = false;

        for (var i = 0; i <= (required.length - 1);i++) {
          if(required[i].value == '') { // tests that each required value does not equal blank, you could put in more stringent checks here if you wish.
            required[i].style.backgroundColor = 'rgb(255,155,155)';
            error = true; // if any inputs fail validation then the error variable will be set to true;
          }
        }

        if(error) // if error is true;
        {
          return false; // stop the form from being submitted.
        }
      });
    });

    ctrl.contact = {};
	ctrl.userMsg = '';
    ctrl.emailMatchError = false;
	ctrl.formSuccess = false;
	ctrl.inRecaptcha = false;
	ctrl.currentRecaptchaId = 'recaptcha-widget';
	ctrl.mobileNavbarSelected = false;

    ctrl.activateMobileNavbar = function() {
      if (ctrl.mobileNavbarSelected === false)
        ctrl.mobileNavbarSelected = true;
      else // if Navbar is already active
        ctrl.mobileNavbarSelected = false;
	};

	ctrl.deactivateMobileNavbar = function() {
		ctrl.mobileNavbarSelected = false;
	};

    ctrl.contactForm = function() {
      console.log('in contact form');
      console.log('ctrl.contact', ctrl.contact);
      if (ctrl.contact.email === ctrl.contact.emailAgain) {
        ctrl.userMsg = '';
        ctrl.inRecaptcha = true;
        ctrl.emailMatchError = false;
        ctrl.formSuccess = false;
        ctrl.userMsg = 'Please confirm that you\'re not a robot';
			onLoadCallback(); // Call recaptcha
      }
      else {
        ctrl.emailMatchError = true;
        ctrl.formSuccess = false;
        ctrl.userMsg = 'There was a problem with this form';
      }
    };
  }

  angular .module('takeTheLead')
          .controller('mainCtrl', ['mainService', mainCtrl]);

}());
