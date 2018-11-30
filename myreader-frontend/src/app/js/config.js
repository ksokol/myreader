import angular from 'angular'
import {MaintenanceContainer, SettingsContainer, SubscriptionListPageContainer, FeedListPageContainer} from './containers'

/**
 * part of AngularJS exit strategy
 * @deprecated
 */
function containerComponent(component) {
  return {
    content: {
      template: '<react-component name="ContainerComponentBridge" props="props"></react-component>',
      controller: ['$scope', function ($scope) {
        $scope.props = {component: () => component}
      }]
    }
  }
}

/**
 * @deprecated
 */
angular.module('common.config', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          body: {
            template: '<my-login></my-login>'
          }
        }
      })
      .state('logout', {
        url: '/logout'
      })
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          body: {
            template: '<my-app></my-app>'
          }
        }
      })
      .state('admin', {
        abstract: true,
        url: '/admin',
        views: {
          body: {
            template: '<my-app></my-app>'
          }
        }
      })
      .state('app.entries', {
        url: '/entries/:feedTagEqual/:feedUuidEqual?q',
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
          entryTagEqual: null
        },
        views: {
          content: {
            template: '<my-bookmark></my-bookmark>'
          }
        }
      })
      .state('app.subscriptions', {
        url: '/subscriptions?q',
        views: containerComponent(SubscriptionListPageContainer)
      })
      .state('app.subscription-add', {
        url: '/subscriptions/add',
        views: {
          content: {
            template: '<my-subscribe></my-subscribe>'
          }
        }
      })
      .state('app.subscription', {
        url: '/subscriptions/:uuid',
        views: {
          content: {
            template: '<my-subscription></my-subscription>'
          }
        }
      })
      .state('admin.overview', {
        url: '/overview',
        views: containerComponent(MaintenanceContainer)
      })
      .state('admin.feed', {
        url: '/feed?q',
        views: containerComponent(FeedListPageContainer)
      })
      .state('admin.feed-detail', {
        url: '/feed/:uuid',
        views: {
          content: {
            template: '<my-feed></my-feed>'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        views: containerComponent(SettingsContainer)
      })
    $urlRouterProvider.otherwise('/login')
  }])
