window.write = function() {};

var angular = require('angular');

angular.module('myreader', ['ngSanitize', 'common.services', 'common.controllers', 'common.directives', 'ui.router', 'ngMaterial', 'ngMessages', 'cfp.hotkeys'])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', function($q, $rootScope, $injector) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401) {
                    var $state = $injector.get('$state');
                    $rootScope.$emit('refresh');
                    $state.go('login');
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
                return $q.when(config);
            },
            'response': function(response) {
                $rootScope.$broadcast('loading-complete');
                return $q.when(response);
            },
            'responseError': function(response) {
                $rootScope.$broadcast('loading-complete');
                return $q.reject(response);
            }
        };
    }]);
}])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    body: {
                        template: '<my-login flex></my-login>'
                    }
                }
            })
            .state('app', {
                abstract: true,
                url: "/app",
                views: {
                    body: {
                        template: require('../../templates/subscription-tags.html'),
                        controller: 'SubscriptionNavigationCtrl'
                    }
                }
            })
            .state('admin', {
                abstract: true,
                url: "/admin",
                views: {
                    body: {
                        template: require('../../templates/navigation-admin.html'),
                        controller: 'SubscriptionNavigationCtrl'
                    }
                }
            })
            .state('app.entries', {
                url: "/entries/:tag/:uuid",
                views: {
                    content: {
                        template: require('../../templates/subscription-entries.html'),
                        controller: 'SubscriptionEntryListCtrl'
                    }
                }
            })
            .state('app.bookmarks', {
                url: "/bookmark/:tag",
                views: {
                    content: {
                        template: require('../../templates/bookmark-entries.html'),
                        controller: 'BookmarkEntryListCtrl'
                    }
                }
            })
            .state('app.subscriptions', {
                url: "/subscriptions",
                views: {
                    content: {
                        template: require('../../templates/subscriptions.html'),
                        controller: 'SubscriptionsCtrl'
                    }
                }
            })
            .state('app.subscription-add', {
                url: "/subscriptions/add",
                views: {
                    content: {
                        template: '<div><my-subscribe></my-subscribe></div>'
                    }
                }
            })
            .state('app.subscription', {
                url: "/subscriptions/:uuid",
                views: {
                    content: {
                        template: '<div><my-subscription></my-subscription></div>'
                    }
                }
            })
            .state('admin.overview', {
                url: "/overview",
                views: {
                    content: {
                        template: require('../../templates/admin.html'),
                        controller: 'AdminCtrl'
                    }
                }
            })
            .state('admin.feed', {
                url: "/feed",
                views: {
                    content: {
                        template: require('../../templates/feeds.html'),
                        controller: 'FeedsCtrl'
                    }
                }
            })
            .state('admin.feed-detail', {
                url: "/feed/:uuid",
                views: {
                    content: {
                        template: require('../../templates/feed-detail.html'),
                        controller: 'FeedDetailCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    content: {
                        template: require('../../templates/settings.html'),
                        controller: 'SettingsCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/entries//');
}])

.config(['hotkeysProvider', function(hotkeysProvider) {
    hotkeysProvider.includeCheatSheet = false;
    hotkeysProvider.useNgRoute = false;
}]);

