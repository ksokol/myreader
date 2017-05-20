/* istanbul ignore next */
(function () {
    'use strict';

    /*
     * https://velesin.io/2016/08/23/unit-testing-angular-1-5-components/
     */
    function componentMock(name) {
        function _componentMock($provide) {
            _componentMock.bindings = {};

            $provide.decorator(name + 'Directive', function($delegate) {
                var component = $delegate[0];
                component.template = '';
                component.controller = function () {
                    _componentMock.bindings = this;
                };

                return $delegate;
            });
        }

        return _componentMock;
    }

    function directiveMock(name) {
        function _directiveMock($provide) {
            _directiveMock.scope = {};

            $provide.decorator(name + 'Directive', function($delegate) {
                var directive = $delegate[0];
                directive.template = '';
                directive.controller = function ($scope) {
                    _directiveMock.scope = $scope;
                };
                return $delegate;
            });
        }

        return _directiveMock;
    }

    function mock(name) {
        function _mock($provide) {
            $provide.value(name, {});
        }
        return _mock;
    }

    module.exports = {
        'componentMock': componentMock,
        'directiveMock': directiveMock,
        'mock': mock
    };

})();