window.write = function() {};

var angular = require('angular');

angular.module('myreader', ['common.filters', 'common.services', 'common.controllers', 'common.directives', 'ui.router', 'ct.ui.router.extras.previous', 'ngMaterial', 'LocalStorageModule', 'angular-cache', 'ngMessages', 'cfp.hotkeys'])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', function($q, $rootScope, $injector) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401) {
                    var $state = $injector.get('$state');
                    $rootScope.$emit('refresh');
                    $state.go('login');
                }
                if(rejection.status >= 500 || rejection.status === 403) {
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

    $httpProvider.interceptors.push(['$q', 'permissionService', function($q, permissionService) {
        return {
            'response': function(response) {
                permissionService.setAuthorities(response.headers("X-MY-AUTHORITIES"));
                return response || $q.when(response);
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
                        template: require('../../templates/login.html'),
                        controller: 'LoginCtrl'
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
            .state('app.entries', {
                url: "/entries/:tag/:uuid",
                views: {
                    content: {
                        template: require('../../templates/subscription-entries.html'),
                        controller: 'SubscriptionEntryListCtrl'
                    },
                    actions: {
                        template: require('../../templates/subscription-entries-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.bookmarks', {
                url: "/bookmark/:tag",
                views: {
                    content: {
                        template: require('../../templates/subscription-entries.html'),
                        controller: 'BookmarkEntryListCtrl'
                    },
                    actions: {
                        template: require('../../templates/subscription-entries-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.entry', {
                url: "/entry/:uuid",
                views: {
                    content: {
                        template: require('../../templates/subscription-entry.html'),
                        controller: 'SubscriptionEntryCtrl'
                    },
                    actions: {
                        template: require('../../templates/default-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscriptions', {
                url: "/subscriptions",
                views: {
                    content: {
                        template: require('../../templates/subscriptions.html'),
                        controller: 'SubscriptionsCtrl'
                    },
                    actions: {
                        template: require('../../templates/subscriptions-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscription-add', {
                url: "/subscriptions/add",
                views: {
                    content: {
                        template: require('../../templates/subscription.html'),
                        controller: 'SubscriptionCtrl'
                    },
                    actions: {
                        template: require('../../templates/default-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscription', {
                url: "/subscriptions/:uuid",
                views: {
                    content: {
                        template: require('../../templates/subscription.html'),
                        controller: 'SubscriptionCtrl'
                    },
                    actions: {
                        template: require('../../templates/default-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.admin', {
                url: "/admin",
                views: {
                    content: {
                        template: require('../../templates/admin.html'),
                        controller: 'AdminCtrl'
                    },
                    actions: {
                        template: require('../../templates/admin-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })

            .state('app.feed', {
                url: "/feed",
                views: {
                    content: {
                        template: require('../../templates/feeds.html'),
                        controller: 'FeedsCtrl'
                    },
                    actions: {
                        template: require('../../templates/admin-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.feed-detail', {
                url: "/feed/:uuid",
                views: {
                    content: {
                        template: require('../../templates/feed-detail.html'),
                        controller: 'FeedDetailCtrl'
                    },
                    actions: {
                        template: require('../../templates/feed-detail-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    content: {
                        template: require('../../templates/settings.html'),
                        controller: 'SettingsCtrl'
                    },
                    actions: {
                        template: require('../../templates/default-actions.html'),
                        controller: 'TopBarActionsCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/entries//');
}])

.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('myreader').setStorageType('sessionStorage');
}])

.config(['$provide', function($provide) {

    $provide.decorator("$exceptionHandler", ['$delegate', '$log', function($delegate, $log){
        return function(exception, cause) {
            var isBadParse = exception.message.indexOf('[$sanitize:badparse]') === 0;
            if(isBadParse) {
                $log.warn(exception.message.substr(0,150) + '...');
            }
            if(!isBadParse) {
                $delegate(exception, cause);
            };
        };
    }]);
}])

.config(['hotkeysProvider', function(hotkeysProvider) {
    hotkeysProvider.includeCheatSheet = false;
    hotkeysProvider.useNgRoute = false;
}]);

