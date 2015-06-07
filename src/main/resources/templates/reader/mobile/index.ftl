<!DOCTYPE html>
<html ng-app="myreader">
    <head>
        <title>MyReader</title>
        <@style id="mobile"></@style>
        <meta name="viewport" content="initial-scale=1">
    </head>
    <body layout="row" ui-view="body">

        <script type="text/ng-template" id="SubscriptionTags">
            <md-sidenav layout="column" class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')">
                <md-toolbar></md-toolbar>

                <md-content flex role="navigation">
                    <ul class="subscription-tag-menu">
                        <li class="md-2-line" ng-repeat="item in data.tags" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}" ng-hide="item.unseen < 1">
                            <md-button md-no-ink class="md-button-toggle" ng-click="toggleOpen(item)">{{::item.title}} ({{item.unseen}})</md-button>
                            <ul ng-show="isOpen(item)" class="menu-toggle-list">
                                <li ng-repeat="subscription in item.subscriptions" ng-hide="subscription.unseen < 1">
                                    <md-button md-no-ink
                                            ng-class="{'active' : isSelected(subscription)}"
                                            ui-sref="app.entries-tag-subscription({tag: subscription.tag, uuid: subscription.uuid})">
                                        {{::subscription.title}} ({{subscription.unseen}})
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
                <md-toolbar ng-controller="TopBarCtrl">
                    <div class="md-toolbar-tools">
                        <md-button class="md-icon-button" hide-gt-sm ng-click="openMenu()" aria-label="Menu">
                            <md-icon md-font-library="material-icons">menu</md-icon>
                        </md-button>
                        <h2>
                            <span></span>
                        </h2>
                        <span flex></span>
                        <div ui-view="actions"></div>
                    </div>

                </md-toolbar>
                <div id="md-progress-linear-wrapper">
                    <md-progress-linear loading-indicator md-mode="indeterminate"></md-progress-linear>
                </div>

                <md-content ui-view="content" md-scroll-y flex layout-padding></md-content>
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
                            <div ng-bind-html="::entry.content" target-blank></div>
                        </md-content>
                    </md-tab>
                    <md-tab label="details" md-on-select="fetchTags()">
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

        <script type="text/ng-template" id="SubscriptionEntriesActions">
            <md-button class="md-icon-button" aria-label="Refresh" ng-click="refresh()">
                <md-icon md-font-library="material-icons">refresh</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Upload" ng-click="update()">
                <md-icon md-font-library="material-icons">file_upload</md-icon>
            </md-button>
        </script>

        <@script id="mobile"></@script>
    </body>
</html>
