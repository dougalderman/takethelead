(function() {
  'use strict';

  function mainCtrl($scope, mainService) {

    var ctrl = this;

    $scope.test = "Tina Alderman";

    ctrl.test2 = "Doug Sanders Alderman";
  }

  angular .module('takeTheLead')
          .controller('mainCtrl', ['$scope','mainService', mainCtrl]);

}());
