(function () {
    'use strict';

    function isString (value) {
        return typeof value === 'string';
    }

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

    var isEmptyString = function (value) {
        if(!value) {
            return true;
        }
        if(!isString(value)) {
            throw new Error('value is not a string');
        }
        return value.length === 0;
    };

    module.exports = {
        'isPromise': isPromise,
        'isEmptyString': isEmptyString
    };

})();
