<!DOCTYPE html>
<html ng-app="myreader">
    <head>
        <title>MyReader</title>
        <@style id="mobile"></@style>
        <meta name="viewport" content="initial-scale=1">
    </head>
    <body>
        <section layout="row" ui-view></section>

        <script type="text/ng-template" id="SubscriptionTags">
            <md-sidenav layout="column" class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')">
                <md-toolbar class="md-whiteframe-glow-z2"></md-toolbar>

                <md-content flex role="navigation">
                    <ul class="subscription-tag-menu">
                        <li class="md-2-line" ng-repeat="item in data.tags" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-hide="item.unseen < 1">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{::item.title}} ({{item.unseen}})</md-button>
                            <ul ng-show="isOpen(item)" class="menu-toggle-list">
                                <li ng-repeat="subscription in item.subscriptions" ng-hide="subscription.unseen < 1">
                                    <md-button
                                            ng-class="{'active' : isSelected(subscription)}"
                                            ui-sref="app.entries-tag-subscription({tag: subscription.tag, uuid: subscription.uuid})"
                                            >{{::subscription.title}} ({{subscription.unseen}})
                                    </md-button>
                                </li>
                            </ul>
                        </li>
                        <li class="md-2-line" ng-repeat="item in data.subscriptions" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-hide="item.unseen < 1">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{::item.title}} ({{item.unseen}})</md-button>
                        </li>
                        <li>
                            <!-- TODO -->
                            <md-button href="../web/logout">logout</md-button>
                        </li>
                    </ul>
                </md-content>
            </md-sidenav>
            <div layout="column" tabIndex="-1" role="main" flex>
                <md-toolbar class="md-whiteframe-glow-z2" ng-controller="TopBarCtrl">
                    <md-button class="md-icon-button" hide-gt-sm ng-click="openMenu()" aria-label="Menu">
                        <!-- TODO -->
                        <md-icon md-svg-src="../static/app/img/icons/ic_menu_24px.svg"></md-icon>
                    </md-button>
                    <div layout="row" flex class="fill-height"></div>
                        <md-progress-linear loading-indicator md-mode="indeterminate"></md-progress-linear>
                </md-toolbar>
                <md-content ui-view md-scroll-y flex layout-padding></md-content>
            </div>
        </script>

        <script type="text/ng-template" id="SubscriptionEntries">
            <md-list>
                <md-list-item md-no-ink class="md-2-line" ng-repeat="entry in data | filter: visible">
                    <div layout="row">
                        <div flex="95" class="md-list-item-text">
                            <h3 class="my-entry-title" ng-click="navigateToDetailPage(entry)">{{::entry.title}}</h3>
                            <p>{{::entry.feedTitle}}</p>
                        </div>
                        <div  flex="5">
                            <md-checkbox class="md-secondary" ng-model="::entry.seen"></md-checkbox>
                        </div>
                    </div>
                    <md-divider></md-divider>
                </md-list-item>
            </md-list>

            <section layout="row" layout-sm="column">
                <md-button class="md-raised" ng-click="markAsRead()" ng-show="data.length > 0">mark as read</md-button>
                <md-button class="md-raised" ng-click="refresh()">refresh</md-button>
            </section>
        </script>

        <script type="text/ng-template" id="SubscriptionEntry">
            <md-content class="md-padding">
                <md-tabs md-dynamic-height md-border-bottom>
                    <md-tab label="actions">
                        <md-content class="md-padding">
                            <section layout="row" layout-sm="column">
                                <md-button class="md-raised" target="_blank" ng-href="{{::entry.origin}}">show</md-button>
                                <md-button class="md-raised" ng-click="markAsRead()">read</md-button>
                                <md-button class="md-raised" ng-click="back()">back</md-button>
                            </section>
                        </md-content>
                    </md-tab>
                    <md-tab label="content">
                        <md-content class="md-padding">
                            <h3>{{::entry.title}}</h3>
                            <div ng-bind-html="::entry.content" wrap-entry-content></div>
                        </md-content>
                    </md-tab>
                    <md-tab label="details">
                        <md-content class="md-padding">
                            <h3>{{::entry.title}}</h3>
                            <md-select ng-options="" placeholder="none" ng-model="entry.tag">
                                <md-option ng-repeat="tag in availableTags" value="{{tag}}">{{tag}}</md-option>
                            </md-select>
                            <md-radio-group ng-model="entry.seen">
                                <md-radio-button ng-value="true">true</md-radio-button>
                                <md-radio-button ng-value="false">false</md-radio-button>
                            </md-radio-group>
                            <section layout="row" layout-sm="column">
                                <md-button class="md-raised" ng-click="save()">save</md-button>
                                <md-button class="md-raised" ng-click="back()">back</md-button>
                            </section>
                        </md-content>
                    </md-tab>
                </md-tabs>
            <md-content>
        </script>

        <@script id="mobile"></@script>
    </body>
</html>
