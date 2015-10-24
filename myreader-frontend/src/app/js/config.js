window.write = function() {};

angular.module('myreader', ['common.filters', 'common.services', 'common.controllers', 'common.directives', 'ui.router', 'ct.ui.router.extras.previous', 'ngMaterial', 'LocalStorageModule', 'angular-cache', 'ngMessages', 'cfp.hotkeys'])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$window', '$rootScope', '$injector', function($q, $window, $rootScope, $injector) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401) {
                    var $state = $injector.get('$state');
                    $state.go('login');
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
                        templateUrl: 'Login',
                        controller: 'LoginCtrl'
                    }
                }
            })
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
            .state('app.entries', {
                url: "/entry/:tag/:uuid",
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
            .state('app.bookmarks', {
                url: "/bookmark/:tag",
                views: {
                    content: {
                        templateUrl: 'SubscriptionEntries',
                        controller: 'BookmarkEntryListCtrl'
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
                    },
                    actions: {
                        templateUrl: 'SubscriptionEntryActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscriptions', {
                url: "/subscriptions",
                views: {
                    content: {
                        templateUrl: 'Subscriptions',
                        controller: 'SubscriptionsCtrl'
                    },
                    actions: {
                        templateUrl: 'SubscriptionsActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscription-add', {
                url: "/subscriptions/add",
                views: {
                    content: {
                        templateUrl: 'Subscription',
                        controller: 'SubscriptionCtrl'
                    },
                    actions: {
                        templateUrl: 'SubscriptionAddActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.subscription', {
                url: "/subscriptions/:uuid",
                views: {
                    content: {
                        templateUrl: 'Subscription',
                        controller: 'SubscriptionCtrl'
                    },
                    actions: {
                        templateUrl: 'SubscriptionActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.admin', {
                url: "/admin",
                views: {
                    content: {
                        templateUrl: 'Admin',
                        controller: 'AdminCtrl'
                    },
                    actions: {
                        templateUrl: 'AdminActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            })
            .state('app.settings', {
                url: "/settings",
                views: {
                    content: {
                        templateUrl: 'Settings',
                        controller: 'SettingsCtrl'
                    },
                    actions: {
                        templateUrl: 'SettingsActions',
                        controller: 'TopBarActionsCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/entry//');
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

