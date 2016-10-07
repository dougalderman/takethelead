(function() {
  'use strict';

  function mainService($http) {

    this.writeContact = function(data) {
      return $http({
        method: 'POST',
        url: '/api/contacts',
        data: data
      });
    };

	this.verifyRecaptcha = function(data) {
      return $http({
        method: 'POST',
        url: '/api/recaptcha',
        data: data
      });
    };
  }

  angular .module('takeTheLead')
          .service('mainService', ['$http', mainService]);

}());
