export default class SafeOpenerService {

    constructor($window) {
        'ngInject';
        this.$window = $window;
    }

    openSafely(url) {
        const otherWindow = this.$window.open();
        otherWindow.opener = null;
        otherWindow.location = url;
    }
}
