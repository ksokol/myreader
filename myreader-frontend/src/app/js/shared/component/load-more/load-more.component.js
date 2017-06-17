(function () {
    'use strict';

    function LoadMoreComponent() {
        var ctrl = this;

        ctrl.$onChanges = function (obj) {
            ctrl.disabled = false;
            ctrl.next = obj.myNext.currentValue;
        };

        ctrl.onClick = function () {
            ctrl.disabled = true;
            ctrl.myOnMore({more: ctrl.next});
        };
    }

    require('angular').module('myreader').component('myLoadMore', {
        template: require('./load-more.component.html'),
        controller: LoadMoreComponent,
        bindings: {
            myNext: '<',
            myOnMore: '&'
        }
    });

})();
