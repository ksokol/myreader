angular.module('myreader', ['common.services', 'common.controllers', 'common.directives', 'ui.router', 'ct.ui.router.extras.previous'])

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
        .state('subscriptionTags', {
            url: "/subscriptionTags",
            templateUrl: 'subscriptionTags',
            controller: 'SubscriptionNavigationCtrl'
        })
        .state('entries-tags', {
            url: "/entries/:tag",
            templateUrl: 'SubscriptionEntries',
            controller: 'SubscriptionEntryListCtrl'
        })
        .state('entries-subscription', {
            url: "/entries/:uuid",
            templateUrl: 'SubscriptionEntries',
            controller: 'SubscriptionEntryListCtrl'
        })
        .state('entry', {
            url: "/entry/:uuid",
            templateUrl: 'SubscriptionEntry',
            controller: 'SubscriptionEntryCtrl'
        });
    $urlRouterProvider.otherwise('/subscriptionTags');
}]);
