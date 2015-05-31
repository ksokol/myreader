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
            <md-sidenav layout="column" class="site-sidenav md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')">
                <md-toolbar class="md-whiteframe-glow-z2"></md-toolbar>

                <md-content flex role="navigation">
                    <ul class="subscription-tag-menu">
                        <li class="md-2-line" ng-repeat="item in data.tags" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}">
                            <md-button class="md-button-toggle" ng-click="toggleOpen(item)">{{item.title}} ({{item.unseen}})</md-button>
                            <ul ng-show="isOpen(item)" class="menu-toggle-list">
                                <li ng-repeat="subscription in item.subscriptions">
                                    <md-button
                                            ng-class="{'active' : isSelected(subscription)}"
                                            ui-sref="app.entries-tag-subscription({tag: subscription.tag, uuid: subscription.uuid})"
                                            >{{subscription.title}} ({{subscription.unseen}})
                                    </md-button>
                                </li>
                            </ul>
                        </li>
                        <li class="md-2-line" ng-repeat="item in data.subscriptions" class="parent-list-item" ng-class="{'parentActive' : isItemSelected(item)}">
                            <md-button class="md-button-toggle" ng-click="toggleOpen(item)">{{item.title}} ({{item.unseen}})</md-button>
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
                        <md-icon md-svg-src="../app/img/icons/ic_menu_24px.svg"></md-icon>
                    </md-button>
                    <div layout="row" flex class="fill-height"></div>
                        <md-progress-linear loading-indicator md-mode="indeterminate"></md-progress-linear>
                </md-toolbar>
                <md-content ui-view md-scroll-y flex layout-padding></md-content>
            </div>
        </script>

        <script type="text/ng-template" id="SubscriptionEntries">
            <table>
                <tr ng-repeat="entry in data">
                    <td class="col1">
                        <a ui-sref="entry({uuid: entry.uuid})">
                            <h3 class="entry-title">{{entry.title}}</h3>
                            <span class="entry-producer">{{entry.feedTitle}}</span>
                        </a>
                    </td>
                    <td class="col2">
                        <a target="_blank" ng-href="{{entry.origin}}">open</a>
                    </td>
                    <td class="col2">
                        <input ng-model="entry.seen" type="checkbox" name="id[]" value="{{entry.uuid}}">
                    </td>
                </tr>
            </table>

            <input class="read-button" type="submit" value="mark as read" ng-click="markAsRead()" ng-show="data.length > 0">
        </script>

        <script type="text/ng-template" id="SubscriptionEntry">
            <center>
                <h3>{{data.title}}</h3>

                <select ng-options="tag for tag in availableTags" ng-model="entry.tag">
                    <option value="">none</option>
                </select>

                <div id="chooseRadio">
                    <input type="radio" ng-value="true" ng-model="entry.seen"> seen
                    <input type="radio" ng-value="false" ng-model="entry.seen"> unseen
                </div>

                <div id="deprecatedEntryButtons">
                    <input class="button" type="button" value="save" ng-click="save()">
                    <input class="button" type="button" value="back" ng-click="back()">
                </div>
            </center>
        </script>

        <@script id="mobile"></@script>
    </body>
</html>
