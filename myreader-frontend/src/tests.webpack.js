// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

var angular = require('angular');
var context = require.context('./app/js', true, /\.js$/);
require('angular-mocks');

context.keys().forEach(context);
