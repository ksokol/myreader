import angular from 'angular';
import subscriptionTagsTemplate from '../../templates/subscription-tags.html';
import navigationAdminTemplate from '../../templates/navigation-admin.html';
import {unauthorized} from 'store';

angular.module('common.config', ['ui.router'])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$rootScope', '$ngRedux', function($q, $rootScope, $ngRedux) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401) {
                    $rootScope.$emit('refresh');
                    $ngRedux.dispatch(unauthorized());
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
                        template: subscriptionTagsTemplate,
                        controller: 'SubscriptionNavigationCtrl'
                    }
                }
            })
            .state('admin', {
                abstract: true,
                url: "/admin",
                views: {
                    body: {
                        template: navigationAdminTemplate,
                        controller: 'SubscriptionNavigationCtrl'
                    }
                }
            })
            .state('app.entries', {
                url: "/entries/:feedTagEqual/:feedUuidEqual?q",
                params: {
                    feedTagEqual: null,
                    feedUuidEqual: null
                },
                views: {
                    content: {
                        template: '<my-feed-stream></my-feed-stream>'
                    }
                }
            })
            .state('app.bookmarks', {
                url: '/bookmark/:entryTagEqual?q',
                views: {
                    content: {
                        template: '<my-bookmark></my-bookmark>'
                    }
                }
            })
            .state('app.subscriptions', {
                url: "/subscriptions?q",
                views: {
                    content: {
                        template: '<my-subscription-list></my-subscription-list>'
                    }
                }
            })
            .state('app.subscription-add', {
                url: "/subscriptions/add",
                views: {
                    content: {
                        template: '<my-subscribe></my-subscribe>'
                    }
                }
            })
            .state('app.subscription', {
                url: "/subscriptions/:uuid",
                views: {
                    content: {
                        template: '<my-subscription></my-subscription>'
                    }
                }
            })
            .state('admin.overview', {
                url: "/overview",
                views: {
                    content: {
                        template: '<my-maintenance></my-maintenance>'
                    }
                }
            })
            .state('admin.feed', {
                url: "/feed?q",
                views: {
                    content: {
                        template: '<my-feed-list></my-feed-list>',
                    }
                }
            })
            .state('admin.feed-detail', {
                url: "/feed/:uuid",
                views: {
                    content: {
                        template: '<my-feed></my-feed>'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    content: {
                        template: '<my-settings></my-settings>'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/entries//');
}]);
