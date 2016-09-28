(function() {
  'use strict';

  function mainCtrl(mainService) {

    var ctrl = this;

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
