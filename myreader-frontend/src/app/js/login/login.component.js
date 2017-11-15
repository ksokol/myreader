import template from './login.component.html';
import css from './login.component.css';

class controller {

    constructor($http, $state) {
        'ngInject';
        this.$http = $http;
        this.$state = $state;
    }

    onClick() {
        this.actionPending = true;
        const encodedBody = 'username=' + encodeURIComponent(this.username) +
                          '&password=' + encodeURIComponent(this.password) +
                          '&remember-me=' + this.rememberMe;

        return this.$http({
            method: 'POST',
            url: 'check',
            data: encodedBody,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    onSuccess(response) {
        const authorities = response.headers('X-MY-AUTHORITIES');
        if(authorities !== null && authorities.indexOf('ROLE_ADMIN') !== -1) {
            this.$state.go('admin.overview');
        } else {
            this.$state.go('app.entries');
        }
    }

    onError(error) {
        this.actionPending = false;
        this.message = {type: 'error', message: 'Username or password wrong'};
    }
}

export const LoginComponent = {
    template, css, controller
};
