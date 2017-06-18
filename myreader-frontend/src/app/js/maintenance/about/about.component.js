(function () {
    'use strict';

    require('./about.service');
    require('../../shared/timeago/timeago.filter');

    function AboutComponent(aboutService) {
        var ctrl = this;
        ctrl.loading = true;

        ctrl.$onInit = function () {
            aboutService.getProperties().then(function(properties) {
                ctrl.properties = properties;
            }).catch(function () {
                ctrl.propertiesMissing = true;
            }).finally(function () {
                ctrl.loading = false;
            });
        };
    }

    require('angular').module('myreader').component('myAbout', {
        template: require('./about.component.html'),
        controller: ['aboutService', AboutComponent]
    });

})();
