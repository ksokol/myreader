import angular from 'angular'
import {
  BookmarkListPageContainer,
  EntryStreamPageContainer,
  FeedListPageContainer,
  LoginPageContainer,
  MaintenancePageContainer,
  SettingsPageContainer,
  SubscribePageContainer,
  SubscriptionEditPageContainer,
  SubscriptionListPageContainer
} from './containers'

/**
 * part of AngularJS exit strategy
 * @deprecated
 */
function containerComponent(component, slot = 'content') {
  return {
    [slot]: {
      template: `<react-component class="my-container-component-bridge" 
                                  name="ContainerComponentBridge" 
                                  props="props">
                 </react-component>`,
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
        views: containerComponent(LoginPageContainer, 'body')
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
        views: containerComponent(EntryStreamPageContainer)
      })
      .state('app.bookmarks', {
        url: '/bookmark/:entryTagEqual?q',
        params: {
          entryTagEqual: null
        },
        views: containerComponent(BookmarkListPageContainer)
      })
      .state('app.subscriptions', {
        url: '/subscriptions?q',
        views: containerComponent(SubscriptionListPageContainer)
      })
      .state('app.subscription-add', {
        url: '/subscriptions/add',
        views: containerComponent(SubscribePageContainer)
      })
      .state('app.subscription', {
        url: '/subscriptions/:uuid',
        views: containerComponent(SubscriptionEditPageContainer)
      })
      .state('admin.overview', {
        url: '/overview',
        views: containerComponent(MaintenancePageContainer)
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
        views: containerComponent(SettingsPageContainer)
      })
    $urlRouterProvider.otherwise('/login')
  }])
