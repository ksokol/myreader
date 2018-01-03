import angular from 'angular';
import subscriptionTagsTemplate from '../../templates/subscription-tags.html';
import navigationAdminTemplate from '../../templates/navigation-admin.html';
import subscriptionEntriesTemplate from '../../templates/subscription-entries.html';
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
                        template: subscriptionEntriesTemplate,
                        controller: 'SubscriptionEntryListCtrl'
                    }
                }
            })
            .state('app.bookmarks', {
                url: '/bookmark/:entryTagEqual?q',
                views: {
                    content: {
                        template: '<div class="zero-padding-right"><my-bookmark></my-bookmark></div>'
                    }
                }
            })
            .state('app.subscriptions', {
                url: "/subscriptions?q",
                views: {
                    content: {
                        template: '<div class="zero-padding-right"><my-subscription-list></my-subscription-list></div>'
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
                        template: '<div><my-maintenance></my-maintenance></div>'
                    }
                }
            })
            .state('admin.feed', {
                url: "/feed",
                views: {
                    content: {
                        template: '<div><my-feed-list></my-feed-list></div>',
                    }
                }
            })
            .state('admin.feed-detail', {
                url: "/feed/:uuid",
                views: {
                    content: {
                        template: '<div><my-feed></my-feed></div>'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    content: {
                        template: '<div><my-settings></my-settings></div>'
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/entries//');
}]);
