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

function filterMock(name) {
    function _filterMock($provide) {
        var filter = jasmine.createSpy(name + 'Filter');
        filter.and.callFake(function (value) {
            if (typeof value === 'object') {
                // remove Angular specific attributes
                delete value.$$hashKey;
                delete value.object;
            }
            return name + '(' + JSON.stringify(value) + ')';
        });
        $provide.value(name + 'Filter', filter);
    }

    return _filterMock;
}

function mock(name) {
    function _mock($provide) {
        $provide.value(name, {});
    }
    return _mock;
}

function ngReduxMock() {
    let _store = {};
    const mock = jasmine.createSpyObj('$ngRedux', ['dispatch', 'connect']);
    mock.onConnect = {};
    mock.stateChange = values => Object.assign(_store, values);
    mock.connect.and.returnValue(store => {
        _store = store;
        Object.assign(_store, mock.onConnect);
        return () => {return {unsubscribe: () => {}}}
    });
    return mock;
}

function mockNgRedux() {
    function _mock($provide) {
        $provide.value('$ngRedux', ngReduxMock());
    }
    return _mock;
}

function spy(name) {
    function _spy($provide) {
        $provide.decorator(name, ['$delegate', function ($delegate) {
                return jasmine.createSpy($delegate);
            }
        ]);
    }
    return _spy;
}

module.exports = {
    'componentMock': componentMock,
    'directiveMock': directiveMock,
    'filterMock': filterMock,
    'mock': mock,
    'spy': spy,
    'mockNgRedux': mockNgRedux,
    'ngReduxMock': ngReduxMock
};
