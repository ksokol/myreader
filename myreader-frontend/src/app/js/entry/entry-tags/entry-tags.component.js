(function () {
    'use strict';

    function EntryTagsComponent () {
        var ctrl = this;

        ctrl.$onInit = function () {
          ctrl.tags = ctrl.myItem.tag ? ctrl.myItem.tag.split(/[ ,]+/) : [];
        };

        ctrl.onTagChange = function () {
            ctrl.myOnChange({tag: ctrl.tags.join(", ")});
        }
    }

    require('angular').module('myreader').component('myEntryTags', {
        template: require('./entry.tags.component.html'),
        controller: EntryTagsComponent,
        bindings: {
            myItem: '<',
            myShow: '<',
            myOnChange: '&'
        }
    });

    module.exports = 'myreader.entry.entry-tags.component';

})();
