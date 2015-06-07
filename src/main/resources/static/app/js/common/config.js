window.write = function() {};

angular.module('myreader', ['common.services', 'common.controllers', 'common.directives', 'ui.router', 'ct.ui.router.extras.previous', 'ngMaterial', 'LocalStorageModule', 'ngSanitize'])

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

                views: {
                    body: {
                        templateUrl: 'SubscriptionTags',
                        controller: 'SubscriptionNavigationCtrl'
                    }
                }
            })
            .state('app.entries-tags', {
                url: "/tag/entries/:tag",

                views: {
                    content: {
                        templateUrl: 'SubscriptionEntries',
                        controller: 'SubscriptionEntryListCtrl'
                    },
                    actions: {
                        templateUrl: 'SubscriptionEntriesActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.entries-tag-subscription', {
                url: "/tag/entries/:tag/:uuid",

                views: {
                    content: {
                        templateUrl: 'SubscriptionEntries',
                        controller: 'SubscriptionEntryListCtrl'

                    },
                    actions: {
                        templateUrl: 'SubscriptionEntriesActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.entries-subscription', {
                url: "/subscription/entries/:uuid",
                controller: 'SubscriptionEntryListCtrl',
                views: {
                    content: {
                        templateUrl: 'SubscriptionEntries',
                        controller: 'SubscriptionEntryListCtrl'
                    },
                    actions: {
                        templateUrl: 'SubscriptionEntriesActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.entry', {
                url: "/entry/:uuid",
                views: {
                    content: {
                        templateUrl: 'SubscriptionEntry',
                        controller: 'SubscriptionEntryCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/tag/entries/all');
}])

.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('myreader').setStorageType('sessionStorage');
}]);
