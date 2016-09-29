(function() {
  'use strict';

  function mainCtrl(mainService) {

    var ctrl = this;

    $(document).ready(function() {

      $.localScroll();

      var leftMargin = $('.pic-text h1').width() * -0.5;

      $('.pic-text h1').css({'left': '50%', 'margin-left': leftMargin + 'px'});  // Set left of absolutely positioned element to 50%. Set margin left to -0.5 of width. This will center the element.
  	});

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
  }

  angular .module('takeTheLead')
          .controller('mainCtrl', ['mainService', mainCtrl]);

}());
