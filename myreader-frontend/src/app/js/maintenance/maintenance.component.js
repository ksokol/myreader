'use strict';

require('./about/about.component');
require('./maintenance-actions/maintenance-actions.component');

require('angular').module('myreader').component('myMaintenance', {
    template: require('./maintenance.component.html')
});
