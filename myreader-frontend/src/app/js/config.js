import angular from 'angular';

/**
 * @deprecated
 */
angular.module('common.config', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    body: {
                        template: '<my-login></my-login>'
                    }
                }
            })
            .state('app', {
                abstract: true,
                url: "/app",
                views: {
                    body: {
                        template: '<my-app></my-app>',
                    }
                }
            })
            .state('admin', {
                abstract: true,
                url: "/admin",
                views: {
                    body: {
                        template: '<my-app></my-app>',
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
                params: {
                    entryTagEqual: null,
                },
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
                url: '/overview',
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
        $urlRouterProvider.otherwise('/login');
}]);
