angular.module('myreader', ['common.services', 'common.controllers', 'common.directives', 'ui.router', 'ct.ui.router.extras.previous', 'ngMaterial', 'LocalStorageModule'])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$window', '$rootScope', function($q, $window, $rootScope) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401) {
                    $window.location.reload();
                }
                if(rejection.status >= 500) {
                    if(typeof rejection.data === 'string') {
                        $rootScope.$broadcast('error', rejection.data);
                    } else {
                        $rootScope.$broadcast('error', rejection.data.message);
                    }
                }

                return $q.reject(rejection);
            }
        };
    }]);

    $httpProvider.interceptors.push(['$q', function ($q) {
        return {
            'request': function (config) {
                config.headers["X-Requested-With"] = "XMLHttpRequest";
                return config || $q.when(config);
            }
        };
    }]);

    $httpProvider.interceptors.push(['$q', '$rootScope', function($q, $rootScope) {
        return {
            'request': function(config) {
                $rootScope.$broadcast('loading-started');
                return config || $q.when(config);
            },
            'response': function(response) {
                $rootScope.$broadcast('loading-complete');
                return response || $q.when(response);
            }
        };
    }]);
}])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                abstract: true,
                url: "/app",
                templateUrl: 'SubscriptionTags',
                controller: 'SubscriptionNavigationCtrl'
            })
            .state('app.entries-tags', {
                url: "/tag/entries/:tag",
                templateUrl: 'SubscriptionEntries',
                controller: 'SubscriptionEntryListCtrl'
            })
            .state('app.entries-tag-subscription', {
                url: "/tag/entries/:tag/:uuid",
                templateUrl: 'SubscriptionEntries',
                controller: 'SubscriptionEntryListCtrl'
            })
            .state('app.entries-subscription', {
                url: "/subscription/entries/:uuid",
                templateUrl: 'SubscriptionEntries',
                controller: 'SubscriptionEntryListCtrl'
            })
            .state('app.entry', {
                url: "/entry/:uuid",
                templateUrl: 'SubscriptionEntry',
                controller: 'SubscriptionEntryCtrl'
            });
        $urlRouterProvider.otherwise('/app/tag/entries/all');
}])

.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('myreader').setStorageType('sessionStorage');
}]);
