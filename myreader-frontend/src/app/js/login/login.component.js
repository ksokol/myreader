(function () {
    'use strict';

    function LoginComponent($http, $state) {
        var ctrl = this;

        ctrl.onClick = function () {
            ctrl.actionPending = true;
            var encodedBody = 'username=' + encodeURIComponent(ctrl.username) +
                              '&password=' + encodeURIComponent(ctrl.password) +
                              '&remember-me=' + ctrl.rememberMe;

            return $http({
                method: 'POST',
                url: 'check',
                data: encodedBody,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        };

        ctrl.onSuccess = function (response) {
            var authorities = response.headers('X-MY-AUTHORITIES');
            if(authorities !== null && authorities.indexOf('ROLE_ADMIN') !== -1) {
                $state.go('admin.overview');
            } else {
                $state.go('app.entries');
            }
        };

        ctrl.onError = function (error) {
            ctrl.actionPending = false;
            ctrl.message = { type: 'error', message: 'Username or password wrong' };
        };

        ctrl.css = require('./login.component.css');
    }

    require('angular').module('myreader').component('myLogin', {
        template: require('./login.component.html'),
        controller: ['$http', '$state', LoginComponent]
    });

})();
