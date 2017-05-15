(function () {
    'use strict';

    function isDefined(value) {
        return typeof value !== 'undefined';
    }

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    var isPromise = function (value) {
        if (!isDefined(value)) {
            return false;
        }

        return !!(isObject(value)
        && isFunction(value.then)
        && isFunction(value.catch)
        && isFunction(value.finally));
    };

    module.exports = {
        'isPromise': isPromise
    };

})();
